/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

/**
 * Inject some dependency of the service container in some property.
 */
export function Inject(alias?: string): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const Model = target.constructor

    if (alias) {
      Model.prototype[propertyKey] = ioc.safeUse(alias)

      return
    }

    Model.prototype[propertyKey] = ioc.safeUse(propertyKey as string)
  }
}
