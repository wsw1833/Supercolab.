import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function card() {
  return (
    <Card className="w-[30rem]">
      <CardHeader>
        <CardTitle className="font-inter font-bold text-[28px] text-p1 text-left">{`Jar #${12345}`}</CardTitle>
      </CardHeader>
      <CardContent className="ml-4 grid grid-cols-7">
        <span className="col-span-2 flex my-2 w-[6.5rem] bg-p2 border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-center justify-center items-center">
          {`Project`}
        </span>
        <span className="col-span-5 flex my-2 pl-8 -ml-11 w-[21rem] border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-b2 text-left items-center">
          {`Creating a responsive website`}
        </span>
        <span className="col-span-2 flex my-2 w-[6.5rem] bg-p2 border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-center justify-center items-center">
          {`Creator`}
        </span>
        <span className="col-span-5 flex my-2 pl-8 -ml-11 w-[21rem] border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-b2 text-left items-center">
          {`Alex Donkey`}
        </span>
        <span className="col-span-2 flex my-2 w-[6.5rem] bg-p2 border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-center justify-center items-center">
          {`Recipient`}
        </span>
        <span className="col-span-5 flex my-2 pl-8 -ml-11 w-[21rem] border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] tect-b2 text-left items-center">
          {`Darius Donkey`}
        </span>
        <span className="col-span-2 flex my-2 w-[14rem] bg-p2 border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] text-center justify-center items-center">
          {`Recipient's Wallet Address`}
        </span>
        <span className="col-span-5 flex my-2 pl-8 ml-20 w-[13.3rem] border-p2 border-2 -mx-4 rounded-[10px] h-[3rem] font-inter font-medium text-[16px] tect-b2 text-left items-center">
          {`0.0.1287432`}
        </span>
      </CardContent>
      <CardFooter className="flex flex-col justify-start items-center">
        <span className="font-bold text-[30px] font-inter text-b2">
          {`Total Assets`}
        </span>
        <span className="font-bold mt-4 text-[28px] font-inter text-p1">
          {`2000 HBAR`}
        </span>
      </CardFooter>
    </Card>
  );
}
