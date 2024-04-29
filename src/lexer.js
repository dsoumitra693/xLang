import { boolean, keywords } from "./utils.js";

export default function lexer(sourceCode) {
    let cursor = 0;
    let tokens = [];
    while (cursor < sourceCode.length) {
      let char = sourceCode[cursor];
  
      if (/\s/.test(char)) {
        cursor++;
        continue;
      }
      if (/;/.test(char)) {
        tokens.push({ type: "eol", value: char });
        cursor++;
        continue;
      }
      if (/[a-zA-z\_]/.test(char)) {
        let word = "";
        while (/[a-zA-Z0-9\_]/.test(char)) {
          word += char;
          char = sourceCode[++cursor];
        }
  
        if (Object.values(keywords).includes(word)) {
          tokens.push({ type: "keyword", value: word });
        } else if (Object.values(boolean).includes(word)) {
          tokens.push({ type: "boolean", value: word === boolean.TRUE });
        } else {
          tokens.push({ type: "identifier", value: word });
        }
        continue;
      }
  
      if (/[\.\d]/.test(char)) {
        let num = "";
        while (/[\.\-\+\d]/.test(char)) {
          num += char;
          char = sourceCode[++cursor];
        }
  
        tokens.push({ type: "number", value: parseFloat(num) });
        continue;
      }
  
      if (/[\+\-\*\/=\!\<\>\%]/.test(char)) {
        if (char == "/" && sourceCode[1 + cursor] == "/") {
          cursor += 2;
          char = sourceCode[cursor];
  
          while (char !== "\n") {
            char = sourceCode[++cursor];
          }
          continue;
        }
        tokens.push({ type: "operator", value: char });
        cursor++;
        continue;
      }
      if (/{/.test(char)) {
        tokens.push({ type: "leftBrace", value: char });
        cursor++;
        continue;
      }
      if (/}/.test(char)) {
        tokens.push({ type: "rightBrace", value: char });
        cursor++;
        continue;
      }
      if (char === "(") {
        tokens.push({ type: "leftParen", value: char });
        cursor++;
        continue;
      }
      if (char === ")") {
        tokens.push({ type: "rightParen", value: char });
        cursor++;
        continue;
      }
  
      if (/"/.test(char)) {
        let str = "";
        char = sourceCode[++cursor];
        while (char && char !== '"') {
          str += char;
          char = sourceCode[++cursor];
        }
        if (char !== '"') {
          throw new Error("Unterminated string literal");
        }
        tokens.push({ type: "string", value: `"${str}"` });
        cursor++;
        continue;
      }
      if (/,/.test(char)) {
        tokens.push({ type: "comma", value: char });
        cursor++;
        continue;
      }
    }
    return tokens;
  }