import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Pickle",
    description: "Wordle but with AI generated pictures",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <nav className="bg-green-400 px-6 py-2 flex flex-row items-center">
                    <h1 className="text-white font-black text-2xl"><Link href="/">Pickle</Link></h1>
                    <ul className="flex space-x-4 text-white ml-auto font-bold">
                        <li>
                            <Link href="/game" prefetch={false} className="transition-colors duration-500 hover:text-purple-500">New Game</Link>
                        </li>
                    </ul>
                </nav>
                {children}
            </body>
        </html>
    );
}
