'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { HashConnect, HashConnectConnectionState } from 'hashconnect';
import {
  AccountId,
  Hbar,
  LedgerId,
  PublicKey,
  ScheduleCreateTransaction,
  AccountCreateTransaction,
  TopicCreateTransaction,
  Timestamp,
  TransferTransaction,
  KeyList,
  ScheduleSignTransaction,
  ScheduleInfoQuery,
} from '@hashgraph/sdk';

const appMetadata = {
  name: 'SuperColab Testing',
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
  const [accountId, setAccountId] = useState(null);

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
      setAccountId(newPairing.accountIds[0]);
    });

    hashconnect.disconnectionEvent.on(() => {
      setPairingData(null);
      setAccountId(null);
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
  };

  const getPublicKeys = async (accountIDs) => {
    let results = []; // Array to store public keys
    for (const account of accountIDs) {
      try {
        console.log(results);
        const URL = `https://testnet.mirrornode.hedera.com/api/v1/accounts/${account}`;
        const request = await fetch(URL);
        const response = await request.json();
        if (response?.key?.key) {
          try {
            let publicKey;
            if (response.key.key.includes('ed25519')) {
              publicKey = PublicKey.fromStringED25519(response.key.key); // Handle ED25519 keys
            } else {
              publicKey = PublicKey.fromString(response.key.key); // Handle other key formats
            }
            results.push(publicKey);
          } catch (conversionError) {
            console.error(
              `Failed to convert public key for account ${account}:`,
              conversionError,
              `Raw key: ${response.key.key}`
            );
          }
        }
      } catch (error) {
        console.error(
          `Failed to fetch public key for account ${account}:`,
          error
        );
      }
    }
    console.log(results);
    return results; // Return the array of results
  };

  const createMultiSig = async (threshold, publicKeys, amount, signer) => {
    const keyList = new KeyList(publicKeys, threshold);

    const hbarAmount = Hbar.fromString(amount);

    // Create account with KeyList
    const createAccountTransaction = new AccountCreateTransaction()
      .setInitialBalance(hbarAmount)
      .setKey(keyList);

    const freezeAccount = await createAccountTransaction.freezeWithSigner(
      signer
    );
    const response = await freezeAccount.executeWithSigner(signer);
    const receipt = await response.getReceiptWithSigner(signer);

    console.log('The multi-sig account id is :', receipt.accountId.toString());
    return receipt.accountId.toString();
  };

  const createScheduledTransfer = async (
    jarId,
    publicKeys,
    amount,
    recipient,
    multiSig,
    signer
  ) => {
    try {
      // Calculate expiration time using Timestamp
      const expirationTime = Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      );

      const adminKeys =
        publicKeys.length > 1 ? new KeyList(publicKeys, 1) : publicKeys[0];

      const hbarAmount = Hbar.fromString(amount);

      // Create the transfer transaction that will be scheduled
      const transferTransaction = new TransferTransaction()
        .addHbarTransfer(AccountId.fromString(multiSig), hbarAmount.negated())
        .addHbarTransfer(AccountId.fromString(recipient), hbarAmount);

      // Create scheduled transaction
      const scheduledTransfer = new ScheduleCreateTransaction()
        .setScheduledTransaction(transferTransaction)
        .setExpirationTime(expirationTime)
        .setScheduleMemo(`Jar-${jarId} Scheduled Transaction`)
        .setAdminKey(adminKeys);

      const freezedScheduled = await scheduledTransfer.freezeWithSigner(signer);
      const executedScheduled = await freezedScheduled.executeWithSigner(
        signer
      );
      const receipt = await executedScheduled.getReceiptWithSigner(signer);

      if (!receipt.scheduleId) {
        throw new Error('No scheduleId found in transaction receipt.');
      }

      const scheduleId = receipt.scheduleId.toString();
      console.log('The schedule ID is ' + scheduleId);

      const scheduledTxId = receipt.scheduledTransactionId.toString();
      console.log('The scheduled transaction ID is ' + scheduledTxId);
      return { scheduleId, scheduledTxId };
    } catch (error) {
      console.error('Transaction Creation Error:', error);
      alert('Failed to create transaction: ' + error.message);
    }
  };

  const createConsensusTopic = async (signer, jarId, submitKeys) => {
    // Create consensus topic for attestation
    const topicTransaction = new TopicCreateTransaction()
      .setTopicMemo(`jar-${jarId} HCS`)
      .setSubmitKey(submitKeys);

    const frozenTopic = await topicTransaction.freezeWithSigner(signer);
    const topicSubmit = await frozenTopic.executeWithSigner(signer);
    const topicReceipt = await topicSubmit.getReceiptWithSigner(signer);
    const topicId = topicReceipt.topicId;

    console.log('new topic id is ' + topicId);
    return topicId.toString();
  };

  const createJar = async ({
    projectName,
    description,
    amount,
    tokenType,
    recipient,
    approvers,
  }) => {
    if (!hashconnect) {
      throw new Error('HashConnect is not initialized.');
    }
    if (!pairingData || !pairingData.accountIds?.length) {
      throw new Error('Wallet not connected or pairing data is invalid.');
    }

    const accountId = AccountId.fromString(pairingData.accountIds[0]);
    const signer = hashconnect.getSigner(accountId);

    const publicKeys = await getPublicKeys(approvers);
    const threshold = Math.ceil(approvers.length / 2);
    const submitKeys = new KeyList(publicKeys, 1);

    const multiSig = await createMultiSig(
      threshold,
      publicKeys,
      amount,
      signer
    );

    // Create a unique jar ID
    const jarId = crypto.randomUUID();

    // Create schedule transaction
    const scheduled = await createScheduledTransfer(
      jarId,
      publicKeys,
      amount,
      recipient,
      multiSig,
      signer
    );

    const scheduleId = scheduled.scheduleId;
    const scheduledTxId = scheduled.scheduledTxId;

    const topicId = await createConsensusTopic(signer, jarId, submitKeys);

    const acceptLink = generateAcceptanceLink(jarId);

    const jarData = {
      id: jarId,
      multiSig,
      scheduleId,
      scheduledTxId,
      topicId,
      projectName,
      description,
      amount,
      tokenType,
      creator: accountId.toString(),
      recipient,
      approvers,
      status: 'PENDING',
      URILink: acceptLink,
      threshold,
      approvals: [accountId.toString(), Date.now()],
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
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
      acceptanceLink: acceptLink,
    };
  };

  const generateAcceptanceLink = (jarId) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/accept/${jarId}`;
  };

  const signScheduledTransfer = async (jarData) => {
    const scheduleId = jarData.scheduleId.toString();
    if (!scheduleId) {
      alert('No transaction to sign!');
      return;
    }
    try {
      const accountId = AccountId.fromString(pairingData.accountIds[0]);
      const stringId = accountId.toString();
      const signer = hashconnect.getSigner(accountId);

      console.log('string', stringId);
      console.log('signer', signer);

      // Check if current user is an approver
      if (!jarData.approvers.includes(stringId)) {
        alert('You are not authorized to sign this transaction!');
        return;
      }

      // Check if already signed
      if (jarData.approvals.includes(stringId)) {
        alert('You have already signed this transaction!');
        return;
      }

      // Sign the deserialized transaction
      const signature = await new ScheduleSignTransaction().setScheduleId(
        scheduleId
      );

      const freezeSign = await signature.freezeWithSigner(signer);
      const submitSign = await freezeSign.executeWithSigner(signer);
      const receipt = await submitSign.getReceiptWithSigner(signer);
      console.log('receipt', receipt);

      if (receipt) {
        updateJarApproval(jarData.id, stringId);
      }

      const query = await new ScheduleInfoQuery().setScheduleId(scheduleId);

      console.log('queryInfo', query);

      const URL = `https://testnet.mirrornode.hedera.com/api/v1/schedules/${scheduleId}`;
      const request = await fetch(URL);
      const response = await request.json();
      if (response.executed_timestamp != null) {
        // add execution timestamp at mongodb and change status to success for jar.
        console.log(
          `This transaction ${scheduleId} has been executed at `,
          response.executed_timestamp
        );
      }
      return true;
    } catch (error) {
      console.error('Signing Error:', error);
      alert('Failed to sign transaction: ' + error.message);
    }
  };

  const updateJarApproval = async (jarId, addressId) => {
    try {
      let jar = JSON.parse(localStorage.getItem(`jar-${jarId}`));

      if (!jar) {
        console.error('Jar data not found in localStorage');
        return;
      }

      const Timestamp = date.now();

      jar.approvals.push([addressId, Timestamp]);

      // Save the updated jar back to localStorage
      localStorage.setItem(`jar-${jarId}`, JSON.stringify(jar));

      console.log('Jar updated:', jar);
      return jar.approvals.length;
    } catch (error) {
      console.error('Error updating approval:', error);
    }
  };

  const checkJarExpiration = async (jarId) => {
    const jar = JSON.parse(localStorage.getItem(`jar_${jarId}`));
    if (jar && jar.status === 'PENDING' && Date.now() > jar.expiresAt) {
      //update jar status to expired and auto-trigger refund back to creator.
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
    getPublicKeys,
    signScheduledTransfer,
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
