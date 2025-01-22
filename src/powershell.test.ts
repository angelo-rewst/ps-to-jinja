import {test} from 'uvu';
import * as assert from 'uvu/assert';

import {evaluate} from './powershell';

test('basic', () => {
  // assert.is(evaluate('(3 + 4) * 5'), 35);
  assert.is(evaluate('3 + 4 * 5'), 23);
  assert.is(evaluate('4 -eq 4'), true);
  assert.is(evaluate('3 -eq false'), true);
  assert.is(evaluate('pi'), Math.PI);
});

test.run();
