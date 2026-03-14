// build.js
// Generates memes.json from files inside /public/memes
// Also normalizes filenames into URL-safe slugs

const fs = require("fs");
const path = require("path");

const MEME_DIR = path.join(__dirname, "public", "memes", "1");
const OUTPUT_FILE = path.join(__dirname, "public", "memes.json");

// Allowed media types
const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".mp4",
  ".webm",
  ".mov"
];

// Convert filename to URL-safe slug
function slugify(filename) {

  const ext = path.extname(filename).toLowerCase();
  const base = path.basename(filename, ext);

  const slug = base
    .normalize("NFKD")                  // normalize unicode
    .replace(/[^\w\s-]/g, "")           // remove special chars
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")           // spaces/underscores -> dash
    .replace(/^-+|-+$/g, "");           // trim dashes

  return slug + ext;

}

function buildMemesJSON() {

  console.log("Scanning meme directory:", MEME_DIR);

  const files = fs.readdirSync(MEME_DIR);

  const mediaFiles = [];

  for (const file of files) {

    const ext = path.extname(file).toLowerCase();
    if (!allowedExtensions.includes(ext)) continue;

    const oldPath = path.join(MEME_DIR, file);
    const newName = slugify(file);
    const newPath = path.join(MEME_DIR, newName);

    if (file !== newName) {

      console.log(`Renaming: ${file} → ${newName}`);

      fs.renameSync(oldPath, newPath);

    }

    mediaFiles.push(newName);

  }

  mediaFiles.sort();

  const json = JSON.stringify(mediaFiles, null, 2);

  fs.writeFileSync(OUTPUT_FILE, json);

  console.log(`✔ Generated memes.json with ${mediaFiles.length} files`);

}

buildMemesJSON();