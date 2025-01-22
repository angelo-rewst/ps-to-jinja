import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { evaluate } from './powershell';

test('basic', () => {
  let result = evaluate('3 + 4 * 5');
  assert.is(result, 23);
  result = evaluate('(3 + 4) * 5');
  assert.is(result, 35);
  // assert.is(evaluate('4 -eq 4'), true);
  // assert.is(evaluate('3 -eq false;'), false);
  // assert.is(evaluate('pi;'), Math.PI);
});

test.run();
