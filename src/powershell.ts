/*
  In ../package.json, there is a 'generate' script that uses the Ohm command
  line tool (from the @ohm-js/cli package) to generate a "bundle" for our
  grammar, along with the corresponding TypeScript type definitions.

  A bundle is a standalone CommonJS module from which we can directly import
  our grammar(s). The associated .d.ts file also defines some useful related
  types, such as `ArithmeticSemantics`.
 */
import grammar, {PowerShellSemantics} from './powershell.ohm-bundle';

const constants: {[name: string]: number} = {
  pi: Math.PI,
  e: Math.E
};

/*
  It's not necessary to specificy the type explicitly here, but we do it
  to demonstrate that the `grammar.createSemantics()` doesn't return a
  generic `Semantics`, but rather an `ArithmeticSemantics`...
 */
const semantics: PowerShellSemantics = grammar.createSemantics();

/*
  ...and this lets the compiler check that our semantic actions have the
  correct number of arguments, a consistent return type, etc. In some
  editors (e.g. VS Code), this also enables some handy features like
  autocomplete of action names, tooltips with argument types (`IterationNode`,
  `NonterminalNode`, or `TerminalNode`), etc.
 */
semantics.addOperation<number>('eval()', {
  Script(statements) {
    for (const statement of statements.children) statement.eval()
  },
  Statement_assignment(id, _eq, expression, _semicolon) {
    const entity = memory[id.sourceString]
    check(!entity || entity?.type === "NUM", "Cannot assign", id)
    check(!entity || entity?.mutable, `${id.sourceString} not writable`, id)
    memory[id.sourceString] = { type: "NUM", value: expression.eval(), mutable: true }
  },
});

export function evaluate(expr: string): number {
  const matchResult = grammar.match(expr);
  return semantics(matchResult).eval();
}
