import grammar, { PowerShellSemantics } from './powershell.ohm-bundle';

const constants: { [name: string]: number } = {
  pi: Math.PI,
  e: Math.E
};

const memory: any = {};

function check(condition: boolean, message: string, at: any) {
  if (!condition) throw new Error(`${at.source.getLineAndColumnMessage()}${message}`)
}

const semantics: PowerShellSemantics = grammar.createSemantics();

semantics.addOperation<void>('eval()', {
  input(statements) {
    for (const statement of statements.children) {
      return statement.eval();
    }
  },
  Expression(arg0) {
    return arg0.eval();
  },
  PrimaryExpression_paren(arg0, arg1, arg2) {
    console.log(this.sourceString);
    return arg1.eval();
  },
  AdditiveExpression_add(left, op, right) {
    const [x, y] = [left.eval(), right.eval()];
    return x + y;
  },
  MultiplicativeExpression_mul(left, op, right) {
    const [x, o, y] = [left.eval(), op.sourceString, right.eval()];
    return x * y;
  },
  integerLiteral(_arg0) {
    // return new IntegerLiteral(arg0.eval());
    return parseInt(this.sourceString);
  },
  realLiteral(arg0, arg1, arg2, arg3, arg4, arg5) {
    return parseFloat(this.sourceString);
  },
});

class BinaryExpression {
  left: any;
  op: string;
  right: any;
  constructor(left: any, op: string, right: any) {
    this.left = left;
    this.op = op;
    this.right = right;
  }
  toString() {
    
  }
}

export function evaluate(expr: string): number {
  const matchResult = grammar.match(expr);
  return semantics(matchResult).eval();
}
