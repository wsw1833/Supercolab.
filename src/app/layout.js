import Sidebar from './components/sidebar';
import Header from './components/header';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={'antialiased overflow-x-hidden'}>
        <Header />
        <main className="">{children}</main>
        <Sidebar />
      </body>
    </html>
  );
}
