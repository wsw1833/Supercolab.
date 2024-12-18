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
import { Form } from '@/components/ui/form';
import { useHedera } from '@/contexts/HederaContext';
import { DataProvider, useDataContext } from '@/contexts/dataContext';

const tokens = [
  { value: 'HBAR', label: 'HBAR', icon: hbar },
  { value: 'USDT', label: 'USDT', icon: usdt },
  { value: 'WETH', label: 'WETH', icon: weth },
];

export default function Create() {
  return (
    <DataProvider>
      <CreateComponent />
    </DataProvider>
  );
}

function CreateComponent() {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    amount: '',
    tokenType: '',
    recipient: '',
    approvers: [],
  });

  const { pairingData, createJar } = useHedera();
  const { member, memberLoading } = useDataContext();

  if (memberLoading && !member) {
    return <div>Loading...</div>;
  }

  const [selectedToken, setSelectedToken] = useState(null);
  const [selectedApprovers, setSelectedApprovers] = useState([]);
  const [selectKey, setSelectKey] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('.....');

    if (!pairingData) {
      console.log('Please connect your wallet first');
      return;
    }

    try {
      console.log(formData);
      const result = await createJar(formData);

      // Redirect to success page
      if (result) {
        window.location.href = `/success?jarID=${result.jarId}`;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedApprovers.length === 0) {
      setSelectKey((prevKey) => prevKey + 1);
    }
  }, [selectedApprovers]);

  const handleTokenChange = (value) => {
    setSelectedToken(tokens.find((t) => t.value === value));
  };

  const handleApprovers = (value) => {
    if (!selectedApprovers.some((approve) => approve.walletId === value)) {
      const newApprovers = member.find((approve) => approve.walletId === value);
      setSelectedApprovers([...selectedApprovers, newApprovers]);
    }
    if (!formData.approvers.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        approvers: [...prev.approvers, value],
      }));
    }
  };

  const removeApprovers = (value) => {
    setSelectedApprovers(
      selectedApprovers.filter((approve) => approve.walletId !== value)
    );
    setFormData((prev) => ({
      ...prev,
      approvers: prev.approvers.filter((a) => a !== value),
    }));
  };

  return (
    <div className="ml-64 mt-10 h-[35rem] max-h-[55rem]">
      <div className="grid grid-cols-11 items-start justify-start ml-14">
        <Form onSubmit={handleSubmit}>
          <span className="col-span-11 text-[26px] font-inter font-semibold text-p1 ">
            Creating Jar
          </span>
          <span className="col-span-11 mt-4 text-[15px] font-inter font-medium text-b1 ">
            Name of the project
          </span>
          <Input
            value={formData.projectName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                projectName: e.target.value,
              }))
            }
            placeholder="Example: Creating a responsive website"
            className="mt-2 focus:border-p1 focus-visible:ring-p1 border-p2 w-[30rem]"
          />
          <span className="col-span-11 mt-4 text-[15px] font-inter font-medium text-b1 ">
            Project Descriptions
          </span>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="col-start-1 mt-2 w-[30rem] h-[12rem] text-b1 focus:border-p1 focus-visible:ring-p1 border-p2"
            placeholder="Type your message here."
          />
          <span className="col-span-11 mt-4 text-[15px] font-inter font-medium text-b1 ">
            Deposit Amount
          </span>
          {/* Deposit Input Here */}
          <Input
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
            className="col-span-3 mt-2 focus:border-p1 focus-visible:ring-p1 border-p2 h-[2.2rem] w-[22rem] z-1"
          />
          <Select
            value={formData.tokenType}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                tokenType: value,
              }))
            }
          >
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
          <Select
            value={formData.recipient}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                recipient: value,
              }))
            }
          >
            <SelectTrigger className="w-[22rem] col-span-3 mt-2 focus:border-p1 focus-visible:ring-p1 border-p2">
              <SelectValue placeholder="Select Recipient" />
            </SelectTrigger>
            <SelectContent>
              {member.map((mem) => (
                <SelectItem key={mem.nickName} value={mem.walletId}>
                  {mem.nickName}
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
                {member.map((mem) => (
                  <SelectItem
                    key={mem.nickName}
                    value={mem.walletId}
                    disabled={selectedApprovers.some(
                      (approve) => approve.walletId === mem.walletId
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      {mem.nickName}
                      {selectedApprovers.some(
                        (approve) => approve.walletId === mem.walletId
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
                    key={approve.walletId}
                    className="flex items-center justify-between bg-p2 rounded-md p-2"
                  >
                    {approve.nickName}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-white active:bg-p2"
                      onClick={() => removeApprovers(approve.walletId)}
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

          <Button
            onClick={handleSubmit}
            className="col-start-2 ml-6 mt-10 w-[10rem] h-[3rem] bg-p1 border border-p1 hover:bg-white hover:text-p1 font-inter font-semibold text-[18px] text-white"
          >
            Create
          </Button>
        </Form>
      </div>
    </div>
  );
}
