/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is } from '@athenna/common'
import { createRequire } from 'node:module'
import { PROTECTED_FACADE_METHODS } from '#src/Constants/ProtectedFacadeMethods'

const require = createRequire(import.meta.url)

export class FacadeProxyHandler {
  /**
   * Creates a new instance of FacadeProxyHandler.
   *
   * @param {Ioc} container
   * @param {string} facadeAccessor
   */
  constructor(container, facadeAccessor) {
    this.container = container
    this.facadeAccessor = facadeAccessor
  }

  /**
   * Get the facade alias registered to resolve deps
   * from the Ioc.
   *
   * @return {string}
   */
  getFacadeAlias() {
    return this.facadeAccessor
  }

  /**
   * Get the facade provider resolved from the Ioc.
   *
   * @return {any}
   */
  getFacadeProvider() {
    return this.container.safeUse(this.facadeAccessor)
  }

  /**
   * Set a fake return value in the Facade method.
   *
   * @param method {string}
   * @param returnValue {any}
   * @return {typeof Facade}
   */
  fakeMethod(method, returnValue) {
    this.container.fakeMethod(this.facadeAccessor, method, returnValue)

    return this
  }

  /**
   * Restore the mocked method to his default state.
   *
   * @param method {string}
   * @return {typeof Facade}
   */
  restoreMethod(method) {
    this.container.restoreMethod(this.facadeAccessor, method)

    return this
  }

  /**
   * Restore all the mocked methods of this facade to
   * their default state.
   *
   * @return {typeof Facade}
   */
  restoreAllMethods() {
    this.container.restoreAllMethods(this.facadeAccessor)

    return this
  }

  /**
   * Return a sinon mock instance.
   *
   * @return {any}
   */
  getMock() {
    const sinon = require('sinon')

    this.mockedProvider = this.getFacadeProvider()

    return new Proxy(sinon.mock(this.mockedProvider), {
      get: (mock, method) => {
        if (method === 'verify') {
          this.mockedProvider = null
        }

        return mock[method]
      },
    })
  }

  /**
   * Method called by Proxy everytime a new property is called.
   *
   * @param {typeof import('#src/Facades/Facade').Facade} Facade
   * @param {string} key
   * @return {any}
   */
  get(Facade, key) {
    if (PROTECTED_FACADE_METHODS.includes(key)) {
      return this[key].bind(this)
    }

    if (this.mockedProvider) {
      return this.mockedProvider[key]
    }

    return this.__callStatic(Facade, key)
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
    const provider = Facade.container.safeUse(this.facadeAccessor)

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
