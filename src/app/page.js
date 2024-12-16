'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Picker from './components/datepicker';
import DataTable from './components/dataTable';
import { Input } from '@/components/ui/input';
import Paging from './components/pagination';
import { DataProvider, useDataContext } from '../contexts/dataContext';

export default function Dashboard() {
  return (
    <DataProvider>
      <TabsComponent />
    </DataProvider>
  );
}

function TabsComponent() {
  const { activeTab, setActiveTab } = useDataContext();

  return (
    <div className="w-full flex items-start max-h-[10rem]">
      <div className="flex-1"></div>
      <Tabs
        defaultValue="transfer"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-[22rem] mt-10 flex flex-col items-center justify-center"
      >
        <TabsList className="grid w-full h-fit grid-cols-2">
          <TabsTrigger
            value="transfer"
            className="text-[20px] w-full flex items-center"
          >
            <span className="text-[20px] text-b1 font-medium px-2">
              Transfer
            </span>
            <img src="connection.svg" className="h-6 w-6" />
          </TabsTrigger>
          <TabsTrigger value="review" className="text-[20px]">
            <span className="text-[20px] text-b1 font-medium px-2">Review</span>
            <img src="review.svg" className="h-6 w-6" />
          </TabsTrigger>
        </TabsList>
        <div className="ml-[13.5rem] w-[35.5rem] h-fit mt-10 flex flex-row">
          <Input
            placeholder="Search..."
            className="focus-visible-ring-p2 border-p2"
          />
          <Picker />
        </div>
        <div className="w-[60rem] ml-64 flex items-center justify-center mt-4">
          <DataTable />
        </div>
        <div className="w-[60rem] flex items-center justify-center mt-16">
          <Paging />
        </div>
      </Tabs>
      <div className="flex-1"></div>
    </div>
  );
}
