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

  result = evaluate('4 == 4 && 4 == 4');
  assert.is(result, true);

  result = evaluate('4 == 4 && 4 == 2');
  assert.is(result, false);

  result = evaluate('False || True');
  assert.is(result, true);

  result = evaluate('False || False');
  assert.is(result, false);

  result = evaluate('4 == 4 || 4 == 2');
  assert.is(result, true);

  result = evaluate('4 == 3 || 4 == 2');
  assert.is(result, false);

  result = evaluate('4 != 4');
  assert.is(result, false);

  result = evaluate('4 != 2');
  assert.is(result, true);

  evaluate('$x = 2');
  result = evaluate('$x');
  
  assert.is(result, 2);

  // result = evaluate('3 -eq false');
  // assert.is(result, false);
});

test.run();
