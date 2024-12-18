'use client';
import React, { useState } from 'react';
import AcceptCard from '../../components/card';
import { Button } from '@/components/ui/button';

const AcceptPage = () => {
  const [visible, setVisible] = useState(true);

  const validateUser = (user) => {
    if (user === true) {
      setVisible(true);
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-10 justify-center">
      <div className="flex-1"></div>
      <AcceptCard />
      {visible && (
        <Button className="mt-10 w-[10rem] h-[3rem] bg-p1 border border-p1 hover:bg-white hover:text-p1 font-inter font-semibold text-[18px] text-white">
          Accept Jar
        </Button>
      )}
      <div className="flex-1"></div>
    </div>
  );
};

export default AcceptPage;
