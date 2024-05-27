import { Bot, InputFile, InlineKeyboard } from "grammy";
import puppeteer from "puppeteer";
import fs from "node:fs";

// Create a bot using the Telegram token
const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

const banks = ["Huntington Bank", "US BANK", "Citi Bank", "Flagstar Bank", "Uinta Bank", "UMB Bank",
"American Airlines Federal Credit Union", "Truist Bank", "Navy Federal Credit Union", "Key Bank", "Fifth Third Bank",
"Comerica Bank", "Fnbo", "Members First Credit Union", "BMO Harris Bank", "Citizens Bank", "PNC Bank", "Wells Fargo Bank"];
const updatedBanks = banks.map(bank => {
    return {
        text: bank,
        callback_data: bank
    };
});
const banksBy3 = [];

for (let i = 0; i < updatedBanks.length; i += 3) {
    banksBy3.push(updatedBanks.slice(i, i + 3));
}

const keyboard = { inline_keyboard: banksBy3 };

const genInvoice = async (bankName: string = "") => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    // Set the viewport to emulate a mobile device
    await page.setViewport({ width: 500, height: 1080, isMobile: true })
  
    // Your HTML code
    const invoiceHtml = await fs.readFileSync('invoiceHtmls/index.html', 'utf-8');
    
    // Set the HTML content of the page
    await page.setContent(invoiceHtml.replace('XXXXXXXXXX', bankName))
  
    // Take a screenshot of the page
    const invoiceImg = await page.screenshot({ path: 'exports/screenshot.png' })
  
    browser.close()

    return invoiceImg;
}

// const replyWithPhoto = async (ctx: any) => {
//     console.log('reply-with-photo');
//     const invoiceImg = await genInvoice();
//     console.log('invoiceHtml', invoiceImg);
//     ctx.replyWithPhoto(new InputFile(invoiceImg));
// }

const replyWithBanks = async (ctx: any) => {
    await ctx.reply("Select your bank:", {
        reply_markup: keyboard,
    });
}

bot.on('callback_query', async (ctx) => {
    const data = ctx.callbackQuery.data;
    const invoiceImg = await genInvoice(data);
    ctx.replyWithPhoto(new InputFile(invoiceImg));
});

bot.start()

bot.command("start", replyWithBanks);

bot.api.setMyCommands([
    { command: "start", description: "Get screenshots of bank invoice." },
]);