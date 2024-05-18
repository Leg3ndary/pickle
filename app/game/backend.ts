"use server";
// import OpenAI from "openai";
import gis from "async-g-i-s";

export async function create(prompt: string) {
    const data = await gis(prompt, {
        query: { safe: "on" },
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    });
    return data;
}


// const openai = new OpenAI({
//     apiKey: process.env.apikey,
// });

// export async function generate(prompt: string) {
//     const response = await openai.images.generate({
//         model: "dall-e-3",
//         prompt: prompt,
//         n: 1,
//         size: "1024x1024",
//       });
//       console.log(response);
//     return response.data[0].url;
// }

