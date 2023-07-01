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
| Real Methods
|--------------------------------------------------------------------------
|
| The facades real methods, used to save the facades real methods. This way
| we can easily restore the default state of the dependency.
*/
export const REAL_METHODS = new Map<string, any>()
