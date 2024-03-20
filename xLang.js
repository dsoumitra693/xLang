import fs from "fs";
import compiler from "./compiler.js";

// Get the filename from command line arguments
const args = process.argv.slice(2); // The first two arguments are node and the script file name
const filename = args[0];

if (!filename) {
  console.error("Please provide a filename.");
  process.exit(1);
}

// Check if the file exists
if (!fs.existsSync(filename)) {
  console.error(`File "${filename}" not found.`);
  process.exit(1);
}

// Read the file
fs.readFile(filename, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    process.exit(1);
  }

  compiler(data, filename);
});
