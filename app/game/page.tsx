"use client";

import { useEffect, useState } from "react";
import { FaRegImage } from "react-icons/fa6";

import { create } from "@/app/game/backend";

const delays = [
    "animation-delay-0",
    "animation-delay-300",
    "animation-delay-600",
    "animation-delay-900",
    "animation-delay-1200",
    "animation-delay-1500",
];

export default function Game() {
    const [how, setHow] = useState(true);
    const [board, setBoard] = useState<string[]>([]);

    useEffect(() => {
        // choose 6 random images from data
        // create().then((data) => console.log(data));
        create().then((data) => {
            // choose 6 random images from data
            const randImages = [...data].sort(() => Math.random() - 0.5);
            const images = randImages.slice(0, 6);
            
            setBoard(images);
        });
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            {how && (
                <div className="rounded-lg bg-slate-100 w-[620px] shadow-2xl p-8">
                    <h2 className="text-3xl font-bold">How to Play</h2>
                    <p className="mt-4 text-lg">
                        6 images will appear on the screen given a certain
                        prompt, and you have to choose the image that is
                        generated by AI.
                    </p>
                    <div className="grid grid-flow-row grid-cols-3 grid-rows-2 gap-x-20 gap-y-10 p-8 pb-2 items-center justify-items-center">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                className={`h-24 w-40 bg-slate-200 rounded-lg flex justify-center items-center animate-bspin animation-delay-${
                                    i * 300
                                }`}
                            >
                                <FaRegImage className="text-5xl text-slate-300" />
                            </div>
                        ))}
                    </div>
                    <div className="w-full flex">
                        <button
                            className="bg-green-400 text-white py-2 mx-2 mt-4 font-black px-8 rounded-lg ml-auto"
                            onClick={() => setHow(false)}
                        >
                            Start Game
                        </button>
                    </div>
                    {/* create a board */}
                </div>
            )}
        </main>
    );
}
