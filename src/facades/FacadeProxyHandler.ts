/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { debug } from '#src/debug'
import { Is } from '@athenna/common'
import { Mock, MockBuilder, type StubInstance } from '@athenna/test'
import { PROTECTED_FACADE_METHODS } from '#src/constants/ProtectedFacadeMethods'

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
   * The stubbed service instance.
   */
  private stubbed: StubInstance<T> = null

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
   * facade and save it to be used instead of the
   * original one.
   */
  public stub(): StubInstance<T> {
    this.provider = this.getProvider()
    this.stubbed = Mock.stub(this.provider)

    return this.stubbed
  }

  /**
   * Create a mock builder instance for the given method
   * of the facade.
   */
  public when(method: keyof T): MockBuilder {
    this.provider = this.getProvider()

    const stub = Mock.when<T>(this.provider, method)

    return stub
  }

  /**
   * Restore the facade to the original state
   * by removing the stubbed instance.
   */
  public restore(): void {
    this.stubbed = null
    this.provider = null
  }

  /**
   * Method called by Proxy every time that a value is changed.
   * Returns the provider method with a Proxy applied in apply.
   * This way we guarantee that we are working with
   * the same instance when a Facade method returns this.
   */
  public set(_, key: string, value: any): boolean {
    if (this.stubbed) {
      this.stubbed[key] = value

      return true
    }

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
      debug('Restricted facade method executed: %s', key)

      const method = this[key]

      if (!Is.Function(method)) {
        return method
      }

      return this[key].bind(this)
    }

    if (this.stubbed) {
      return this.stubbed[key]
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
