'use client';
import { Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { hbar, usdt, weth } from '../../../public';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import React from 'react';
import Link from 'next/link';
import { Form } from '@/components/ui/form';

const tokens = [
  { value: 'HBAR', label: 'HBAR', icon: hbar },
  { value: 'USDT', label: 'USDT', icon: usdt },
  { value: 'WETH', label: 'WETH', icon: weth },
];

const names = [
  { name: 'Wong Donkey' },
  { name: 'Zac Donkey' },
  { name: 'Zhang Donkey' },
];

const create = () => {
  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedApprovers, setSelectedApprovers] = useState([]);
  const [selectKey, setSelectKey] = useState(0);

  useEffect(() => {
    if (selectedApprovers.length === 0) {
      setSelectKey((prevKey) => prevKey + 1);
    }
  }, [selectedApprovers]);

  const handleTokenChange = (value) => {
    setSelectedToken(tokens.find((t) => t.value === value));
  };

  const handleApprovers = (value) => {
    if (!selectedApprovers.some((approve) => approve.name === value)) {
      const newApprovers = names.find((approve) => approve.name === value);
      setSelectedApprovers([...selectedApprovers, newApprovers]);
    }
  };

  const removeApprovers = (value) => {
    setSelectedApprovers(
      selectedApprovers.filter((approve) => approve.name !== value)
    );
  };

  return (
    <div className="ml-64 mt-10 h-[35rem] max-h-[55rem]">
      <div className="grid grid-cols-11 items-start justify-start ml-14">
        <Form>
          <span className="col-span-11 text-[26px] font-inter font-semibold text-p1 ">
            Creating Jar
          </span>
          <span className="col-span-11 mt-4 text-[15px] font-inter font-medium text-b1 ">
            Name of the project
          </span>
          <Input
            placeholder="Example: Creating a responsive website"
            className="mt-2 focus:border-p1 focus-visible:ring-p1 border-p2 w-[30rem]"
          />
          <span className="col-span-11 mt-4 text-[15px] font-inter font-medium text-b1 ">
            Project Descriptions
          </span>
          <Textarea
            className="col-start-1 mt-2 w-[30rem] h-[12rem] text-b1 focus:border-p1 focus-visible:ring-p1 border-p2"
            placeholder="Type your message here."
          />
          <span className="col-span-11 mt-4 text-[15px] font-inter font-medium text-b1 ">
            Deposit Amount
          </span>
          {/* Deposit Input Here */}
          <Input className="col-span-3 mt-2 focus:border-p1 focus-visible:ring-p1 border-p2 h-[2.2rem] w-[22rem] z-1" />
          <Select onValueChange={handleTokenChange}>
            <SelectTrigger className="col-start-4 w-[7.8rem] mt-2 h-[2.2rem] bg-white focus:ring-p1 border-p2 a">
              <SelectValue placeholder="Select Token">
                {selectedToken ? (
                  <div className="flex items-center">
                    {React.createElement(selectedToken.icon, {
                      className: 'mr-2 h-4 w-4',
                    })}
                    {selectedToken.label}
                  </div>
                ) : (
                  'Select Token'
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tokens</SelectLabel>
                {tokens.map((token) => (
                  <SelectItem key={token.value} value={token.value}>
                    <div className="flex items-center">
                      {React.createElement(token.icon, {
                        className: 'mr-2 h-4 w-4',
                      })}
                      {token.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Select Recipient Here */}
          <span className="col-span-11 mt-4 text-[15px] font-inter font-medium text-b1 ">
            Choose your Recipient
          </span>
          <Select>
            <SelectTrigger className="w-[22rem] col-span-3 mt-2 focus:border-p1 focus-visible:ring-p1 border-p2">
              <SelectValue placeholder="Select Recipient" />
            </SelectTrigger>
            <SelectContent>
              {names.map((n) => (
                <SelectItem key={n.name} value={n.name}>
                  {n.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Select Approvers here */}
          <span className="col-span-11 mt-6 text-[15px] font-inter font-medium text-b1 ">
            Approval Signatures
          </span>
          <span className="col-span-4 mt-2 text-[12px] font-inter font-medium text-b3 text-justify">
            Assets stored inside the Jar need to approve by majorities in order
            to be payout to the recipient. Add the the approvers from your
            approvers list and they will need to use their wallet to approve any
            transactions to the recipient.
          </span>
          <Select key={selectKey} onValueChange={handleApprovers}>
            <SelectTrigger className="w-[22rem] col-start-1 mt-2 focus:border-p1 focus-visible:ring-p1 border-p2">
              <SelectValue
                placeholder={`${
                  selectedApprovers.length == 0 ? 'Select your Approvers' : {}
                }`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Approvers</SelectLabel>
                {names.map((n) => (
                  <SelectItem
                    key={n.name}
                    value={n.name}
                    disabled={selectedApprovers.some(
                      (approve) => approve.name === n.name
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      {n.name}
                      {selectedApprovers.some(
                        (approve) => approve.name === n.name
                      ) && <Check className="h-4 w-4 text-green-500" />}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {selectedApprovers.length > 0 && (
            <div className="col-start-1 w-[22rem] mt-6 border rounded-md p-4 border-p2">
              <h3 className="text-[14px] font-medium mb-2">
                Selected Approvers:
              </h3>
              <ul className="space-y-2">
                {selectedApprovers.map((approve) => (
                  <li
                    key={approve.name}
                    className="flex items-center justify-between bg-p2 rounded-md p-2"
                  >
                    {approve.name}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-white active:bg-p2"
                      onClick={() => removeApprovers(approve.name)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Button className="col-start-1 col-span-1 mt-10 w-[8rem] h-[3rem] bg-white border border-p1 hover:bg-p1 hover:text-white font-inter font-semibold text-[18px] text-p1">
            Clear
          </Button>
          <Link href="/success">
            <Button className="col-start-2 ml-6 mt-10 w-[10rem] h-[3rem] bg-p1 border border-p1 hover:bg-white hover:text-p1 font-inter font-semibold text-[18px] text-white">
              Create
            </Button>
          </Link>
        </Form>
      </div>
    </div>
  );
};

export default create;
