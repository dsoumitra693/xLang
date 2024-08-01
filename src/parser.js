import { createExpression, keywords } from "./utils.js";

export default function parser(tokens) {
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
  