"use server";
import gis from "async-g-i-s";

export async function create(prompt: string) {
    const data = await gis(prompt, {
        query: { safe: "on" },
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    });
    return data;
}
