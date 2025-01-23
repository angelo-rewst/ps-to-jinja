import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { evaluate } from './powershell';

test('basic', () => {
  let result;
  // let result = evaluate('3 + 4 * 5');
  // assert.is(result, 23);

  // result = evaluate('(3 + 4) * 5');
  // assert.is(result, 35);

  // result = evaluate('4 == 4');
  // assert.is(result, true);

  // result = evaluate('4 == 2');
  // assert.is(result, false);

  // result = evaluate('True && False');
  // assert.is(result, false);

  // result = evaluate('True && True');
  // assert.is(result, true);

  // result = evaluate('4 == 4 && 4 == 4');
  // assert.is(result, true);

  // result = evaluate('4 == 4 && 4 == 2');
  // assert.is(result, false);

  // result = evaluate('False || True');
  // assert.is(result, true);

  // result = evaluate('False || False');
  // assert.is(result, false);

  // result = evaluate('4 == 4 || 4 == 2');
  // assert.is(result, true);

  // result = evaluate('4 == 3 || 4 == 2');
  // assert.is(result, false);

  // result = evaluate('4 != 4');
  // assert.is(result, false);

  // result = evaluate('4 != 2');
  // assert.is(result, true);
  /*

    $x = $ctx.json
    $counter= 0
    Write-Host "<ul>"
    while($counter -ne 6) {
      Write-Host "<li>" $x[$counter] "</li>"
    }
    Write-Host "</ul>"

  */

  result = evaluate(`
$x = $ctx.json\n
$counter= 0\n
Write-Host "<ul>"
  `.trim());

  console.log('result:\n', result);

  assert.is(result,
    `
{{ set x = CTX.json }}\n
{{ set counter = 0 }}\n
<ul>
    `.trim()
  );

});

test.run();
