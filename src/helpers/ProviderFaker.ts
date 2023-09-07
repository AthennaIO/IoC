/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src/container/Ioc'
import { REAL_METHODS } from '#src/constants/RealMethods'

export class ProviderFaker {
  /**
   * The Ioc container instance.
   */
  public static container: Ioc

  /**
   * Set the container instance.
   */
  public static boot(): typeof ProviderFaker {
    if (!this.container) {
      this.container = new Ioc()
    }

    return this
  }

  /**
   * Fake a provider method.
   */
  public static fakeMethod(
    alias: string,
    method: string,
    returnValue: any
  ): void {
    this.boot()

    const providerProto = this.getProviderProto(alias)

    REAL_METHODS.set(this.getKey(alias, method), providerProto[method])

    providerProto[method] = returnValue
  }

  /**
   * Restore a provider method to the default state.
   */
  public static restoreMethod(alias: string, method: string): void {
    const key = this.getKey(alias, method)

    if (!REAL_METHODS.has(key)) {
      return
    }

    this.boot()

    const providerProto = this.getProviderProto(alias)

    providerProto[method] = REAL_METHODS.get(key)

    REAL_METHODS.delete(key)
  }

  /**
   * Restore all the providers methods with the alias
   * to the default state.
   */
  public static restoreAllMethods(alias: string): void {
    REAL_METHODS.forEach((_, key) => {
      if (!key.includes(alias)) {
        return
      }

      this.restoreMethod(alias, key.split('::')[1])
    })
  }

  /**
   * Get the provider from the container.
   */
  private static getProvider(alias: string): any {
    return this.container.safeUse(alias)
  }

  /**
   * Generate the method key for the map.
   */
  private static getKey(alias: string, method: string): string {
    return `${alias}::${method}`
  }

  /**
   * Get the provider prototype to make mods.
   */
  private static getProviderProto(alias: string): any {
    const provider = this.getProvider(alias)

    return provider.constructor.prototype
  }
}
