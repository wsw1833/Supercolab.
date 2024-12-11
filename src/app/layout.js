import Sidebar from "./components/sidebar";
import Header from "./components/header";
import "./globals.css";
import { HedaraProvider } from "@/contexts/HedaraContext";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={"antialiased overflow-x-hidden"}>
                <HedaraProvider>
                    <Header />
                    <main className="">{children}</main>
                    <Sidebar />
                </HedaraProvider>
            </body>
        </html>
    );
}
