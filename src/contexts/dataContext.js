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
  const [jarDetails, setJarDetails] = useState([]);

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
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/jar/jarDetails/${jarID}`
      );
      const data = await response.json();
      setJarDetails(data);
    } catch (error) {
      console.error('Error fetching jar details:', error);
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        jarDetails,
        loading,
        error,
        activeTab,
        setActiveTab,
        fetchData,
        fetchJarDetails,
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
