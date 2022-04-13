/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from 'src/Ioc'
import { FacadeProxyHandler } from './FacadeProxyHandler'

export class Facade {
  /**
   * The container to resolve dependencies.
   */
  static container = new Ioc()

  /**
   * Resolve the dependency from the container by the name.
   *
   * @param name
   */
  static getFacadeRoot(name: string) {
    return this.container.safeUse(name)
  }

  /**
   * Create a new Facade for the alias specified
   *
   * @param alias
   */
  static createFor<Provider = any>(alias: string): Provider & typeof Facade {
    return new Proxy(this, new FacadeProxyHandler(alias)) as any
  }
}
