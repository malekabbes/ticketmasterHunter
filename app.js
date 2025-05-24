const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const url = 'https://www.ticketmaster.fr/fr/manifestation/linkin-park-billet/idmanif/605433';

async function checkTicketAvailability() {
    try {
        console.log("COOKIES",process.env.COOKIE)

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
                'Referer': 'https://www.ticketmaster.fr/',
                'Accept-Language': 'fr-FR,fr;q=0.9',
                'Cookie':process.env.COOKIE
            }
        });
        console.log("COOKIES",process.env.COOKIE)
        const html = response.data;
        const $ = cheerio.load(html);

        let available = false;

        // Tu peux ajuster ce sélecteur selon le site HTML exact
        $('.tarif_libelle').each((i, el) => {
            const status = $(el).text().trim().toLowerCase();
            if (!status.includes('épuisé')) {
                available = true;
                console.log('✅ Ticket disponible détecté !');
                console.log('>>', $(el).text().trim());
            }
        });

        if (!available) {
            console.log('❌ Tous les tickets sont épuisés.');
        }

    } catch (err) {
        console.error('Erreur lors du chargement de la page:', err.message);
    }
}

checkTicketAvailability();
