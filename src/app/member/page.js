import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';

import PopMembers from '../components/popMembers';
import Paging from '../components/pagination';

const members = [
  {
    name: 'Wong Donkey',
    address: '0.0.1234567',
    role: 'Approver',
    sign: true,
  },
  {
    name: 'Alex Donkey',
    address: '0.0.1234567',
    role: 'Approver',
    sign: true,
  },
  {
    name: 'Zhang Donkey',
    address: '0.0.1234567',
    role: 'Recipient',
    sign: false,
  },
  {
    name: 'Donkey Kong',
    address: '0.0.1234567',
    role: 'Recipient',
    sign: false,
  },
];

const memberPage = () => {
  return (
    <div className="ml-64 mt-10 h-[20rem] max-h-auto">
      <div className="grid grid-cols-11 items-center justify-center ml-14">
        <span className="col-span-11 text-[26px] font-inter font-semibold text-p1 ">
          Members List
        </span>
        <span className="col-span-11 mt-6 text-[22px] font-inter font-medium text-b1 ">
          Add New Members
        </span>
        <span className="col-span-12 w-[78rem] my-4 border-b-2 border-[#f5f5f5]"></span>
        <div className="col-start-1 col-span-2 w-full max-w-sm items-center ml-1">
          <Label
            htmlFor="wallet"
            className="text-[16px] font-inter text-b2 flex mb-2"
          >
            Wallet Address
          </Label>
          <Input
            type="text"
            id="wallet"
            placeholder="Example: 0.0.1234567"
            className="focus:border-p1 focus-visible:ring-p1 border-p2 h-[2.2rem]"
          />
        </div>
        <div className="col-start-4 col-span-2 w-full max-w-sm items-center">
          <Label
            htmlFor="names"
            className="text-[16px] font-inter text-b2 flex mb-2"
          >
            NickNames
          </Label>
          <Input
            type="text"
            id="names"
            placeholder="Example: Donkey Kong"
            className="focus:border-p1 focus-visible:ring-p1 border-p2 h-[2.2rem]"
          />
        </div>
        <div className="col-start-7 col-span-2 w-full max-w-sm items-center">
          <Label
            htmlFor="roles"
            className="text-[16px] font-inter text-b2 flex mb-2"
          >
            Roles
          </Label>
          <Select>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Recipient" />
            </SelectTrigger>
            <SelectContent className="text-[18px] font-inter ">
              <SelectItem value="recipient">Recipient</SelectItem>
              <SelectItem value="approver">Approver</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="col-span-2 mt-7 bg-p1 flex text-center w-[8rem] border border-p1 hover:bg-white hover:text-p1 font-inter font-semibold text-[16px] text-white">
          Add Members
        </Button>
        <span className="col-span-11 mt-8 text-[22px] font-inter  text-b1 ">
          Members
        </span>
        <span className="col-span-12 w-[78rem] my-4 border-b-2 border-[#f5f5f5]"></span>
        <div className="col-span-2 ml-1 h-fit mt-2">
          <Input
            placeholder="Search..."
            className="focus:border-p1 focus-visible:ring-p1 border-p2 h-[2.2rem]"
          />
        </div>
        <div className="col-start-1 col-span-9 ml-1">
          <Table className="mt-8">
            <TableHeader className="rounded-[12px] bg-p2">
              <TableRow className="bg-p2 flex flex-row justify-center gap-[10rem] items-center text-[16px] text-center rounded-[12px] hover:bg-p2">
                <TableHead className="text-b2 font-inter flex items-center">
                  NickNames
                </TableHead>
                <TableHead className="text-b2 font-inter flex items-center">
                  Wallet Address
                </TableHead>
                <TableHead className=" text-b2 font-inter flex items-center">
                  Role
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow
                  key={member.name}
                  className="flex px-4 justify-between items-center flex-row text-center align-middle"
                >
                  <TableCell className="py-6 text-[18px] text-b1 text-inter font-medium text-center">
                    <img src="/user.svg" />
                  </TableCell>
                  <TableCell className="py-4 text-[18px] text-b1 text-inter font-medium text-center">
                    {member.name}
                  </TableCell>
                  <TableCell className="py-4 text-[18px] text-b1 text-inter font-medium">
                    {member.address}
                  </TableCell>
                  <TableCell className="py-4 text-[18px] text-b1 text-inter font-medium">
                    {member.role}
                  </TableCell>
                  <TableCell className="py-4 text-[18px] text-center text-b1 text-inter font-medium ">
                    {}
                    <PopMembers role={member.sign} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="mr-56 mt-10 sticky">
        <Paging />
      </div>
    </div>
  );
};

export default memberPage;
