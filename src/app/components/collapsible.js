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

const collapsible = ({ jarData }) => {
  const signatures = [
    { name: 'Kenny', timestamp: '14 Nov 2024, 12:01:23pm', approved: true },
    { name: 'Zac', timestamp: '15 Nov 2024, 1:21:53pm', approved: false },
    { name: 'Leon', timestamp: '14 Nov 2024, 7:44:18pm', approved: true },
  ];

  const [showApproveButton, setShowApproveButton] = useState(false);
  const { accountId, signScheduledTransfer } = useHedera();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (accountId && jarData) {
      const approver = jarData.approvers.includes(accountId);
      const hasSigned = jarData.approvals.includes(accountId);
      if (approver && !hasSigned) {
        setShowApproveButton(true);
      } else {
        setShowApproveButton(false);
      }
    }
  }, [jarData, accountId]);

  const handleApprove = async () => {
    const response = await signScheduledTransfer(jarData);
    if (response) {
      alert('sign successfully');
    }
  };

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
              {jarData.approvals.length} out of {jarData.approvers.length}{' '}
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
              <div className="flex items-center gap-3">
                <span className="text-lg w-[13rem]">{signature.name}</span>
                {signature.approved && (
                  <img src="/check.svg" className="h-6 w-6" />
                )}
                {signature.approved && (
                  <span className="text-muted-foreground">
                    {signature.timestamp}
                  </span>
                )}
              </div>
            </div>
            {showApproveButton && (
              <Button
                onClick={handleApprove}
                variant="outline"
                className="bg-p1 border border-p1 hover:bg-p1 hover:text-white font-inter font-semibold text-[14px] text-white"
              >
                Approve
              </Button>
            )}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default collapsible;
