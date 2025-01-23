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


$items = $ctx.json\n
Write-String "<ul>"\n
foreach($item in $items) {
  $show = "<li>" + $x[$counter] + "</li>"\n
  Write-Var $show\n
}
Write-String "</ul>"\n

  */

//   result = evaluate(`
// $items = $ctx.json
// Write-String "<ul>"
// foreach($item in $items) {
//   $show = "<li>" + $x[$counter] + "</li>"
//   Write-Var $show
// }
// Write-String "</ul>"
//   `.trim());

//   console.log('result:\n', result);

  result = evaluate(`
if ($ctx.result -eq True) {
    Write-Var $show
} else {
    Write-String "<h1>Message</h1>"
}
  `.trim());

  console.log('result:\n', result);

//   assert.is(result,
//     `
// {{ set x = CTX.json }}\n
// {{ set counter = 0 }}\n
// <ul>
//     `.trim()
//   );

});

test.run();
