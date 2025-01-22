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
  OperatorExpression_binary(left, op, right) {
    const [x, y] = [left.eval(), right.eval()];
    return op.sourceString == "+" ? x + y : x - y;
  },
  Term_binary(left, op, right) {
    const [x, o, y] = [left.eval(), op.sourceString, right.eval()];
    return o == "*" ? x * y : x / y;
  },
  Primary_parens(_arg0, arg1, _arg2) {
    return arg1.eval();
  },
  integerLiteral(_arg0) {
    console.log('log', this.sourceString);
    // return new IntegerLiteral(arg0.eval());
    return parseInt(this.sourceString);
  },
  realLiteral(arg0, arg1, arg2, arg3, arg4, arg5) {
    return parseFloat(this.sourceString);
  },
});


export function evaluate(expr: string): number {
  const matchResult = grammar.match(expr);
  return semantics(matchResult).eval();
}
