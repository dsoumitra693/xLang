export default function codeGen(node) {
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