import codeGen from "./codeGen.js";
import fs from "fs"
import lexer from "./lexer.js";
import parser from "./parser.js"

export default function compiler(sourceCode, filename) {
    const tokens = lexer(sourceCode);
    const ast = parser(tokens);
    const code = codeGen(ast);
  
    let newFilename = filename.replace("xs", "js");
    fs.writeFile(newFilename, code, "utf8", (err) => {
      if (err) {
        console.error("Error writing to file:", err);
        return;
      }
      console.log("Compilation Successful.");
      eval(code);
    });
  }
  