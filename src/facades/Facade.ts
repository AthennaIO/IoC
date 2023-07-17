/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src/container/Ioc'
import type { FacadeType } from '#src/types/FacadeType'
import { FacadeProxyHandler } from '#src/facades/FacadeProxyHandler'

export class Facade {
  /**
   * The container to resolve dependencies.
   */
  public static container: Ioc

  /**
   * Set the container if it does not exist.
   */
  public static setContainer(): void {
    if (this.container) {
      return
    }

    this.container = new Ioc()
  }

  /**
   * Create a new Facade for the alias specified
   */
  public static createFor<T = unknown>(alias: string): FacadeType<T> {
    this.setContainer()

    return new Proxy(
      this,
      new FacadeProxyHandler<T>(this.container, alias),
    ) as unknown as FacadeType<T>
  }
}
