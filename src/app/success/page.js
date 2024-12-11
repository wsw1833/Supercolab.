'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Complete from '../../../public/animations/Complete.json';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useHedera } from '@/contexts/HederaContext';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
const success = () => {
  const { generateAcceptanceLink } = useHedera();
  const [link, setLink] = useState(generateAcceptanceLink);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center max-h-[5rem]">
      <div className="flex-1"></div>
      <Lottie animationData={Complete} loop={true} className="w-64 h-64 mt-6" />
      <span className="flex text-center w-[25rem] leading-tight	 font-inter font-semibold text-p1 text-[36px]">
        The Jar has been successfully created!
      </span>
      <span className="flex mt-4 text-center w-[38rem] font-inter font-semibold text-b3 text-[14px]">
        Please copy the URL link provided above and share it with the intended
        recipient. The recipient can use the link to accept the Jar, allowing
        them to proceed with the project. Thank you for using our platform to
        streamline your collaboration!
      </span>
      <Button
        onClick={copyToClipboard}
        className="w-[38rem] mt-6 h-[3rem] rounded-[12px] bg-p1 hover:bg-p3 flex flex-row justify-center "
      >
        <span className="flex items-center justify-center text-white font-inter font-medium text-[20px] h-[3rem]">
          {link}
        </span>
      </Button>
      <span className="flex mt-2 text-center font-inter font-semibold text-b3 text-[13px]">
        Click the Clipboard to copy
      </span>
      <Link href={'/'}>
        <Button className="mt-12 w-[12rem] h-[3rem] bg-white border border-p1 hover:bg-p1 hover:text-white font-inter font-semibold text-[14px] text-p1">
          Back to Dashboard
        </Button>
      </Link>
      <div className="flex-1"></div>
    </div>
  );
};

export default success;
