import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import PopDetails from './popDetails';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const statuscode = [
  {
    status: 'Success',
    color: 'bg-green',
  },
  {
    status: 'Failed',
    color: 'bg-red',
  },
  {
    status: 'Expired',
    color: 'bg-grey',
  },
  {
    status: 'Active',
    color: 'bg-blue',
  },
  {
    status: 'Pending',
    color: 'bg-yellow',
  },
];

const data = [
  {
    Jar: '12349',
    Creator: 'Alex Donkey',
    Asset: '100HBAR',
    Date: '18 Nov 2024',
    Status: 'Pending',
    Details: '12349',
  },
  {
    Jar: '12348',
    Creator: 'Wong Donkey',
    Asset: '1000HBAR',
    Date: '12 Nov 2024',
    Status: 'Active',
    Details: '12348',
  },
  {
    Jar: '12347',
    Creator: 'Wong Donkey',
    Asset: '1000HBAR',
    Date: '20 Oct 2024',
    Status: 'Expired',
    Details: '12347',
  },
  {
    Jar: '12346',
    Creator: 'Chang Donkey',
    Asset: '200HBAR',
    Date: '28 Sep 2024',
    Status: 'Failed',
    Details: '12346',
  },
  {
    Jar: '12345',
    Creator: 'Zac Donkey',
    Asset: '340HBAR',
    Date: '10 Sep 2024',
    Status: 'Success',
    Details: '12345',
  },
];

export default function dataTable() {
  const getStatusColor = (status) => {
    const statusEntry = statuscode.find((entry) => entry.status === status);
    return statusEntry ? statusEntry.color : 'bg-gray-300'; // Default to gray if no match found
  };

  const handleRouteClick = (jarID) => {
    <Link href={`/details/${jarID}`} />;
  };

  return (
    <div>
      <Table className="mt-10">
        <TableHeader className="rounded-[12px]">
          <TableRow className="bg-p2 text-[16px] text-center rounded-[12px] hover:bg-p2">
            <TableHead className="px-6 py-3 w-[100px] font-inter text-b2">
              Jar
            </TableHead>
            <TableHead className="px-10 w-[250px] font-inter text-b2">
              Creator
            </TableHead>
            <TableHead className="w-[180px] font-inter text-b2">
              Asset
            </TableHead>
            <TableHead className="w-[160px] font-inter text-b2">Date</TableHead>
            <TableHead className="pl-[5.8rem] w-[240px] font-inter text-left text-b2">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((data) => (
            <TableRow
              key={data.Jar}
              onClick={() => handleRouteClick(data.Details)}
            >
              <TableCell className="px-4 py-6 text-[18px] text-b1 text-inter font-medium">
                #{data.Jar}
              </TableCell>
              <TableCell className="px-10 py-4 text-[18px] text-b1 text-inter font-medium">
                {data.Creator}
              </TableCell>
              <TableCell className="py-4 text-[18px] text-b1 text-inter font-medium">
                {data.Asset}
              </TableCell>
              <TableCell className="py-4 text-[18px] text-b1 text-inter font-medium">
                {data.Date}
              </TableCell>
              <TableCell className="py-4 text-[18px] text-center text-b1 text-inter font-medium">
                <span
                  className={`inline-block w-[6rem] px-3 py-1 rounded-full font-medium text-white ${getStatusColor(
                    data.Status
                  )}`}
                >
                  {data.Status}
                </span>
              </TableCell>
              <TableCell className="py-4 text-[18px] text-center text-b1 text-inter font-medium ">
                <PopDetails jarID={data.Details} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
