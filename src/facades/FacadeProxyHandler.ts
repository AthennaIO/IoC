/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Mock } from '#src/types'
import { Ioc } from '#src/container/Ioc'
import { Facade } from '#src/facades/Facade'
import { Is, Module } from '@athenna/common'
import type { FacadeType } from '#src/types/FacadeType'
import { PROTECTED_FACADE_METHODS } from '#src/constants/ProtectedFacadeMethods'

const require = Module.createRequire(import.meta.url)

export class FacadeProxyHandler<T = any> {
  /**
   * The container to resolve dependencies.
   */
  private container: Ioc

  /**
   * The facade accessor that will be used
   * to resolve the dependency inside the
   * service container.
   */
  private facadeAccessor: string

  /**
   * The mocked provider instance that will
   * be used with Sinon.
   */
  private mockedProvider: any

  /**
   * Creates a new instance of FacadeProxyHandler.
   */
  public constructor(container: Ioc, facadeAccessor: string) {
    this.container = container
    this.facadeAccessor = facadeAccessor
  }

  /**
   * Get the facade alias registered to resolve deps
   * from the Ioc.
   */
  public getFacadeAlias(): string {
    return this.facadeAccessor
  }

  /**
   * Get the facade provider resolved from the Ioc.
   */
  public getFacadeProvider(): T {
    return this.container.safeUse<T>(this.facadeAccessor)
  }

  /**
   * Set a fake return value in the Facade method.
   */
  public fakeMethod(method: string, returnValue: any): FacadeType<T> {
    this.container.fakeMethod(this.facadeAccessor, method, returnValue)

    return this as any
  }

  /**
   * Restore the mocked method to his default state.
   */
  public restoreMethod(method: string): FacadeType<T> {
    this.container.restoreMethod(this.facadeAccessor, method)

    return this as any
  }

  /**
   * Restore all the mocked methods of this facade to
   * their default state.
   */
  public restoreAllMethods(): FacadeType<T> {
    this.container.restoreAllMethods(this.facadeAccessor)

    return this as any
  }

  /**
   * Return a sinon mock instance.
   */
  public getMock(): Mock {
    const sinon = require('sinon')

    this.mockedProvider = this.getFacadeProvider()

    return new Proxy(sinon.mock(this.mockedProvider), {
      get: (mock, method) => {
        if (method === 'verify') {
          this.mockedProvider = null
        }

        return mock[method]
      }
    })
  }

  /**
   * Method called by Proxy everytime a new property is called.
   */
  public get(facade: typeof Facade, key: string): any {
    if (PROTECTED_FACADE_METHODS.includes(key)) {
      return this[key].bind(this)
    }

    if (this.mockedProvider) {
      return this.mockedProvider[key]
    }

    return this.__callStatic(facade, key)
  }

  /**
   * Returns the provider method with a Proxy applied in apply.
   * This way we guarantee that we are working with
   * the same instance when a Facade method returns this.
   */
  public __callStatic(facade: typeof Facade, key: string): any {
    const provider = facade.container.safeUse(this.facadeAccessor)

    if (provider[key] === undefined) {
      return undefined
    }

    if (!Is.Function(provider[key])) {
      return provider[key]
    }

    return new Proxy(provider[key], {
      apply: (method, _this, args) => method.bind(provider)(...args)
    })
  }
}
