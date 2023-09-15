/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type ServiceOptions = {
  /**
   * The alias that will be used to register the service inside
   * the service.
   *
   * @default 'App/Services/YourServiceClassName'
   */
  alias?: string

  /**
   * The camel alias that will be used as an alias of the real
   * service alias. Camel alias is important when you want to
   * work with constructor injection.
   *
   * @default 'yourServiceClassName'
   */
  camelAlias?: string

  /**
   * The registration type that will be used to register your service
   * inside the service.
   *
   * @default 'transient'
   */
  type?: 'fake' | 'scoped' | 'singleton' | 'transient'

  [key: string]: any
}
