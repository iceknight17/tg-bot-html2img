import { Bot, InputFile } from "grammy";
import puppeteer from "puppeteer";
import fs from "node:fs";

// Create a bot using the Telegram token
const bot = new Bot(process.env.TELEGRAM_TOKEN || "");

const introductionMessage = `Hello! I'm a Telegram bot.
I'm powered by IceKnight17, the next-generation serverless computing platform.`;

const genInvoice = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
  
    // Set the viewport to emulate a mobile device
    await page.setViewport({ width: 500, height: 1080, isMobile: true })
  
    // Your HTML code
    const invoiceHtml = await fs.readFileSync('invoiceHtmls/index.html', 'utf-8');
    console.log('invoiceHtml', invoiceHtml);
    // const html = `
    //   <html>
    //     <body>
    //       <h1>Hello, World!</h1>
    //     </body>
    //   </html>
    // `
  
    // Set the HTML content of the page
    await page.setContent(invoiceHtml)
  
    // Take a screenshot of the page
    const invoiceImg = await page.screenshot({ path: 'exports/screenshot.png' })
  
    browser.close()

    return invoiceImg;
}

const replyWithPhoto = async (ctx: any) => {
    console.log('reply-with-photo');
    const invoiceImg = await genInvoice();
    console.log('invoiceHtml', invoiceImg);
    ctx.replyWithPhoto(new InputFile(invoiceImg));
}

bot.start()

bot.on("message", replyWithPhoto);

bot.api.setMyCommands([
    { command: "start", description: "Get screenshots of bank invoice." },
]);