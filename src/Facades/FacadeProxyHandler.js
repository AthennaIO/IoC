/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is } from '@athenna/common'

export class FacadeProxyHandler {
  /**
   * The facade accessor that will be used to resolve the dependency.
   *
   * @type {string}
   */
  #facadeAccessor

  /**
   * Creates a new instance of FacadeProxyHandler.
   *
   * @param {string} facadeAccessor
   * @return {FacadeProxyHandler}
   */
  constructor(facadeAccessor) {
    this.#facadeAccessor = facadeAccessor
  }

  /**
   * Method called by Proxy everytime a new property is called.
   *
   * @param {typeof import('#src/Facades/Facade').Facade} facade
   * @param {string} key
   * @return {any}
   */
  get(facade, key) {
    return this.__callStatic(facade, key)
  }

  /**
   * Returns the provider method with a Proxy applied in apply.
   * This way we guarantee that we are working with
   * the same instance when a Facade method returns this.
   *
   * @param {typeof import('#src/Facades/Facade').Facade} Facade
   * @param {string} key
   * @return {any}
   */
  __callStatic(Facade, key) {
    const provider = Facade.getFacadeRoot(this.#facadeAccessor)
    const facadeMethods = new Facade(this.#facadeAccessor, provider.constructor)

    /**
     * Execute the facade methods like __mock.
     */
    if (facadeMethods[key]) {
      return facadeMethods[key]
    }

    /**
     * Access methods from the Facade class instead of
     * the provider.
     */
    if (Facade[key] && !provider[key]) {
      return Facade[key]
    }

    const apply = (method, _this, args) => method.bind(provider)(...args)

    if (provider[key] === undefined) {
      return undefined
    }

    if (!Is.Function(provider[key])) {
      return provider[key]
    }

    return new Proxy(provider[key], { apply })
  }
}
