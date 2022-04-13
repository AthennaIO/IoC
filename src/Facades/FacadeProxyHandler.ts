/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Is } from '@secjs/utils'
import { Facade } from 'src/Facades/Facade'

export class FacadeProxyHandler {
  /**
   * The facade accessor that will be used to resolve the dependency.
   */
  private readonly facadeAccessor: string

  /**
   * Creates a new instance of FacadeProxyHandler.
   *
   * @return {FacadeProxyHandler}
   */
  public constructor(facadeAccessor: string) {
    this.facadeAccessor = facadeAccessor
  }

  /**
   * Method called by Proxy everytime a new property is called.
   *
   * @param facade
   * @param key
   * @return {any}
   */
  get(facade: typeof Facade, key: string) {
    return this.__callStatic(facade, key)
  }

  /**
   * Returns the provider method with a Proxy applied in apply.
   * This way we guarantee that we are working with
   * the same instance when a Facade method returns this.
   *
   * @param facade
   * @param key
   * @return {any}
   */
  private __callStatic(facade: typeof Facade, key: string) {
    if (facade[key]) return facade[key]

    const provider = facade.getFacadeRoot(this.facadeAccessor)

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
