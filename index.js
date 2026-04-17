const fs = require('fs');
const path = require('path');

// Configuration
const REPO_URL = `https://cdn.jsdelivr.net/gh/Nam-Hai/placeholders@main/`;
const IMAGE_DIR = './content'; // Le dossier à scanner
const OUTPUT_FILE = 'manifest.json';
const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

function getImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // On ignore le dossier .git
      if (file !== '.git') getImages(filePath, fileList);
    } else {
      if (EXTENSIONS.includes(path.extname(file).toLowerCase())) {
        // On convertit le chemin local en URL CDN
        const relativePath = path.relative('./', filePath).replace(/\\/g, '/');
        fileList.push(`${REPO_URL}${relativePath}`);
      }
    }
  });

  return fileList;
}

const images = getImages(IMAGE_DIR);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(images, null, 2));
console.log(`✅ ${images.length} images répertoriées dans ${OUTPUT_FILE}`);
