'use client';

import { useState } from 'react';
import Link from 'next/link.js';
import { dashboard, addUser, sign, logo, copy } from '../../../public/index.js';
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
  const [isActive, setIsActive] = useState('Dashboard');

  const handleMenuClick = (menu) => {
    setIsActive(menu); // Update active menu on click
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <div className="flex flex-row justify-center items-center text-[28px] text-b1 font-inter font-bold py-4 bg-white">
          SuperColab.
          <span className="w-[3rem] h-[3rem] flex justify-center items-center">
            <img src="/logo.jpg" alt="logo" />
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
                <Button className="w-fit h-[3rem] bg-p1 hover:bg-p3 flex flex-row justify-around ">
                  <img
                    src="/hashpack.png"
                    alt="wallet"
                    className="w-[2rem] h-[2rem]"
                  />
                  <span className="text-white font-inter font-medium text-[20px]">
                    {'0.0.1234567'}
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
