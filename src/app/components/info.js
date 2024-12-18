'use client';

import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useDataContext } from '@/contexts/dataContext';
import { useHedera } from '@/contexts/HederaContext';

const statuscode = [
  { status: 'Success', color: 'bg-green' },
  { status: 'Failed', color: 'bg-red' },
  { status: 'Expired', color: 'bg-grey' },
  { status: 'Active', color: 'bg-blue' },
  { status: 'Pending', color: 'bg-yellow' },
];

const role = [
  //{ role: 'Receiver', color: 'hover:bg-p1 bg-p1', action: 'Accept Jar' },
  { role: 'Creator', color: 'hover:bg-red bg-red', action: 'Terminate' }, //terminate button and refund from multisig to creator OR auto refund once expired.
  { role: 'Approver', color: 'bg-none' },
];

const Info = () => {
  let currentRole;
  let formattedDate;
  const { jarDetails, loading, error } = useDataContext();
  const { accountId, refundDeposit } = useHedera();
  const [status, setStatus] = useState('');
  const [userRole, setUserRole] = useState('Creator');

  if (loading && !jarDetails) {
    return <div>Loading...</div>; // Optionally show a loading state
  }

  useEffect(() => {
    if (jarDetails?.creator === accountId) {
      setUserRole('Creator');
    } else {
      setUserRole('Approver');
    }
    setStatus(jarDetails.status);
  }, [jarDetails, accountId]);

  const currentStatus = statuscode.find((s) => s.status === status);
  currentRole = role.find((r) => r.role === userRole);
  formattedDate = new Date(jarDetails.createdAt).toLocaleDateString('en-GB');

  const handleButton = async () => {
    refundDeposit(jarDetails);
  };

  return (
    <div className="w-[81rem] grid grid-cols-12 items-start justify-start">
      <span className="col-span-12 text-[20px] text-p1 font-inter font-medium">
        Jar Transfer
      </span>
      <span className="col-span-10 text-[28px] my-2 text-p1 font-inter font-bold">
        #{jarDetails.jarId}
      </span>
      <span
        className={`col-span-2 mx-9 text-[24px] flex items-center justify-center align-middle font-bold text-white text-center ${currentStatus?.color} font-inter rounded-[10px] h-[2.8rem]`}
      >
        {status}
      </span>
      <span className="col-span-12 font-inter font-medium text-[18px] text-b3">
        Created On {formattedDate}
      </span>
      <span className="col-span-12 w-[78rem] my-4 border-b-2 border-[#f5f5f5]"></span>
      <span className="col-start-1 flex mt-2 bg-p2 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] items-center justify-center align-middle">
        Project
      </span>
      <span className="col-span-3 flex mt-2 pl-8 w-[400px] border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-left items-center">
        {jarDetails.projectName}
      </span>
      {userRole !== 'Approver' &&
        !(status === 'Success' || status === 'Failed') && (
          <Button
            onClick={handleButton}
            className={`col-start-11 col-span-2 mx-10 text-[20px] flex items-center justify-center align-middle text-white text-center ${currentRole?.color} font-inter rounded-[10px] h-[2.5rem]`}
          >
            {currentRole?.action}
          </Button>
        )}
      <span className="col-start-1 flex mt-2 bg-p2 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] items-center justify-center align-middle">
        Creator
      </span>
      <span className="col-span-3 flex mt-2 pl-8 w-[400px] border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-left items-center">
        {jarDetails.creator}
      </span>
      <span className="col-start-1 flex mt-2 bg-p2 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] items-center justify-center align-middle">
        Recipient
      </span>
      <span className="col-span-3 flex mt-2 pl-8 w-[400px] border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-left items-center">
        {jarDetails.recipient}
      </span>
      <span className="col-start-1 w-[140px] flex mt-2 bg-p2 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] items-center justify-center align-middle">
        Asset Amount
      </span>
      <span className="col-span-3 flex mt-2 pl-12 w-[384px] border-p2 border-2 rounded-[10px] h-[3rem] font-inter font-semibold text-[16px] text-p1 text-left items-center justify-between">
        {jarDetails.amount} {jarDetails.tokenType}
        <img src="/hederaScan.png" alt="scan" className="h-8 w-8 mr-4" />
      </span>
      <a
        href={`https://testnet.mirrornode.hedera.com/api/v1/schedules/${jarDetails.scheduleId}`}
        target="_blank"
        className="col-span-3 flex mt-2 ml-20 h-[3rem] font-inter font-medium text-[14px] text-[#4747C7] underline underline-offset-2 text-right items-center"
      >
        View Transfer Memo
      </a>
      <span className="col-start-1 w-[150px] mt-6 font-inter font-medium text-[16px]">
        Project Description
      </span>
      <Textarea
        className="col-start-1 mt-2 w-[40rem] h-[12rem] text-b1"
        placeholder="Type your message here."
        value={jarDetails.description}
        disabled
      />
    </div>
  );
};

export default Info;
