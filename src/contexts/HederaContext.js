'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { HashConnect, HashConnectConnectionState } from 'hashconnect';
import {
  AccountId,
  AccountInfoQuery,
  Client,
  FileCreateTransaction,
  Hbar,
  LedgerId,
  PublicKey,
  ScheduleCreateTransaction,
  TopicCreateTransaction,
  TransactionId,
  Timestamp,
  TransferTransaction,
} from '@hashgraph/sdk';

const appMetadata = {
  name: 'Hashgraph Hub Test',
  description: 'Testing Hashgraph Hub hashconnect',
  icons: [],
  url: 'localhost',
};

const HederaContext = createContext();

export function HederaProvider({ children }) {
  const [pairingData, setPairingData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(
    HashConnectConnectionState.Disconnected
  );
  const [hashconnect, setHashconnect] = useState(null);

  const accountId = pairingData ? pairingData.accountIds[0] : null;

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const hashconnect = new HashConnect(
      LedgerId.TESTNET,
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      appMetadata,
      true
    );

    hashconnect.pairingEvent.on((newPairing) => {
      setPairingData(newPairing);
    });

    hashconnect.disconnectionEvent.on(() => {
      setPairingData(null);
    });

    hashconnect.connectionStatusChangeEvent.on((connectionStatus) => {
      setConnectionStatus(connectionStatus);
    });

    await hashconnect.init();
    setHashconnect(hashconnect);
  };

  const disconnect = () => {
    hashconnect?.disconnect();
  };

  const connect = async () => {
    await hashconnect?.openPairingModal();
    sessionStorage.setItem(`AddressId`, pairingData.accountIds[0]);
  };

  const createJar = async ({
    projectName,
    description,
    amount,
    tokenType,
    recipient,
    approvers,
  }) => {
    if (!hashconnect || !pairingData) {
      throw new Error('Wallet not connected');
    }

    const accountId = AccountId.fromString(pairingData.accountIds[0]);
    const signer = hashconnect.getSigner(accountId);

    // Create a unique jar ID
    const jarId = crypto.randomUUID();

    // Store project details in Hedera File Service
    const fileTransaction = new FileCreateTransaction()
      .setContents(
        JSON.stringify({
          projectName,
          description,
          amount,
          tokenType,
          creator: accountId.toString(),
          recipient,
          approvers,
          createdAt: Date.now(),
          expiresAt: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days
          status: 'Pending',
        })
      )
      .setMaxTransactionFee(new Hbar(2));

    const frozenTransaction = await fileTransaction.freezeWithSigner(signer);
    const fileSubmit = await frozenTransaction.executeWithSigner(signer);
    const fileReceipt = await fileSubmit.getReceiptWithSigner(signer);
    const fileId = fileReceipt.fileId;

    // Calculate expiration time using Timestamp
    const expirationTime = Timestamp.fromDate(
      new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    );

    const hbarAmount = Hbar.fromString(amount);

    // Create the transfer transaction that will be scheduled
    const transferTransaction = new TransferTransaction()
      .addHbarTransfer(accountId, hbarAmount.negated())
      .addHbarTransfer(AccountId.fromString(recipient), hbarAmount);

    // Create scheduled transaction
    const scheduledTransfer = new ScheduleCreateTransaction()
      .setScheduledTransaction(transferTransaction)
      .setExpirationTime(expirationTime);

    const frozenScheduled = await scheduledTransfer.freezeWithSigner(signer);
    const scheduleSubmit = await frozenScheduled.executeWithSigner(signer);
    const scheduleReceipt = await scheduleSubmit.getReceiptWithSigner(signer);
    const scheduleId = scheduleReceipt.scheduleId;

    // Create consensus topic for attestation
    const topicTransaction = new TopicCreateTransaction().setTopicMemo(
      `jar-${jarId}`
    );

    const frozenTopic = await topicTransaction.freezeWithSigner(signer);
    const topicSubmit = await frozenTopic.executeWithSigner(signer);
    const topicReceipt = await topicSubmit.getReceiptWithSigner(signer);
    const topicId = topicReceipt.topicId;

    // Store the jar data in local storage for frontend reference
    const jarData = {
      id: jarId,
      fileId: fileId.toString(),
      scheduleId: scheduleId.toString(),
      topicId: topicId.toString(),
      projectName,
      description,
      amount,
      tokenType,
      creator: accountId.toString(),
      recipient,
      approvers,
      status: 'PENDING',
      approvals: [],
      createdAt: Date.now(),
      expiresAt: Date.now() + 3 * 24 * 60 * 60 * 1000,
    };

    const response = await fetch('/api/jars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jarData),
    });

    if (!response.ok) {
      throw new Error('Failed to store jar data in MongoDB');
    }

    localStorage.setItem(`jar-${jarId}`, JSON.stringify(jarData));

    return {
      jarId,
      acceptanceLink: `${appMetadata.url}/accept/${jarId}`,
    };
  };

  const generateAcceptanceLink = (jarId) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/accept/${jarId}`;
  };

  const checkJarExpiration = async (jarId) => {
    const jar = JSON.parse(localStorage.getItem(`jar_${jarId}`));
    if (jar && jar.status === 'PENDING' && Date.now() > jar.expiresAt) {
      await refundDeposit(jar);
      jar.status = 'EXPIRED';
      localStorage.setItem(`jar_${jarId}`, JSON.stringify(jar));
      return true;
    }
    return false;
  };

  const refundDeposit = async (jar) => {
    if (!hashconnect || !pairingData) {
      throw new Error('Wallet not connected');
    }

    const accountId = AccountId.fromString(pairingData.accountIds[0]);
    const signer = hashconnect.getSigner(accountId);

    const refundTransaction = new TransferTransaction()
      .addHbarTransfer(
        AccountId.fromString(jar.creatorAddress),
        new Hbar.fromString(jar.amount)
      )
      .setTransactionMemo(`Refund for Jar: ${jar.id}`)
      .freeze();

    const signedTransaction = await signer.signTransaction(refundTransaction);
    await signedTransaction.execute(hashconnect.getClient());
  };

  const value = {
    pairingData,
    connectionStatus,
    hashconnect,
    connect,
    disconnect,
    createJar,
    generateAcceptanceLink,
    checkJarExpiration,
    refundDeposit,
    accountId,
  };

  return (
    <HederaContext.Provider value={value}>{children}</HederaContext.Provider>
  );
}

export function useHedera() {
  const context = useContext(HederaContext);
  if (context === undefined) {
    throw new Error('useHedera must be used within a HederaProvider');
  }
  return context;
}
