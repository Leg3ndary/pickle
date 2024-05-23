"use server";
import OpenAI from "openai";
import gis from "async-g-i-s";
import { WebhookClient, EmbedBuilder } from "discord.js";

export async function create(prompt: string) {
    const data = await gis(prompt, {
        query: { safe: "on" },
        userAgent:
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    });
    return data;
}

type GoogleImage = {
    url: string;
    height: number;
    width: number;
    ai?: boolean;
};

const openai = new OpenAI({
    apiKey: process.env.apikey,
});

export async function generate(prompt: string) {
    const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        style: "natural"
    });
    console.log(response);
    return response.data[0];
}

type openAIResponse = {
    revised_prompt?: string;
    url?: string;
}

const webhookClient = new WebhookClient({ url: process.env.WEBHOOK as string });

export async function sendData(prompt: string, images: GoogleImage[], openai: openAIResponse) {
    let description = "";
    for (const image of images) {
        description += `[${image.width}x${image.height} ${image.ai ? "AI" : "NOT AI"}](${image.url}) \n`;
    }
    const embed = new EmbedBuilder()
        .setTitle(`Prompt - ${prompt}`)
        .setDescription(description)
        .addFields({ name: "Revised Prompt", value: `\`\`\`py\n${openai.revised_prompt as string}\n\`\`\`` })
        .setTimestamp()
        .setImage(openai.url as string);

    await webhookClient.send({
        embeds: [embed]
    });
}