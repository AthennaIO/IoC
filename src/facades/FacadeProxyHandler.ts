/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type {
  SpyInstance,
  MockBuilder,
  StubInstance,
  Mock as MockType
} from '@athenna/test'
import { debug } from '#src/debug'
import { Is, Module } from '@athenna/common'
import { PROTECTED_FACADE_METHODS } from '#src/constants/ProtectedFacadeMethods'

const athennaTest = await Module.safeImport('@athenna/test')
const Mock: typeof MockType = athennaTest?.Mock

export class FacadeProxyHandler<T = any> {
  /**
   * The facade accessor that will be used
   * to resolve the service inside the
   * service container.
   */
  public facadeAccessor: string

  /**
   * The service instance.
   */
  private provider: T = null

  /**
   * Creates a new instance of FacadeProxyHandler.
   */
  public constructor(facadeAccessor: string) {
    this.facadeAccessor = facadeAccessor
  }

  /**
   * Resolve and return the service instance
   * of the facade.
   */
  public getProvider(): T {
    return ioc.safeUse<T>(this.facadeAccessor)
  }

  /**
   * Returns the service instance registered
   * inside the facade if exists.
   */
  public getFreezedProvider(): T | null {
    return this.provider
  }

  /**
   * Freezes the service instance of the
   * facade until calling `unfreeze()` method.
   */
  public freeze(): void {
    this.provider = this.getProvider()
  }

  /**
   * Release the service instance of the
   * facade so new instances can be created.
   */
  public unfreeze(): void {
    this.provider = null
  }

  /**
   * Resolves a service instance of the
   * facade and save it to be used as stub.
   *
   * The stub will be used instead of resolving
   * the service.
   */
  public stub(): StubInstance<T> {
    this.freeze()

    return Mock.stub(this.provider)
  }

  /**
   * Resolve a service instance of the facade
   * and save it to be
   */
  public spy(): SpyInstance<T> {
    this.freeze()

    return Mock.spy(this.provider)
  }

  /**
   * Create a mock builder instance for the given method
   * of the facade.
   */
  public when(method: keyof T): MockBuilder {
    this.freeze()

    return Mock.when<T>(this.provider, method)
  }

  /**
   * Restore the mocked facade to the original state.
   */
  public restore(): void {
    if (!this.provider) {
      return
    }

    Mock.restore(this.provider)

    this.unfreeze()
  }

  /**
   * Method called by Proxy every time that a value is changed.
   * Returns the provider method with a Proxy applied in apply.
   * This way we guarantee that we are working with
   * the same instance when a Facade method returns this.
   */
  public set(_, key: string, value: any): boolean {
    if (this.provider) {
      this.provider[key] = value

      return true
    }

    const provider = this.getProvider()

    provider[key] = value

    return true
  }

  /**
   * Method called by Proxy every time a new property is called.
   * Returns the provider method with a Proxy applied in apply.
   * This way we guarantee that we are working with
   * the same instance when a Facade method returns this.
   */
  public get(_, key: string): any {
    if (PROTECTED_FACADE_METHODS.includes(key)) {
      debug('restricted facade method executed: %s', key)

      const method = this[key]

      if (!Is.Function(method)) {
        return method
      }

      return this[key].bind(this)
    }

    if (this.provider) {
      return this.provider[key]
    }

    const provider = this.getProvider()

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
