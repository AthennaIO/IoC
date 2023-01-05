/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src/index'
import { String } from '@athenna/common'
import { FacadeProxyHandler } from '#src/Facades/FacadeProxyHandler'

export class Facade {
  /**
   * The container to resolve dependencies.
   *
   * @type {Ioc}
   */
  static container

  /**
   * The dependency mocks restore map. This
   * is used to save the default deps methods,
   * so we can restore the mocked methods.
   *
   * @type {Map<any, any>}
   */
  static depsMocksRestoreMap = new Map()

  constructor(alias, Provider) {
    this.alias = alias
    this.Provider = Provider
  }

  /**
   * Mock a method of the dependency inside the container.
   *
   * @param {string} method
   * @param {any} returnValue
   * @return {void}
   */
  __mock(method, returnValue) {
    const providerName = this.Provider.name
    const providerNameCamel = String.toCamelCase(providerName)
    const registration = Facade.container.list()[providerNameCamel]
    const lifetime = registration.lifetime
      ? registration.lifetime.toLowerCase()
      : 'bind'

    Facade.depsMocksRestoreMap.set(
      `${providerName}::${method}`,
      this.Provider.prototype[method],
    )

    this.Provider.prototype[method] = returnValue

    Facade.container[lifetime](this.alias, this.Provider, true)
  }

  /**
   * Restore the provider default method.
   *
   * @param {string} method
   * @return {void}
   */
  __restore(method) {
    const key = `${this.Provider.name}::${method}`

    this.Provider.prototype[method] = Facade.depsMocksRestoreMap.get(key)

    Facade.depsMocksRestoreMap.delete(key)
  }

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
