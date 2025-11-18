// Script pour convertir le CV HTML en PDF
// Utilisation: node convert_cv_to_pdf.js
// Nécessite: npm install puppeteer

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function convertHTMLToPDF() {
    try {
        console.log('🚀 Démarrage de la conversion HTML vers PDF...');
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Lire le fichier HTML
        const htmlPath = path.join(__dirname, 'dylan_cv.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
        
        // Charger le HTML dans la page
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });
        
        // Générer le PDF
        const pdfPath = path.join(__dirname, 'dylan_cv.pdf');
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        });
        
        await browser.close();
        
        console.log('✅ CV converti avec succès en PDF: dylan_cv.pdf');
    } catch (error) {
        console.error('❌ Erreur lors de la conversion:', error.message);
        console.log('\n💡 Alternative: Ouvrez dylan_cv.html dans votre navigateur et utilisez "Imprimer" > "Enregistrer en PDF"');
    }
}

// Vérifier si puppeteer est installé
try {
    require('puppeteer');
    convertHTMLToPDF();
} catch (error) {
    console.log('⚠️  Puppeteer n\'est pas installé.');
    console.log('📦 Pour installer: npm install puppeteer');
    console.log('\n💡 Alternative: Ouvrez dylan_cv.html dans votre navigateur (Chrome/Edge)');
    console.log('   et utilisez Ctrl+P > "Enregistrer en PDF"');
}

