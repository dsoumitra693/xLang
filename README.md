Here's the updated README with the compilation instructions:

---

## Custom Programming Language Compiler

### Overview

This repository contains a compiler for a custom programming language that compiles code to JavaScript. It includes a lexer, parser, code generator, and compiler. The language supports variable declarations, assignments, conditionals, loops, functions, and more.

### Language Features

#### Keywords

- **Variable Declaration**: `le`
- **Print Statement**: `bol`
- **Conditional Statements**: `jodi`, `noyto`
- **While Loop**: `jotokhon`
- **Function**: `kaj`
- **Return**: `ferot`
- **Booleans**: `sotti` (true), `mitta` (false)

### Syntax

#### 1. Variable Declaration

```plaintext
le x = 5;
```

- `le` declares a variable with an initial value.

#### 2. Assignment

```plaintext
x = 10;
```

- Assigns a new value to an existing variable.

#### 3. Print Statement

```plaintext
bol(x);
```

- Prints the value of the expression.

#### 4. Conditional Statements

```plaintext
jodi (x > 5) {
  bol(x);
} noyto {
  bol(0);
}
```

- Uses `jodi` for `if` and `noyto` for `else`.

#### 5. While Loop

```plaintext
jotokhon (x < 10) {
  x = x + 1;
}
```

- Executes the loop as long as the condition is true.

#### 6. Functions

```plaintext
kaj add(a, b) {
  ferot a + b;
}
```

- Defines a function using `kaj`, with `ferot` to return a value.

#### 7. Return Statement

```plaintext
ferot a + b;
```

- Returns the value from a function.

### Example Program

```plaintext
le x = 5;
le y = 10;

jodi (x < y) {
  bol("x is less than y");
} noyto {
  bol("x is greater than or equal to y");
}

jotokhon (x < 10) {
  x = x + 1;
  bol(x);
}

kaj add(a, b) {
  ferot a + b;
}

le result = add(x, y);
bol(result);
```

### Usage

1. **Tokenize the Input**: The lexer converts source code into tokens.
2. **Parse the Tokens**: The parser generates an Abstract Syntax Tree (AST).
3. **Generate Code**: The code generator converts the AST into JavaScript.
4. **Compile and Execute**: The compiler writes the generated code to a `.js` file and executes it.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dsoumitra693/xLang.git
   cd your-repo
   ```

2. Compile your code:

   ```bash
   yarn run-xs filename.xs
   ```

### Contributing

Feel free to open issues or submit pull requests for improvements and bug fixes.

### License

This project is licensed under the MIT License.

--- 
