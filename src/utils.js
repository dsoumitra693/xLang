export const keywords = {
  DECLEARATION: "le",
  PRINT: "bol",
  IF: "jodi",
  ELSE: "noyto",
  WHILE: "jotokhon",
  FUNCTION: "kaj",
  RETURN: "ferot",
};

export const boolean = {
  TRUE: "sotti",
  FASLE: "mitta",
};

export function createExpression(tokens, end) {
  let expression = "";
  while (tokens.length > 0 && tokens[0].type !== end) {
    expression += tokens.shift().value;
  }
  return expression.trim();
}
