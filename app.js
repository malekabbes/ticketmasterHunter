const { chromium } = require('playwright');
const nodemailer = require('nodemailer');

async function checkTicketAvailability() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://www.ticketmaster.fr/fr/manifestation/linkin-park-billet/idmanif/605433', {
        waitUntil: 'domcontentloaded',
    });

    const categories = await page.$$eval('.tarif_libelle', nodes =>
        nodes.map(node => node.textContent.trim())
    );

    const available = categories.filter(c => !c.toLowerCase().includes('épuisé'));

    if (available.length > 0) {
        console.log('🎉 Tickets found:', available);

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
            subject: '🎫 Tickets Found!',
            text: `Available categories:\n${available.join('\n')}`
        });
    } else {
        console.log('❌ No tickets available.');
    }

    await browser.close();
}

// Loop every 10 seconds
setInterval(checkTicketAvailability, 10000);
checkTicketAvailability(); // Run once immediately
