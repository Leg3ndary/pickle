"use client";

import { useState } from "react";
import { FaRegImage } from "react-icons/fa6";

import { create, generate, sendData } from "@/app/game/backend";
import { AnimatePresence, motion } from "framer-motion";
import Confetti from "@/components/Confetti";
import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import prompts from "./words";

const delays = [
    "animation-delay-0",
    "animation-delay-300",
    "animation-delay-600",
    "animation-delay-900",
    "animation-delay-1200",
    "animation-delay-1500",
];

type GoogleImage = {
    url: string;
    height: number;
    width: number;
    ai?: boolean;
};

type openAIResponse = {
    revised_prompt?: string;
    url?: string;
};

enum GameStates {
    LOADING,
    PLAYING,
    ROUNDOVER,
}

export default function Game() {
    const [how, setHow] = useState<boolean>(true);
    const [board, setBoard] = useState<GoogleImage[]>([]);
    const [isCreating, setIsCreating] = useState<boolean>(false);
    const [prompt, setPrompt] = useState("");
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const [doConfetti, setDoConfetti] = useState<boolean>(false);
    const [updatePoints, setUpdatePoints] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [flashRed, setFlashRed] = useState<boolean>(false);
    const [gameState, setGameState] = useState<GameStates>(GameStates.LOADING);

    const handleCreate: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        createBoard(prompt);
    };

    const typewords = (prompt: string) => {
        setPrompt(prompt);
    }

    const getValidURLS = async (GoogleImages: GoogleImage[]) => {
        const checkUrl = async (image: GoogleImage) => {
            try {
                const response = await fetch(image.url);
                if (response.status === 200) {
                    return image;
                }
            } catch (error) {
                // console.error(`Error fetching ${image.url}:`, error);
            }
            return null;
        };

        let validUrls = [];
        let index = 0;

        while (validUrls.length < 8 && index < GoogleImages.length) {
            const batch = GoogleImages.slice(index, index + 5);
            const results = await Promise.all(batch.map(checkUrl));
            validUrls.push(...results.filter((result) => result !== null));
            index += 5;
        }
        validUrls = validUrls.slice(0, 8);
        await generate(prompt).then((data: openAIResponse) => {
            console.log(data);
            if (data) {
                let newImage: GoogleImage = {
                    url: data.url as string,
                    height: 800,
                    width: 600,
                    ai: true,
                };
                validUrls.push(newImage);

                sendData(prompt, validUrls as GoogleImage[], data);
            } else {
                console.log("No data received from generate");
                createBoard(prompt);
            }
        });
        setIsCreating(false);
        setGameState(GameStates.PLAYING);
        return validUrls;
    };

    const createBoard = (prompt: string) => {
        console.log("Attempting to create board");
        setGameState(GameStates.LOADING);
        setIsCreating(true);
        create(prompt).then((data) => {
            console.log(data);
            if (data && data.length > 0) {
                let images = [...data.slice(0, 75)].sort(
                    () => Math.random() - 0.5
                );
                let newBoard: GoogleImage[] = [];
                getValidURLS(images).then((validImages) => {
                    newBoard = (validImages as GoogleImage[]).sort(
                        () => Math.random() - 0.5
                    );
                    setBoard(newBoard);
                });
            } else {
                console.log("No data received from create");
                createBoard(prompt);
            }
        });
    };

    const handleSubmit = () => {
        if (selectedImage !== null) {
            if (board[selectedImage].ai) {
                console.log("Correct!");
                setScore(score + 100);
                setDoConfetti(true);
                setUpdatePoints(true);
                setGameState(GameStates.ROUNDOVER);
                setTimeout(() => {
                    setDoConfetti(false);
                    setUpdatePoints(false);
                }, 2500);
            } else {
                console.log("Incorrect!");
                setScore(score - 50);
                setFlashRed(true);
                setTimeout(() => {
                    setFlashRed(false);
                }, 400);
            }
        }
    };

    return (
        <>
            <main className="flex min-h-screen flex-col items-center p-16 bg-emerald-50">
                <AnimatePresence>
                    {how && (
                        <motion.div
                            className="rounded-lg bg-slate-100 w-[620px] shadow-2xl p-8 absolute"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                        >
                            <h2 className="text-3xl font-bold">How to Play</h2>
                            <p className="mt-4 text-lg">
                                6 images will appear on the screen given a
                                certain prompt, and you have to choose the image
                                that is generated by AI.
                            </p>
                            <div className="grid grid-flow-row grid-cols-3 gap-x-20 gap-y-10 p-8 pb-2 items-center justify-items-center">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        className={`h-24 w-40 bg-slate-200 rounded-lg flex justify-center items-center animate-bspin animation-delay-${
                                            i * 300
                                        }`}
                                        key={i}
                                    >
                                        <FaRegImage className="text-5xl text-slate-300" />
                                    </div>
                                ))}
                            </div>
                            <div className="w-full flex">
                                <button
                                    className="bg-green-400 text-white py-2 mx-2 mt-4 font-black px-8 rounded-lg ml-auto hover:bg-green-600 duration-500 ease-in-out"
                                    onClick={() => setHow(false)}
                                >
                                    Start Game
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold m-4">
                        Guess the AI image
                    </h1>
                    <p className="text-lg text-center font-bold">
                        Score:{" "}
                        <span
                            className={`${
                                score == 0
                                    ? "text-black"
                                    : score > 0
                                    ? "text-green-400"
                                    : "text-red-500"
                            }`}
                        >
                            {score}
                        </span>
                    </p>
                    <form
                        onSubmit={handleCreate}
                        className="flex justify-center items-center flex-col md:flex-row"
                    >
                        <input
                            type="text"
                            placeholder="Enter a prompt"
                            className="w-96 h-10 m-2 p-2 rounded-lg border-2 border-slate-200"
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button
                            type="button"
                            className="bg-blue-500 rounded-lg text-white h-10 w-10 mx-2 flex justify-center items-center"
                            onClick={() => typewords(prompts[Math.floor(Math.random() * prompts.length)])}
                        >
                            <GiPerspectiveDiceSixFacesRandom className="h-8 w-8" />
                        </button>
                        <button
                            type="submit"
                            className="bg-green-400 text-white py-2 font-black m-2 px-8 rounded-lg hover:bg-green-600 duration-500 ease-in-out disabled:cursor-not-allowed cursor-pointer"
                            disabled={isCreating || prompt.trim() === ""}
                        >
                            {isCreating ? "Loading..." : "Create Board"}
                        </button>
                    </form>
                </div>
                <div className="grid grid-flow-row grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-10 p-8 pb-2 items-center justify-items-center">
                    {board.map((img, i) => (
                        <div
                            className={`h-48 w-64 rounded-lg block justify-center items-center `}
                            key={i}
                        >
                            <img
                                key={i}
                                src={img.url}
                                height={img.height}
                                width={img.width}
                                alt={"image"}
                                className={`h-48 w-64 object-cover rounded-md border-4 cursor-pointer ${
                                    selectedImage == i
                                        ? "border-blue-600"
                                        : "hover:border-blue-600"
                                } duration-300 ease-in-out`}
                                onClick={() => setSelectedImage(i)}
                            />
                        </div>
                    ))}
                </div>
                <div className="w-full flex justify-center">
                    <button
                        className="bg-blue-500 text-white py-2 mx-2 mt-4 font-black px-8 rounded-lg hover:bg-blue-600 duration-500 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                        disabled={
                            selectedImage === null ||
                            gameState !== GameStates.PLAYING
                        }
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        Submit
                    </button>
                </div>
            </main>
            {doConfetti && <Confetti />}
            <AnimatePresence>
                {updatePoints && (
                    <motion.div
                        className="w-screen h-screen top-0 fixed left-0 bg-[#0000009A] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-green-500 text-5xl font-black">
                            +100
                        </h2>
                    </motion.div>
                )}
                {flashRed && (
                    <motion.div
                        className="w-screen h-screen top-0 fixed left-0 bg-[#FF000050] flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <h2 className="text-white text-5xl font-black">-50</h2>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
