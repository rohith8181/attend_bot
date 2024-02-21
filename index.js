const express = require('express');
const app = express();
const puppeteer = require('puppeteer')
const cron = require('node-cron');

const PORT = process.env.PORT || 5000

const autoattend = async () => {
    try {
        console.log("Scheduled function started...")
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto('https://portal.uptricksservices.com/dashboard-page/');

        const userselector = 'input[type="text"][name="log"]';
        await page.waitForSelector(userselector);
        await page.type(userselector, process.env.USER_NAME)


        const passselector = 'input[type="password"][name="pwd"]';
        await page.waitForSelector(passselector);
        await page.type(passselector, process.env.PASSWORD)

        const subselctor = 'button[type="submit"]';
        await page.waitForSelector(subselctor);
        await page.click(subselctor);


        const punchselector = '#menu-item-235';
        await page.waitForSelector(punchselector);
        await page.click(punchselector);

        await new Promise(resolve => setTimeout(resolve, 5000));

        const attendselector = '#aio_clock_button';
        await page.click(attendselector);

        const hourinterval = 7 * 60 * 60 * 1000;
        await new Promise(resolve => setTimeout(resolve, hourinterval));

        const endmin = Math.floor(Math.random() * 28) + 30;
        const mininterval = endmin * 60 * 1000;
        await new Promise(resolve => setTimeout(resolve, mininterval));

        await page.click(attendselector);

        console.log("Scheduled Function Ended...")
        await browser.close();
    } catch (err) {
        console.log("Error in autoattend function", err)
    }
}

const scheduleCronJob = async () => {
    let min = Math.floor(Math.random() * 30);
    min = min * 60 * 1000;
    await new Promise(resolve => setTimeout(resolve, min));
    autoattend();
};

cron.schedule(`50 8 * * 1-5`, scheduleCronJob, { timezone: 'Asia/Kolkata' });


app.get('/', (req, res) => {
    res.send("Server is Working...")
})

app.listen(PORT, (err) => {
    if (err) { console.log("Port Error", err) }
    else { console.log("server listening ...") }
})