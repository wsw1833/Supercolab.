'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { HashConnect, HashConnectConnectionState } from 'hashconnect';
import {
  AccountId,
  AccountInfoQuery,
  Client,
  FileCreateTransaction,
  Transaction,
  Hbar,
  LedgerId,
  PublicKey,
  ScheduleCreateTransaction,
  TopicCreateTransaction,
  TransactionId,
  Timestamp,
  TransferTransaction,
  KeyList,
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
  const [topic, setTopic] = useState(null);

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
      setTopic(newPairing.topic);
    });

    hashconnect.disconnectionEvent.on(() => {
      setPairingData(null);
      setAccountId(null);
      setTopic(null);
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
            let publicKey = PublicKey.fromStringED25519(response.key.key);
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

  const createScheduledTransfer = async (
    accountId,
    amount,
    recipient,
    adminKeys,
    signer
  ) => {
    try {
      // Calculate expiration time using Timestamp
      const expirationTime = Timestamp.fromDate(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      );

      const hbarAmount = Hbar.fromString(amount);
      // Create the transfer transaction that will be scheduled
      const transferTransaction = new TransferTransaction()
        .addHbarTransfer(accountId, hbarAmount.negated())
        .addHbarTransfer(AccountId.fromString(recipient), hbarAmount);

      // Create scheduled transaction
      const scheduledTransfer = new ScheduleCreateTransaction()
        .setScheduledTransaction(transferTransaction)
        .setAdminKey(adminKeys)
        .setPayerAccountId(accountId)
        .setExpirationTime(expirationTime);

      const frozenScheduled = await scheduledTransfer.freezeWithSigner(signer);

      const serializedTx = Buffer.from(frozenScheduled.toBytes()).toString(
        'base64'
      );

      //console.log('Serialized Transaction:', serializedTx);
      return serializedTx;
    } catch (error) {
      console.error('Transaction Creation Error:', error);
      alert('Failed to create transaction: ' + error.message);
    }
  };

  const createConsensusTopic = async (signer, jarId, submitKeys) => {
    // Create consensus topic for attestation
    const topicTransaction = new TopicCreateTransaction()
      .setTopicMemo(`jar-${jarId}`)
      .setSubmitKey(submitKeys);

    const frozenTopic = await topicTransaction.freezeWithSigner(signer);
    const topicSubmit = await frozenTopic.executeWithSigner(signer);
    const topicReceipt = await topicSubmit.getReceiptWithSigner(signer);
    const topicId = topicReceipt.topicId;

    console.log('new topic id is' + topicId);
    return topicId;
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

    const publicKeys = await getPublicKeys(approvers);
    const threshold = Math.ceil(approvers.length / 2);
    const adminKeys = new KeyList(publicKeys, threshold);
    const submitKeys = new KeyList(publicKeys, 1);

    //create schedule transaction
    const serializedTxn = await createScheduledTransfer(
      accountId,
      amount,
      recipient,
      adminKeys,
      signer
    );

    // Create a unique jar ID
    const jarId = crypto.randomUUID();

    //create consensus topic
    const topicId = createConsensusTopic(signer, jarId, submitKeys);

    const acceptLink = generateAcceptanceLink(jarId);
    // Store the jar data in local storage for frontend reference
    const jarData = {
      id: jarId,
      serializedTxn,
      scheduleId: null,
      topicId: topicId,
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
      approvals: [],
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
    if (!jarData.serializedTxn) {
      alert('No transaction to sign!');
      return;
    }
    try {
      const signer = hashconnect.getSigner(accountId);
      // Deserialize the transaction
      const deserializedTx = Transaction.fromBytes(
        Buffer.from(jarData.serializedTxn, 'base64')
      );

      // Check if current user is an approver
      if (!jarData.approvers.includes(accountId)) {
        alert('You are not authorized to sign this transaction!');
        return;
      }

      // Check if already signed
      if (jarData.approvals.includes(accountId)) {
        alert('You have already signed this transaction!');
        return;
      }

      // Sign the deserialized transaction
      const signature = await signer.sign(deserializedTx);

      const totalApprovers = updateJarApproval(
        jarData.id,
        accountId,
        signature
      );

      // Check if threshold is met
      if (totalApprovers >= jarData.threshold) {
        await executeTransaction(deserializedTx, jarData.approvals, jarData.id);
      }

      return true;
    } catch (error) {
      console.error('Signing Error:', error);
      alert('Failed to sign transaction: ' + error.message);
    }
  };

  const updateJarApproval = async (jarId, addressId, signature) => {
    try {
      let jar = JSON.parse(localStorage.getItem(`jar-${jarId}`));

      if (!jar) {
        console.error('Jar data not found in localStorage');
        return;
      }

      jar.approvals.push([addressId, signature]);

      // Save the updated jar back to localStorage
      localStorage.setItem(`jar-${jarId}`, JSON.stringify(jar));

      console.log('Jar updated:', jar);
      return jar.approvals.length;
    } catch (error) {
      console.error('Error updating approval:', error);
    }
  };

  const executeTransaction = async (deserializedTx, approvals, jarId) => {
    try {
      const accountId = AccountId.fromString(pairingData.accountIds[0]);
      const signer = hashconnect.getSigner(accountId);

      let jar = JSON.parse(localStorage.getItem(`jar-${jarId}`));
      const accountIds = approvals.map(([accountId, signature]) => accountId); // Extract accountIds
      const publicKeys = await getPublicKeys(accountIds);

      // Add collected signatures to transaction
      for (let i = 0; i < approvals.length; i++) {
        const [accountId, signature] = approvals[i];
        const publicKey = publicKeys[i];

        deserializedTx.addSignature(publicKey, signature);
      }

      // Execute the transaction
      const txResponse = await deserializedTx.executeWithSigner(signer);
      const receipt = await txResponse.getReceiptWithSigner(signer);

      jar.scheduleId = receipt.scheduleId;
      localStorage.setItem(`jar-${jarId}`, JSON.stringify(jar));

      console.log('Transaction executed:', receipt);
      alert('Transaction successfully executed!');
    } catch (error) {
      console.error('Execution Error:', error);
      alert('Transaction execution failed: ' + error.message);
    }
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
