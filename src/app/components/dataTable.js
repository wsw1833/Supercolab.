import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import PopDetails from './popDetails';
import { useDataContext } from '@/contexts/dataContext';

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

export default function DataTable() {
  const { data, loading, error } = useDataContext();

  const getStatusColor = (status) => {
    const statusEntry = statuscode.find((entry) => entry.status === status);
    return statusEntry ? statusEntry.color : 'bg-gray-300'; // Default to gray if no match found
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  return (
    <div className="grid-cols-11">
      <Table className="mt-8">
        <TableHeader className="rounded-[12px] bg-p2">
          <TableRow className="bg-p2 gap-[2rem] text-[16px] text-center rounded-[12px] hover:bg-p2">
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
            <TableRow key={data.jarId}>
              <TableCell className="px-4 py-6 text-[18px] text-b1 text-inter font-medium">
                #{data.jarId}
              </TableCell>
              <TableCell className="px-10 py-4 text-[18px] text-b1 text-inter font-medium">
                {data.creator}
              </TableCell>
              <TableCell className="py-4 text-[18px] text-b1 text-inter font-medium">
                {data.amount} HBAR
              </TableCell>
              <TableCell className="py-4 text-[18px] text-b1 text-inter font-medium">
                {new Date(data.createdAt).toLocaleDateString('en-GB')}
              </TableCell>
              <TableCell className="py-4 text-[18px] text-center text-b1 text-inter font-medium">
                <span
                  className={`inline-block w-[6rem] px-3 py-1 rounded-full font-medium text-white ${getStatusColor(
                    data.status
                  )}`}
                >
                  {data.status}
                </span>
              </TableCell>
              <TableCell className="py-4 text-[18px] text-center text-b1 text-inter font-medium ">
                <PopDetails jarID={data.jarId} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
