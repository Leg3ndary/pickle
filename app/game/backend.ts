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
    // return "https://oaidalleapiprodscus.blob.core.windows.net/private/org-VQMdSS24ufcelrczDzZAjvR5/user-A03BQAAeqXCbDxXU6DhTXjKw/img-rpW9t27iExXgfUunTanPIc1w.png?st=2024-05-21T13%3A16%3A19Z&se=2024-05-21T15%3A16%3A19Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-05-21T10%3A31%3A29Z&ske=2024-05-22T10%3A31%3A29Z&sks=b&skv=2021-08-06&sig=yAsR09kmmBvO%2BmyPu8UFSoVVvqKm7e1loHemK%2BECEpk%3D";
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