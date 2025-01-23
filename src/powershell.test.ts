import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { evaluate } from './powershell';

test('basic', () => {
  let result = evaluate('3 + 4 * 5');
  assert.is(result, 23);

  result = evaluate('(3 + 4) * 5');
  assert.is(result, 35);

  result = evaluate('4 == 4');
  assert.is(result, true);

  result = evaluate('4 == 2');
  assert.is(result, false);

  result = evaluate('True && False');
  assert.is(result, false);

  result = evaluate('True && True');
  assert.is(result, true);

  result = evaluate('4 == 4 && True'); // TODO: cannot do expressions on both sides
  assert.is(result, true);

  result = evaluate('4 == 4 && False');
  assert.is(result, false);

  // result = evaluate('4 -eq 4');
  // assert.is(result, true);

  // result = evaluate('3 -eq false');
  // assert.is(result, false);

  // assert.is(evaluate('pi;'), Math.PI);
});

test.run();
