const fs = require("fs");
const path = require("path");

function fileExists(root, relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readTextFile(filePath) {
  if (!filePath) {
    throw new Error("Input file is required for this command.");
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Input file not found: ${filePath}`);
  }

  return fs.readFileSync(filePath, "utf8");
}

function printSection(title) {
  console.log("");
  console.log(`## ${title}`);
  console.log("");
}

function countMatches(text, keywords) {
  const normalized = text.toLowerCase();
  return keywords.filter((keyword) => normalized.includes(keyword.toLowerCase())).length;
}

module.exports = {
  fileExists,
  readTextFile,
  printSection,
  countMatches
};
