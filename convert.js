const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

const icons = [
  'home',
  'home-active',
  'menu',
  'menu-active',
  'cart',
  'cart-active'
];

// 确保输出目录存在
const outputDir = path.join(__dirname, 'images', 'tabbar');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function convertSvgToPng(name) {
  const svgContent = `
    <svg width="81" height="81" viewBox="0 0 81 81" fill="none" xmlns="http://www.w3.org/2000/svg">
      ${getSvgPath(name)}
    </svg>
  `;

  try {
    await sharp(Buffer.from(svgContent))
      .resize(81, 81)
      .png()
      .toFile(path.join(outputDir, `${name}.png`));
    console.log(`Converted ${name}.svg to ${name}.png`);
  } catch (error) {
    console.error(`Error converting ${name}:`, error);
  }
}

function getSvgPath(name) {
  const color = name.includes('-active') ? '#07c160' : '#999999';
  
  switch (name.replace('-active', '')) {
    case 'home':
      return `<path d="M40.5 20L20 40.5V65h41V40.5L40.5 20zM25 60V42.5l15.5-15.5L56 42.5V60H25z" fill="${color}"/>`;
    case 'menu':
      return `<path d="M25 20h31v5H25v-5zm0 15h31v5H25v-5zm0 15h31v5H25v-5z" fill="${color}"/>`;
    case 'cart':
      return `
        <path d="M60 25l-5 25H25l-5-25h40zM20 20l7 35h27l7-35H20z" fill="${color}"/>
        <circle cx="30" cy="65" r="5" fill="${color}"/>
        <circle cx="50" cy="65" r="5" fill="${color}"/>
      `;
    default:
      return '';
  }
}

async function convertAll() {
  for (const icon of icons) {
    await convertSvgToPng(icon);
  }
}

convertAll().then(() => {
  console.log('All icons converted successfully!');
}).catch(error => {
  console.error('Error during conversion:', error);
}); 