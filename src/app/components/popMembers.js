'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDataContext } from '@/contexts/dataContext';

export default function PopDetails({ role, walletId }) {
  const { removeMember, updateRole } = useDataContext();

  const newRole = role === 'Approver' ? 'Recipient' : 'Approver';

  const roleHandle = async () => {
    updateRole({ role: newRole, walletId: walletId });
  };
  const removeHandle = async () => {
    removeMember({ walletId });
  };

  return (
    <DropdownMenu className="align-top">
      <DropdownMenuTrigger className="align-top">...</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[12rem]">
        <DropdownMenuItem
          onClick={roleHandle}
          className="font-inter text-b1 font-medium"
        >
          <img src="swap.svg" alt="copy" className="w-5 h-5" />
          {`Change to ${newRole}`}
        </DropdownMenuItem>
        {/*removing member from the list */}
        <DropdownMenuItem
          onClick={removeHandle}
          className="font-inter text-red font-medium focus:text-red"
        >
          <img src="remove.svg" alt="copy" className="w-5 h-5" />
          Remove Member
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
