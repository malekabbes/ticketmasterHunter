const { chromium } = require('playwright');
const nodemailer = require('nodemailer');

const URL = 'https://www.ticketmaster.fr/fr/manifestation/linkin-park-billet/idmanif/605433';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(URL, { waitUntil: 'domcontentloaded' });

    const categories = await page.$$eval('.tarif_libelle', nodes =>
        nodes.map(node => node.textContent.trim())
    );

    const available = categories.filter(text => !text.toLowerCase().includes('épuisé'));

    if (available.length > 0) {
        console.log('✅ Tickets available:');
        console.log(available);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: 'malekabbes665@gmail.com',
            subject: '🎫 Tickets Found for Linkin Park!',
            text: `Here are the available categories:\n\n${available.join('\n')}`
        });

    } else {
        console.log('❌ All categories are sold out.');
    }

    await browser.close();
})();