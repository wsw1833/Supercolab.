import Sidebar from './components/sidebar';
import Header from './components/header';
import './globals.css';
import { HederaProvider } from '@/contexts/HederaContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={'antialiased overflow-x-hidden'}>
        <HederaProvider>
          <Header />
          <main className="">{children}</main>
          <Sidebar />
        </HederaProvider>
      </body>
    </html>
  );
}
