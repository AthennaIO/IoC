/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src/index'
import { FacadeProxyHandler } from '#src/Facades/FacadeProxyHandler'

export class Facade {
  /**
   * The container to resolve dependencies.
   *
   * @type {Ioc}
   */
  static container

  /**
   * Resolve the dependency from the container by the name.
   *
   * @param {string} alias
   */
  static getFacadeRoot(alias) {
    return this.container.safeUse(alias)
  }

  /**
   * Set the container if it does not exist.
   */
  static setContainer() {
    if (this.container) {
      return
    }

    this.container = new Ioc()
  }

  /**
   * Create a new Facade for the alias specified
   *
   * @param {string} alias
   * @return {any}
   */
  static createFor(alias) {
    this.setContainer()

    return new Proxy(this, new FacadeProxyHandler(alias))
  }
}
