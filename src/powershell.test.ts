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

  /*

if ($ctx.result -eq True) {
    Write-Var $show
} else {
    Write-String "<h1>Message</h1>"
}

  */
  
//   result = evaluate(`
// if ($ctx.result -eq True) {
//     Write-Var $show
// } elseif (True) {
//     $e = 4
// } elseif (True) {
//     $e = 4
// } else {
//     Write-String "<h1>Message</h1>"
// }
//   `.trim());

//   console.log('result:\n', result);
/*
    $array = @()
    $counter = 0
    foreach ($user in $ctx.company_data.users) {
      $array[$counter] = @{
        UserId = $user.user_id;
        FullName = $user.first_name + " " + $user.last_name;
        Email = $user.email | default("Unknown");
        IsActive = $user.is_active;
        LastLogin = $user.last_login | default("Never");
        IsInternal = "clucktoso.com" in ($user.email | default(""));
      }
      $counter += 1
    }
    Write-Var $array
*/

  result = evaluate(`
    $array = @()
    $counter = 0
    foreach ($user in $ctx.company_data.users) {
      $array[$counter] = @{
        UserId = $user.user_id;
        FullName = $user.first_name + " " + $user.last_name;
        Email = $user.email | default("Unknown");
        IsActive = $user.is_active;
        LastLogin = $user.last_login | default("Never");
        IsInternal = "clucktoso.com" in ($user.email | default(""));
      }
      $counter += 1
    }
    Write-Var $array
      `.trim());
    
      console.log('result:\n', result);
  /*

  {{
    [
        {
            "user_id": user.user_id,
            "full_name": user.first_name ~ " " ~ user.last_name,
            "email": user.email | default("Unknown"),
            "is_active": user.is_active,
            "last_login": user.last_login | default("Never"),
            "is_internal": "clucktoso.com" in (user.email | default("")),
            "role": (
                [detail.role for detail in CTX.company_data.user_details if detail.user_id == user.user_id] | first | default("Unknown")
            ),
            "department": (
                [detail.department for detail in CTX.company_data.user_details if detail.user_id == user.user_id] | first | default("Unknown")
            ),
            "salary": (
                [detail.salary for detail in CTX.company_data.user_details if detail.user_id == user.user_id] | first | default(0)
            )
        }
        for user in CTX.company_data.users
    ]
  }}

   */


});

test.run();
