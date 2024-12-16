'use client';

import Info from '../../components/info';
import Upload from '../../components/upload';
import CollapsibleApproval from '../../components/collapsible';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const JarDetails = () => {
  const params = useParams();
  const [jarData, setJarData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jarID = params.jarID;
    if (jarID) {
      const fetchJarData = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/jar/jarDetails/${jarID}`
          );
          if (response.ok) {
            const data = await response.json();
            console.log('jar details', data);
            setJarData(data);
          } else {
            console.error('Failed to fetch jar data.');
          }
        } catch (error) {
          console.error('Error fetching jar data:', error);
        }
      };
      fetchJarData();
    }
  }, [params]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="ml-64 mt-10 min-h-auto max-h-[50rem]">
      <div className="grid grid-cols-12 items-start justify-start ml-16">
        {jarData && <Info jarData={jarData} />}
        <span className="col-start-1 flex mt-6 font-inter font-medium text-[16px]">
          Documents
        </span>
        <span className="col-start-1 col-end-8 flex mt-2 font-inter font-medium text-[12px]">
          Upload any
          <span className="whitespace-pre-wrap text-[#4747C7]">
            {' '}
            document(s){' '}
          </span>
          to be associated with requests.
        </span>
        <div className="col-start-1 col-span-3 mt-2">
          <Upload />
        </div>
        {jarData && (
          <div className="grid grid-col-12 col-start-1 col-end-4 mt-[12rem]">
            <CollapsibleApproval jarData={jarData} />
          </div>
        )}
      </div>
      <div className="flex-1"></div>
    </div>
  );
};

export default JarDetails;
