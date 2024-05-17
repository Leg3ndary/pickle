import Image from "next/image";

export default function Home() {
    return (
        <>
            <nav className="bg-green-400 px-6 py-2 flex flex-row items-center">
                <h1 className="text-white font-black text-2xl">
                    Pickle
                </h1>
                <ul className="flex space-x-4 text-white ml-auto font-bold">
                    <li>
                        <a href="/about">About</a>
                    </li>
                    <li>
                        <a href="/contact">Contact</a>
                    </li>
                </ul>
            </nav>
            <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
        </>
    );
}
