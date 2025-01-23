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
    console.log('Expression ', arg0.sourceString);
    return arg0.eval();
  },
  PrimaryExpression_paren(arg0, arg1, arg2) {
    console.log('PrimaryExpression_paren ', arg1.sourceString);
    return arg1.eval();
  },
  LogicalORExpression_lor(left, arg1, right) {
    const [x, y] = [left.eval(), right.eval()];
    
    return x || y;
  },
  LogicalANDExpression_land(left, op, right) {
    const [x, y] = [left.eval(), right.eval()];
    return x && y;
  },
  EqualityExpression_eq(left, arg1, right) {
    const [x, y] = [left.eval(), right.eval()];
    return x === y;
  },
  EqualityExpression_ne(left, arg1, right) {
    const [x, y] = [left.eval(), right.eval()];
    return x !== y;
  },
  AdditiveExpression_add(left, op, right) {
    const [x, y] = [left.eval(), right.eval()];
    return x + y;
  },
  AdditiveExpression_sub(left, op, right) {
    const [x, y] = [left.eval(), right.eval()];
    return x - y;
  },
  MultiplicativeExpression_mul(left, op, right) {
    const [x, o, y] = [left.eval(), op.sourceString, right.eval()];
    return x * y;
  },
  MultiplicativeExpression_div(left, op, right) {
    const [x, o, y] = [left.eval(), op.sourceString, right.eval()];
    return x / y;
  },
  MultiplicativeExpression_mod(left, op, right) {
    const [x, o, y] = [left.eval(), op.sourceString, right.eval()];
    return x % y;
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
    console.log('AssignmentExpression_assignment ', this.sourceString);
    
    jinja += `{{ set ${leftSide.eval()} ${assign.sourceString} ${rightSide.eval()} }}\n`;
    return `{{ set ${leftSide.eval()} ${assign.sourceString} ${rightSide.eval()} }}\n`;
  },
  CallExpression_propRefExp(arg0, arg1, arg2) {
    console.log('CallExpression_propRefExp ', this.sourceString);
    return `${arg0.eval()}.${arg2.eval()}`
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
});


export function evaluate(expr: string): number {
  const matchResult = grammar.match(expr);
  return semantics(matchResult).eval();
}
