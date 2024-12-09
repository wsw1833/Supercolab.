import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function ApprovalSignatures({
  signatures = [
    { name: 'Kenny', timestamp: '14 Nov 2024, 12:01:23pm', approved: true },
    { name: 'Zac', timestamp: '15 Nov 2024, 1:21:53pm', approved: false },
    { name: 'Leon', timestamp: '14 Nov 2024, 7:44:18pm', approved: true },
  ],
  totalApprovers = 3,
}) {
  const [isOpen, setIsOpen] = useState(true);

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
              {signatures.length} out of {totalApprovers} Approver(s)
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
            {!signature.approved && (
              <Button
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
}
