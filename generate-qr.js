const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function generateQR() {
  // Let the user know if they need to pass a specific URL
  let url = process.argv[2];
  
  if (!url) {
    console.log("\n⚠️ No URL provided as an argument.");
    console.log("Using the likely Vercel domain. If your deployment URL is different,");
    console.log("run this script again like this: node generate-qr.js https://YOUR-ACTUAL-URL.vercel.app\n");
    // Standard Vercel deployment URL format based on project name
    url = 'https://samhithabday.vercel.app'; 
  }

  const filename = path.join(__dirname, 'samhitha-birthday-qr.png');

  try {
    // Generate a beautiful, print-ready, high-resolution QR code
    // Theming it to match the "Celestial" aesthetic: deep space purple code on warm light background
    await QRCode.toFile(filename, url, {
        width: 1200, // Very large for crisp printing
        margin: 2,   // Safe area margin
        errorCorrectionLevel: 'H', // High error correction in case it gets scratched or bent
        color: {
            dark: '#48206E',   // Deep celestial purple
            light: '#F5EBE1',  // Very soft blush/gold tinted white
        }
    });
    
    console.log(`✨ SUCCESS! A stunning, print-ready QR code has been created!`);
    console.log(`📲 Destination URL: ${url}`);
    console.log(`📁 Saved to: ${filename}`);
    console.log(`\nYou can now print this image on high-quality paper and place it on the walls at the event!\n`);
  } catch (err) {
    console.error('❌ Error generating QR code:', err);
  }
}

generateQR();
