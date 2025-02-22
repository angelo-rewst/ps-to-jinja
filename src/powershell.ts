import grammar, { PowerShellSemantics } from './powershell.ohm-bundle';

const constants: { [name: string]: number } = {
  pi: Math.PI,
  e: Math.E
};

const memory: any = {};
let jinja: string = '';

function check(condition: boolean, message: string, at: any) {
  if (!condition) throw new Error(`${at.source.getLineAndColumnMessage()}${message}`)
}

const semantics: PowerShellSemantics = grammar.createSemantics();

semantics.addOperation<void>('eval()', {
  input(statements) {
    for (const statement of statements.children) {
      statement.eval();
    }
    return jinja;
  },
  Expression(arg0) {
    return arg0.eval();
  },
  PrimaryExpression_paren(arg0, arg1, arg2) {
    return `(${arg1.eval()})`;
  },
  LogicalORExpression_lor(left, arg1, right) {
    const [x, y] = [left.eval(), right.eval()];
    
    return `${x} || ${y}`;
  },
  LogicalANDExpression_land(left, op, right) {
    const [x, y] = [left.eval(), right.eval()];
    return `${x} && ${y}`;
  },
  BitwiseORExpression_bor(left, arg1, right) {
    const [x, y] = [left.eval(), right.eval()];
    return `${x} | ${y}`;
  },
  EqualityExpression_eq(left, arg1, right) {
    const [x, y] = [left.eval(), right.eval()];
    
    return `${x} == ${y}`
  },
  EqualityExpression_ne(left, arg1, right) {
    const [x, y] = [left.eval(), right.eval()];
    
    return `${x} != ${y}`;
  },
  AdditiveExpression_add(left, op, right) {
    const [x, y] = [left.eval(), right.eval()];
    return `${x} + ${y}`;
  },
  AdditiveExpression_sub(left, op, right) {
    const [x, y] = [left.eval(), right.eval()];
    return `${x} - ${y}`;
  },
  MultiplicativeExpression_mul(left, op, right) {
    const [x, o, y] = [left.eval(), op.sourceString, right.eval()];
    return `${x} * ${y}`;
  },
  MultiplicativeExpression_div(left, op, right) {
    const [x, o, y] = [left.eval(), op.sourceString, right.eval()];
    return `${x} / ${y}`;
  },
  MultiplicativeExpression_mod(left, op, right) {
    const [x, o, y] = [left.eval(), op.sourceString, right.eval()];
    return `${x} % ${y}`;
  },
  integerLiteral(_arg0) {
    // return new IntegerLiteral(arg0.eval());
    return parseInt(this.sourceString);
  },
  realLiteral(arg0, arg1, arg2, arg3, arg4, arg5) {
    return parseFloat(this.sourceString);
  },
  booleanLiteral(arg0) {
    return this.sourceString == "True" ? true : false;
  },
  AssignmentExpression_assignment(leftSide, assign, rightSide) {
    const templ = `{% set ${leftSide.eval()} ${assign.sourceString} ${rightSide.eval()} %}\n`;
    jinja += templ;
    return templ;
  },
  ArrayLiteral(arg0, arg1) {
    console.log('arg1', this.sourceString);
    return "[]"; // actualy functionality
  },
  HashLiteral(arg0, arg1, arg2) {
    return `{\n${arg1.eval()}}`;
  },
  CallExpression_propRefExp(arg0, arg1, arg2) {
    return `${arg0.eval()}.${arg2.eval()}`
  },
  CallExpression_arrayRefExp(arg0, arg1, arg2, arg3) {
    return `${arg0.eval()}[${arg2.eval()}]`
  },
  variable_call(_arg0) {
    // const entity = memory[this.sourceString];
    const identifier = this.sourceString;
    if (identifier == '$ctx') { // context variable
      return identifier.slice(1).toUpperCase();
    }
    return identifier.slice(1); // remove $ sign
  },
  identifierPart(arg0) {
    return this.sourceString;
  },
  expandableStringLiteral(arg0, arg1, arg2) {
    console.log('expandableStringLiteral', arg1.sourceString);
    
    return `\"${arg1.sourceString}\"`;
  },
  CommandExpression_commandExp(arg0, arg1) {
    const command = arg0.sourceString;
    // const parameters = arg1.eval();
    
    if (command === "Write-Var") { // TODO: change this to switch
      
      return "{{ " + arg1.eval() + " }}\n";
    } else if (command == "Write-String") {
      // console.log('Write-String', arg1.sourceString);
      // jinja += arg1.sourceString.slice(1, -1) + "\n";
      const strlit = arg1.eval();
      return strlit.slice(1, -1) + "\n";
    }
  },
  CommandParameter(arg0) {
    return arg0.eval();
  },
  CommandParameter_commandParamLit(arg0) {
    // console.log('CommandParameter_commandParamLit', arg0.sourceString);
    return arg0.sourceString;
  },
  CommandParameter_commandParam(arg0) {
    
    return arg0.eval();
  },
  _iter(...children) {
    const res = [];
    let i = 0;
    for (const child of children) {
      res[i] = child.eval();
      i ++;
    }
    return res.join('');
  },
  // Statement(arg0) {
  //   console.log('Statement', arg0.sourceString);
  //   return arg0.eval();
  // },
  IterationStatement_forIn(arg0, arg1, item, arg3, items, arg5, block) {
    
    jinja += `{% for ${item.eval()} in ${items.eval()} %}
    ${block.eval()}
{% endfor %}\n`;
  },
  Block(arg0, statement, arg2) {
    
    return statement.eval();
  },
  IfStatement_ifStmt(arg0, arg1, condition, arg3, ifBlock, elifBlock, arg6, elseBlock) {
    console.log('elifBlock', elifBlock.sourceString);

    let templ = `{% if ${condition.eval()} %}
    ${ifBlock.eval()}`

    if (elifBlock.sourceString !== '') {
      templ += `${elifBlock.eval()}`
    }

    if (elseBlock.sourceString !== '') {
      templ += `{% else %} 
    ${elseBlock.eval()}`
    }

    templ += `{% endif %}`;
    jinja += templ;
  },
  ElseIfBlock_elifBlock(arg0, arg1, arg2, arg3, arg4) {

    return `{% elif ${arg2.eval()} %}
${arg4.eval()}
    `;
  },
  PropertyAssignment(arg0, arg1, arg2, arg3) {
    return `"${arg0.eval()}": ${arg2.eval()},\n`
  },
  PropertyName(arg0, arg1) {
    return `${arg0.sourceString.toLowerCase()}${camelToSnakeCase(arg1.sourceString)}`;
  },
  DefaultCall(arg0, arg1, arg2) {
    return `default("${arg1.sourceString}")`;
  },
  InExpression_inop(arg0, arg1, arg2) {
    return `${arg0.eval()} in ${arg2.eval()}`;
  },
  else(arg0) {
    console.log('else', arg0.sourceString);
  },
});

const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter: string )=> `_${letter.toLowerCase()}`);

export function evaluate(expr: string): string {
  jinja = '';
  const matchResult = grammar.match(expr);
  return semantics(matchResult).eval();
}
