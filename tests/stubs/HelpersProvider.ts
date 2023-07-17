/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ServiceProvider } from '#src'

export class HelpersProvider extends ServiceProvider {
  public register() {
    this.container.instance('Helpers/StringFn', () => 'StringFn')
  }

  public async boot() {
    this.container.instance('Helpers/NumberFn', () => 'NumberFn')
  }

  public shutdown() {
    this.container.instance('Helpers/StringFn', null)
    this.container.instance('Helpers/NumberFn', null)
  }
}
