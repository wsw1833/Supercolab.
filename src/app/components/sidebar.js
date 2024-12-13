'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link.js';
import { dashboard, addUser, sign } from '../../../public/index.js';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button.jsx';
import { useHedera } from '@/contexts/HederaContext.js';

const items = [
  {
    title: 'Dashboard',
    path: '/',
    icon: dashboard,
  },
  {
    title: 'Create Jar',
    path: '/create',
    icon: addUser,
  },
  {
    title: 'Members List',
    path: '/member',
    icon: sign,
  },
];

export default function sidebar({ page }) {
  const { accountId } = useHedera();
  const [isActive, setIsActive] = useState('Dashboard');

  const handleMenuClick = (menu) => {
    setIsActive(menu); // Update active menu on click
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(accountId);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex flex-row justify-center items-center text-[28px] pb-4 text-b1 font-inter font-bold py-4 bg-white">
          SuperColab.
          <span className="w-[2.5rem] h-[2.5rem] flex justify-center items-center">
            <img src={'./supercolab.svg'} alt="logo" />
          </span>
        </div>
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col w-full items-left justify-left mb-[22rem]">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive == item.title}
                      className="flex flex-row my-3 hover:bg-p2 h-[3rem] w-[14rem] data-[active=true]:bg-p2"
                      onClick={() => handleMenuClick(item.title)}
                    >
                      <Link
                        href={item.path}
                        className="flex flex-row w-full items-center"
                      >
                        <item.icon className="w-[2rem] h-[2rem] flex items-center justify-center mx-2" />
                        <div className="font-inter font-semibold text-[20px] text-b1 flex items-center justify-center">
                          {item.title}
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
              {/*wallet address here*/}
              <div className="flex flex-row items-center justify-center">
                <Button
                  onClick={copyToClipboard}
                  className="w-fit h-[3rem] bg-p1 hover:bg-p3 flex flex-row justify-around "
                >
                  <img
                    src="/hashpack.png"
                    alt="wallet"
                    className="w-[2rem] h-[2rem]"
                  />
                  <span className="w-[6.5rem] max-w-[7rem] text-white font-inter font-medium text-[16px]">
                    {accountId ? accountId : ''}
                  </span>
                  <img
                    src="/copy.png"
                    alt="copy"
                    className="w-[1.5rem] h-[1.5rem]"
                  />
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
