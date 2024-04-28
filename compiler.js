import fs from "fs";

export const keywords = {
  DECLEARATION: "le",
  PRINT: "bol",
  IF: "jodi",
  ELSE: "noyto",
  WHILE: "jotokhon",
  FUNCTION: "function",
  RETURN: "return",
};

export const boolean = {
  TRUE: "sotti",
  FASLE: "mitta",
};

function lexer(sourceCode) {
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

function parser(tokens) {
  const ast = {
    type: "Program",
    body: [],
  };

  while (tokens.length > 0) {
    let token = tokens.shift();
    // end of block
    if (token.type === "rightBrace") break;
    // declaration
    if (token.type === "keyword" && token.value === keywords.DECLEARATION) {
      let declartion = {
        type: "Declartion",
        name: tokens.shift().value,
        value: null,
      };

      //assignment operation
      if (tokens[0].type === "operator" && tokens[0].value === "=") {
        tokens.shift();
        declartion.value = createExpression(tokens, "eol");
        tokens.shift();
      }
      ast.body.push(declartion);
    }
    // print
    if (token.type === "keyword" && token.value === keywords.PRINT) {
      if (tokens[0].type === "leftParen") {
        tokens.shift();
        ast.body.push({
          type: "Print",
          expression: createExpression(tokens, "eol"),
        });
      }
    }

    // if/else
    if (token.type === "keyword" && token.value === keywords.IF) {
      let statement = {
        type: "IfStatement",
        name: "if",
        condition: false,
        body: [],
        elseBlock: [],
      };

      //check the condition
      if (tokens[0].type === "leftParen") {
        tokens.shift();
        statement.condition = createExpression(tokens, "rightParen");
      }
      tokens.shift();
      if (tokens[0].type === "leftBrace") {
        tokens.shift();
        statement.body = parser(tokens);
      }

      // check else block
      if (tokens[0]?.type === "keyword" && tokens[0]?.value === keywords.ELSE) {
        tokens.shift();
        if (tokens[0].type === "leftBrace") {
          tokens.shift();
          statement.elseBlock = parser(tokens);
        }
      }
      ast.body.push(statement);
    }
    // operation
    if (token.type === "identifier") {
      tokens.shift();
      ast.body.push({
        type: "Assignment",
        name: token.value,
        value: createExpression(tokens, "eol"),
      });
    }
    //while loop
    if (token.type === "keyword" && token.value === keywords.WHILE) {
      let loop = {
        type: "WhileLoop",
        name: "while",
        condition: false,
        body: [],
      };

      if (tokens[0].type === "leftParen") {
        tokens.shift();
        loop.condition = createExpression(tokens, "rightParen");
      }
      tokens.shift();
      if (tokens[0].type === "leftBrace") {
        tokens.shift();
        loop.body = parser(tokens);
      }

      ast.body.push(loop);
    }
    //function
    if (token.type === "keyword" && token.value === keywords.FUNCTION) {
      let func = {
        type: "Function",
        name: "",
        args: [],
        body: [],
      };

      if (tokens[0].type === "identifier") {
        func.name = tokens[0].value;
        tokens.shift();
      }

      if (tokens[0].type === "leftParen") {
        tokens.shift();
        let temp = "";
        while (tokens[0].type !== "rightParen") {
          let tkn = tokens.shift();
          if (tkn.type === "comma" || tkn.type === "identifier")
            temp += tkn.value;
        }

        func.args = temp.split(",");
      }
      tokens.shift();
      if (tokens[0].type === "leftBrace") {
        tokens.shift();
        func.body = parser(tokens);
      }

      console.log(func);
      ast.body.push(func);
    }

    //return
    if (token.type === "keyword" && token.value === keywords.RETURN) {
      let returnSmt = {
        type: "Return",
        name: "return",
        returnObj: "",
      };

      returnSmt.returnObj = createExpression(tokens, "eol");
      ast.body.push(returnSmt);
    }
  }

  return ast;
}

function createExpression(tokens, end) {
  let expression = "";
  while (tokens.length > 0 && tokens[0].type !== end) {
    expression += tokens.shift().value;
  }
  return expression.trim();
}

function codeGen(node) {
  switch (node.type) {
    case "Program":
      return node.body.map(codeGen).join("\n");
    case "Declartion":
      return `let ${node.name} = ${node.value}`;
    case "Assignment":
      return `${node.name} = ${node.value}`;
    case "IfStatement":
      if (!!node.elseBlock.length) {
        return `if(${node.condition}){
            ${codeGen(node.body)}
          } else {
            ${codeGen(node.elseBlock)}
          }`;
      } else {
        return `if(${node.condition}){
            ${codeGen(node.body)}
          }`;
      }
    case "WhileLoop":
      return `while(${node.condition}){
          ${codeGen(node.body)}
        }`;
    case "Function":
      return `function ${node.name}(${node.args}){
              ${codeGen(node.body)}
            }`;
    case "Return":
      return `return ${node.returnObj}`;
    case "Print":
      return `console.log(${node.expression}`;
    default:
      throw new Error("Invaild statement recived " + node);
  }
}

function compiler(sourceCode, filename) {
  const tokens = lexer(sourceCode);
  const ast = parser(tokens);
  console.log(ast);
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

export default compiler;
