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
    
    jinja += `{{ set ${leftSide.eval()} ${assign.sourceString} ${rightSide.eval()} }}\n`;
    return `{{ set ${leftSide.eval()} ${assign.sourceString} ${rightSide.eval()} }}\n`;
  },
  CallExpression_propRefExp(arg0, arg1, arg2) {
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
  expandableStringLiteral(arg0, arg1, arg2) {
    return `\"${arg1.sourceString}\"`;
  },
  CommandExpression_commandExp(arg0, arg1) {
    const command = arg0.sourceString;
    const parameters = arg1.eval();
    
    if (command === 'Write-Host') { // TODO: change this to switch
      jinja += WriteHostCommand(parameters);
    }
  },
  CommandParameter(arg0) {
    return arg0.eval();
  },
  CommandParameter_commandParamExp(arg0) {
    return arg0.eval();
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
    return res;
  },
});

// TODO: move out to a different file
function WriteHostCommand(parameters: any) {
  if(parameters) {
    return parameters.reduce((arr: string, curr: string) => {
      if (curr.match(/".*?"/g)) {
        arr += curr.slice(1, -1);
      } else {
        arr += curr;
      }
      return arr;
    }, "");
  }
  return '';
}

export function evaluate(expr: string): number {
  const matchResult = grammar.match(expr);
  return semantics(matchResult).eval();
}
