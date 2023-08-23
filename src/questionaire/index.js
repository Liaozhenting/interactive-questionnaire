// 词法分析器
function lexer(input) {
  const tokens = [];
  const keywords = ['if', 'then', 'show'];

  let currentIndex = 0;
  while (currentIndex < input.length) {
    let char = input[currentIndex];

    if (char === ' ') {
      currentIndex++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'LPAREN' });
      currentIndex++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'RPAREN' });
      currentIndex++;
      continue;
    }

    if (char === '.') {
      tokens.push({ type: 'DOT' });
      currentIndex++;
      continue;
    }

    if (char === '=') {
      if (input[currentIndex + 1] === '=') {
        tokens.push({ type: 'COMPARISON_OP', value: '==' });
        currentIndex += 2;
        continue;
      } else {
        tokens.push({ type: 'ASSIGNMENT_OP' });
        currentIndex++;
        continue;
      }
    }

    if (char >= '0' && char <= '9') {
      let value = '';
      while (char >= '0' && char <= '9') {
        value += char;
        char = input[++currentIndex];
      }
      tokens.push({ type: 'NUMBER', value });
      continue;
    }

    if (char === '"') {
      let value = '';
      char = input[++currentIndex];
      while (char !== '"') {
        value += char;
        char = input[++currentIndex];
      }
      tokens.push({ type: 'STRING', value });
      currentIndex++;
      continue;
    }

    if (/[a-zA-Z]/.test(char)) {
      let value = '';
      while (char && /[a-zA-Z0-9]/.test(char)) {
        value += char;
        char = input[++currentIndex];
      }
      if (keywords.includes(value)) {
        tokens.push({ type: value.toUpperCase() });
      } else {
        tokens.push({ type: 'IDENTIFIER', value });
      }
      continue;
    }

    throw new TypeError('Invalid character: ' + char);
  }

  return tokens;
}

// 语法分析
function syntaxAnalysis(tokens) {
  let currentIndex = 0;
  const ast = {
    type: "Program",
    body: []
  };

  function parseCondition() {
    let token = tokens[currentIndex];

    if (token.type === 'LPAREN') {
      token = tokens[++currentIndex]; // 跳过 LPAREN
      let expression = parseExpression();
      token = tokens[++currentIndex]; // 跳过 RPAREN
      return expression;
    }

    throw new TypeError('Invalid token: ' + token.type);
  }

  function parseExpression() {
    let token = tokens[currentIndex];

    if (token.type === 'IDENTIFIER') {
      let expression = { type: 'Expression', left: null, operator: null, right: null };

      expression.left = parseTerm();
      token = tokens[currentIndex]; // 获取当前的操作符或者下一个标识符
      while (token && token.type === 'DOT') {
        currentIndex++; // 跳过 DOT
        expression.right = parseTerm();
        expression.left = { type: 'Expression', left: expression.left, operator: { type: 'DOT' }, right: expression.right };
        token = tokens[currentIndex]; // 获取当前的下一个操作符或者标识符
      }

      if (token && token.type === 'COMPARISON_OP') {
        expression.operator = token;
        currentIndex++; // 跳过比较运算符
        expression.right = parseExpression();
      }

      return expression;
    } else if (token.type === 'NUMBER'){
      return {type:'NUMBER',value:token};
    }

    throw new TypeError('Invalid token: ' + token.type);
  }

  function parseTerm() {
    let token = tokens[currentIndex];

    if (token.type === 'IDENTIFIER' || token.type === 'NUMBER' || token.type === 'STRING') {
      currentIndex++;
      return token;
    }

    throw new TypeError('Invalid token: ' + token.type);
  }

  function parseStatement() {
    let token = tokens[currentIndex];

    if (token.type === 'IDENTIFIER') {
      let action = { type: 'Action', command: null };

      action.command = token.value;
      currentIndex++;

      return action;
    } else if (token.type === "SHOW") {
      const question = tokens[currentIndex + 1];

      const showStatement = {
        type: "ShowStatement",
        question
      };

      currentIndex += 2;
      return showStatement;
    }

    throw new TypeError('Invalid token: ' + token.type);
  }

  while (currentIndex < tokens.length) {
    const currentToken = tokens[currentIndex];

    if (currentToken.type === "IF") {
      token = tokens[++currentIndex]; // 跳过 IF
      const condition = parseCondition();
      token = tokens[++currentIndex]; // 跳过条件末尾的 RPAREN
      token = tokens[++currentIndex]; // 跳过 THEN
      const statement = parseStatement();

      const ifStatement = {
        type: "IfStatement",
        condition,
        statement,
      };

      ast.body.push(ifStatement);
      currentIndex += 6;
    }
    else if (currentToken.type === "SHOW") {
      const question = tokens[currentIndex + 1];

      const showStatement = {
        type: "ShowStatement",
        question
      };

      ast.body.push(showStatement);
      currentIndex += 2;
    }
    // else if (currentToken === "replace") {
    //   const search = tokens[currentIndex + 1];
    //   const replace = tokens[currentIndex + 3];
    //   const question = tokens[currentIndex + 5];

    //   const replaceStatement = {
    //     type: "ReplaceStatement",
    //     search,
    //     replace,
    //     question
    //   };

    //   ast.body.push(replaceStatement);
    //   currentIndex += 6;
    // }
    else {
      currentIndex++;
    }
  }

  return ast;
}

// 语义分析
// function semanticAnalysis(ast) {

//   return ast;
// }


// 语义分析
function semanticAnalysis(ast) {

  

  return ast;
}

// 代码生成
// function codeGeneration(ast) {
//   let generatedCode = "";

//   for (const statement of ast.body) {
//     if (statement.type === "IfStatement") {
//       generatedCode += `if (${statement.condition}) {\n`;
//       generatedCode += `  ${statement.thenAction};\n`;
//       generatedCode += `} else {\n`;
//       generatedCode += `  ${statement.elseAction};\n`;
//       generatedCode += `}\n`;
//     }
//     else if (statement.type === "ShowStatement") {
//       generatedCode += `show ${statement.question};\n`;
//     }
//     else if (statement.type === "ReplaceStatement") {
//       generatedCode += `replace "${statement.search}" with "${statement.replace}" in ${statement.question};\n`;
//     }
//   }

//   return generatedCode;
// }

// 执行流程

// 输入的DSL代码
const dslCode = 'if (Q1.answer == 1) then show Q2';

// const dslCode = `
//   if(Q1.answer == 1) then show Q2;
//   if(Q1.answer == 2) then show Q3;
//   replace Q4.name with (Q2.answer || Q3.answer);
// `;

const tokens = lexer(dslCode);
const ast = syntaxAnalysis(tokens);
// const analyzedAst = semanticAnalysis(ast);
// const generatedCode = codeGeneration(analyzedAst);

console.log("Tokens:", tokens);
console.log("AST:", ast);
// console.log("Generated Code:\n", generatedCode);