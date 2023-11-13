/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*
|--------------------------------------------------------------------------
| Protected Facade Methods
|--------------------------------------------------------------------------
|
| The facade proxy handler methods that are restricted for Facades.
*/
export const PROTECTED_FACADE_METHODS = [
  'spy',
  'stub',
  'when',
  'freeze',
  'restore',
  'unfreeze',
  'getProvider',
  'facadeAccessor',
  'getFreezedProvider'
]
