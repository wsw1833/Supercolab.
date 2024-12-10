'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function PopDetails({ role }) {
  return (
    <DropdownMenu className="align-top">
      <DropdownMenuTrigger className="align-top">...</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[12rem]">
        <DropdownMenuItem className="font-inter text-b1 font-medium">
          <img src="swap.svg" alt="copy" className="w-5 h-5" />
          {`Change to ${!role ? 'Approver' : 'Recipient'}`}
        </DropdownMenuItem>
        {/*removing member from the list */}
        <DropdownMenuItem className="font-inter text-red font-medium focus:text-red">
          <img src="remove.svg" alt="copy" className="w-5 h-5" />
          Remove Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
