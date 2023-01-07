/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src/index'
import { REAL_METHODS } from '#src/Constants/RealMethods'

export class ProviderFaker {
  /**
   * The Ioc container instance.
   *
   * @type {Ioc}
   */
  static container

  /**
   * Set the container instance.
   *
   * @return {typeof ProviderFaker}
   */
  static boot() {
    if (!this.container) {
      this.container = new Ioc()
    }

    return this
  }

  /**
   * Fake a provider method.
   *
   * @param alias {string}
   * @param method {string}
   * @param returnValue {any}
   * @return {void}
   */
  static fakeMethod(alias, method, returnValue) {
    this.boot()

    const providerProto = this.#getProviderProto(alias)

    REAL_METHODS.set(this.#getKey(alias, method), providerProto[method])

    providerProto[method] = returnValue
  }

  /**
   * Restore a provider method to the default state.
   *
   * @param alias {string}
   * @param method {string}
   * @return {void}
   */
  static restoreMethod(alias, method) {
    const key = this.#getKey(alias, method)

    if (!REAL_METHODS.has(key)) {
      return
    }

    this.boot()

    const providerProto = this.#getProviderProto(alias)

    providerProto[method] = REAL_METHODS.get(key)

    REAL_METHODS.delete(key)
  }

  /**
   * Restore all the providers methods with the alias
   * to the default state.
   *
   * @param {string} alias
   * @return {void}
   */
  static restoreAllMethods(alias) {
    REAL_METHODS.forEach((_, key) => {
      if (!key.includes(alias)) {
        return
      }

      this.restoreMethod(alias, key.split('::')[1])
    })
  }

  /**
   * Get the provider from the container.
   *
   * @param {string} alias
   * @return {any}
   */
  static #getProvider(alias) {
    return this.container.safeUse(alias)
  }

  /**
   * Generate the method key for the map.
   *
   * @param {string} alias
   * @param {string} method
   * @return {string}
   */
  static #getKey(alias, method) {
    return `${alias}::${method}`
  }

  /**
   * Get the provider prototype to make mods.
   *
   * @param {string} alias
   * @return {any}
   */
  static #getProviderProto(alias) {
    const provider = this.#getProvider(alias)

    return provider.constructor.prototype
  }
}
