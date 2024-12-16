import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDataContext } from '@/contexts/dataContext';
import Link from 'next/link';

export default function PopDetails({ jarID }) {
  const { setDetails } = useDataContext();
  const handleDetails = () => {
    setDetails(true);
  };
  return (
    <DropdownMenu className="align-top">
      <DropdownMenuTrigger className="align-top">...</DropdownMenuTrigger>
      <DropdownMenuContent className="w-[11rem]">
        <DropdownMenuItem className="font-inter font-medium">
          <img src="primary_copy.svg" alt="copy" className="w-5 h-5" />
          Copy URL Link
        </DropdownMenuItem>
        {/*can pass the jarID for details here */}
        <Link href={`/details/${jarID}`}>
          <DropdownMenuItem
            className="font-inter font-medium"
            onClick={handleDetails}
          >
            <img src="details.svg" alt="copy" className="w-5 h-5" />
            View Details
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
