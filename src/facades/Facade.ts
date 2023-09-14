/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { FacadeType } from '#src'
import { FacadeProxyHandler } from '#src/facades/FacadeProxyHandler'

export class Facade {
  /**
   * Create a new Facade for the alias specified.
   */
  public static createFor<T = unknown>(alias: string): FacadeType<T> {
    return new Proxy(this, new FacadeProxyHandler<T>(alias)) as any
  }
}
