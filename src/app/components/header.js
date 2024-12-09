import { Button } from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';
export default function header() {
  return (
    <div className="w-full z-10 px-4 sticky bg-white flex items-center justify-between top-0 h-[4rem] border-b border-[#f1f1f1]">
      <div className="flex-1"></div>
      <div className="flex items-center justify-center text-center">
        <Link href={'/'}>
          <span className="text-[28px] text-b1 font-inter font-bold flex items-center justify-center">
            <img
              src="/logo.jpg"
              alt="logo"
              className="w-[3rem] h-[3rem] flex flex-row"
            />
            SuperColab.
          </span>
        </Link>
      </div>
      <div className="flex-1 flex justify-end pr-4">
        <Button className="bg-p1 font-inter hover:bg-p3">Connect Wallet</Button>
      </div>
    </div>
  );
}
