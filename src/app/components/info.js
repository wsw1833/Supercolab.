import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const statuscode = [
  {
    status: 'Success',
    color: 'bg-green',
  },
  {
    status: 'Failed',
    color: 'bg-red',
  },
  {
    status: 'Expired',
    color: 'bg-grey',
  },
  {
    status: 'Active',
    color: 'bg-blue',
  },
  {
    status: 'Pending',
    color: 'bg-yellow',
  },
];

const role = [
  {
    role: 'Receiver',
    color: 'hover:bg-p1 bg-p1',
    action: 'Accept Jar',
  },
  {
    role: 'Creator',
    color: 'hover:bg-red bg-red',
    action: 'Terminate',
  },
  {
    role: 'Approver',
    color: 'bg-none',
  },
];

const info = () => {
  const [status, setStatus] = useState('Success');
  const currentStatus = statuscode.find((s) => s.status === status);

  const [userRole, setUserRole] = useState('Creator');
  const currentRole = role.find((s) => s.role === userRole);

  //   useEffect(() => {
  //     setStatus('Failed');
  //   }, [status]);

  return (
    <div className="w-[81rem] grid grid-cols-12 items-start justify-start">
      <span className="col-span-12 text-[20px] text-p1 font-inter font-medium">
        Jar Transfer
      </span>
      <span className="col-span-10  text-[28px] my-2 text-p1 font-inter font-bold">
        #12345
      </span>
      <span
        className={`col-span-2 mx-9 text-[24px] flex items-center justify-center align-middle font-bold text-white text-center ${currentStatus?.color}     font-inter rounded-[10px] h-[2.8rem]`}
      >
        {status}
      </span>
      <span className="col-span-12 font-inter font-medium text-[18px] text-b3">
        Created On 12 Nov 2024
      </span>
      <span className="col-span-12 w-[78rem] my-4 border-b-2 border-[#f5f5f5]"></span>
      <span className="col-start-1 flex mt-2 bg-p2 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] items-center justify-center align-middle">
        Project
      </span>
      <span className="col-span-3 flex mt-2 pl-8 w-[400px] border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-left items-center">
        Creating a responsive website
      </span>
      {userRole !== 'Approver' && (
        <Button
          className={`col-start-11 col-span-2 mx-10 text-[20px] flex items-center justify-center align-middle text-white text-center ${
            currentRole === 'Approver' ? '' : currentRole?.color
          } font-inter rounded-[10px] h-[2.5rem]`}
        >
          {currentRole.action}
        </Button>
      )}
      <span className="col-start-1 flex mt-2 bg-p2 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] items-center justify-center align-middle">
        Creator
      </span>
      <span className="col-span-3 flex mt-2 pl-8 w-[400px] border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-left items-center">
        Alex Donkey
      </span>
      <span className="col-start-1 flex mt-2 bg-p2 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] items-center justify-center align-middle">
        Recipient
      </span>
      <span className="col-span-3 flex mt-2 pl-8 w-[400px] border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-left items-center">
        Darius Donkey
      </span>
      <span className="col-start-1 w-[140px] flex mt-2 bg-p2 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] items-center justify-center align-middle">
        Asset Amount
      </span>
      <span className="col-span-3 flex mt-2 pl-12 w-[384px] border-p2 border-2 rounded-[10px] h-[3rem] font-inter font-semibold text-[16px] text-p1   text-left items-center justify-between">
        {1000} HBAR
        <img src="/hederaScan.png" alt="scan" className="h-8 w-8 mr-4" />
      </span>
      <a
        href={'https://hashscan.io/mainnet/dashboard'}
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
        value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id."
        disabled
      />
    </div>
  );
};

export default info;
