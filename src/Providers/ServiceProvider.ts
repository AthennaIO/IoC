/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from 'src/Ioc'

export abstract class ServiceProvider {
  protected container: Ioc

  public constructor() {
    this.container = new Ioc()
  }

  /**
   * Boot method is called after all main providers has been booted
   *
   * Example: this.container.use('Addons/Database/DatabaseProvider') -> Instance
   */
  abstract get boot()

  /**
   * Register method is called before main providers has been booted
   *
   * Example: this.container.use('Addons/Database/DatabaseProvider') -> undefined
   */
  abstract get register()
}
