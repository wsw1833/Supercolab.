'use client';

import React, { useEffect, useState, memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useHedera } from '@/contexts/HederaContext';
import { useDataContext } from '@/contexts/dataContext';
import { format } from 'date-fns';

const collapsible = () => {
  const formatTimestamp = (timestamp) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true, // 24-hour format
    };

    return new Intl.DateTimeFormat('en-GB', options).format(timestamp);
  };

  const { accountId, signScheduledTransfer, updateJarStatus } = useHedera();
  const [isOpen, setIsOpen] = useState(true);
  const { jarDetails, details, error } = useDataContext();
  const [signatures, setSignatures] = useState([]);

  let approver;
  let hasSigned;
  useEffect(() => {
    const delay = setTimeout(() => {
      if (accountId && jarDetails) {
        hasSigned = jarDetails.approvals.some(
          (approval) => approval[0] === accountId
        );
        const signatures = jarDetails.approvers.map((approver) => {
          // Check if the approver exists in the approvals list
          const approval = jarDetails.approvals.find(
            ([name]) => name === approver
          );

          const isApproved = approval && approval[1] !== null;

          return {
            name: approver,
            timestamp: approval ? approval[1] : null, // Get the timestamp if approved
            approved: isApproved, // True if approver is found in approvals
          };
        });
        setSignatures(signatures);
      }
    }, 1000);

    return () => clearTimeout(delay);
  }, [accountId, jarDetails]);

  const handleApprove = async () => {
    const response = await signScheduledTransfer(jarDetails);
    if (response) {
      console.log('success', response);
    }
  };

  if (details || !jarDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[30rem]">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full justify-between p-0 hover:bg-transparent hover:no-underline"
        >
          <span className="flex items-center gap-2 text-base font-medium">
            <span>Approvals Signatures - </span>
            <span>
              {jarDetails.approvals.length} out of {jarDetails.approvers.length}{' '}
              Approver(s)
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? '' : 'rotate-180'
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-4 space-y-3">
        {signatures.map((signature) => (
          <div
            key={signature.name}
            className="flex justify-between items-center align-middle rounded-lg border-2 border-p2 bg-card p-3"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-lg w-[13rem]">{signature.name}</span>
                {signature.approved ? (
                  <>
                    <img src="/check.svg" className="h-7 w-7" />
                    <span className="text-muted-foreground">
                      {formatTimestamp(signature.timestamp)}
                    </span>
                  </>
                ) : (
                  accountId === signature.name && (
                    <Button
                      onClick={handleApprove}
                      variant="outline"
                      className="bg-p1 border border-p1 hover:bg-p1 hover:text-white font-inter font-semibold text-[14px] text-white"
                    >
                      Approve
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default collapsible;
