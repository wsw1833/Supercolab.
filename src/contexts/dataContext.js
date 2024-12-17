'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHedera } from '@/contexts/HederaContext';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('transfer');
  const { accountId } = useHedera();
  const [jarId, setJarId] = useState(null);
  const [jarDetails, setJarDetails] = useState([]);
  const [details, setDetails] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [member, setMember] = useState([]);
  const [memberLoading, setMemberLoading] = useState(true);

  const fetchData = async () => {
    if (!accountId) {
      setData([]);
      setLoading(false);
      return; // Avoid unnecessary fetch if no accountId
    }

    try {
      // Dynamically select endpoint based on active tab
      const endpoint =
        activeTab === 'transfer'
          ? `${process.env.NEXT_PUBLIC_API_URL}/jar/jarRecipient/${accountId}`
          : `${process.env.NEXT_PUBLIC_API_URL}/jar/jarApprover/${accountId}`;

      setLoading(true);
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null); // Reset error on successful fetch
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'An unknown error occurred');
      setData([]); // Clear data on error
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  // Fetch data when accountId or activeTab changes
  useEffect(() => {
    fetchData();
  }, [accountId, activeTab]); // Dependency on both `accountId` and `activeTab`

  const fetchJarDetails = async () => {
    if (!jarId) {
      setDetails(false);
      return; // Avoid unnecessary fetch if no accountId
    }
    try {
      setDetails(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jar/jarDetails/${jarId}`
      );
      const data = await response.json();
      setJarDetails(data);
      //console.log(data);
    } catch (error) {
      console.error('Error fetching jar details:', error);
    } finally {
      setDetails(false); // Ensure loading state is reset
    }
  };

  useEffect(() => {
    if (jarId) {
      fetchJarDetails();
    }
  }, [jarId]);
  const fetchMemberDetails = async () => {
    if (!accountId) {
      setMember([]);
      setMemberLoading(false);
      return;
    }
    try {
      setMemberLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/getMember/${accountId}`
      );
      if (response.status == 204) {
        setMember([]);
        return;
      }
      const data = await response.json();
      setMember(data);
    } catch (error) {
      console.error('Error fetching jar details:', error);
    } finally {
      setLoading(false);
      setIsCreate(false);
    }
  };
  useEffect(() => {
    fetchMemberDetails();
  }, [isCreate, accountId]);

  const removeMember = async ({ walletId }) => {
    if (!accountId) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/removeMember`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accountId, walletId }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching jar details:', error);
    } finally {
      fetchMemberDetails();
    }
  };

  const updateRole = async ({ role, walletId }) => {
    if (!accountId) {
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/changeRole`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accountId, walletId, role }),
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching jar details:', error);
    } finally {
      fetchMemberDetails();
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        jarDetails,
        memberLoading,
        member,
        setIsCreate,
        loading,
        error,
        activeTab,
        setActiveTab,
        fetchData,
        fetchJarDetails,
        jarId,
        setJarId,
        setDetails,
        details,
        fetchMemberDetails,
        setMember,
        removeMember,
        updateRole,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
