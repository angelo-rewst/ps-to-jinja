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
  Script(statements) {
    for (const statement of statements.children) {
      statement.eval();
    }
  },
  // Statement_assignment(id, _eq, expression, _semicolon) {
  //   const entity = memory[id.sourceString]
  //   check(!entity || entity?.type === "NUM", "Cannot assign", id)
  //   check(!entity || entity?.mutable, `${id.sourceString} not writable`, id)
  //   memory[id.sourceString] = { type: "NUM", value: expression.eval(), mutable: true }
  // },
  // Statement_expression()
});

export function evaluate(expr: string): number {
  const matchResult = grammar.match(expr);
  return semantics(matchResult).eval();
}
