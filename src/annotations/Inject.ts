/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { debug } from '#src/debug'
import { Facade } from '#src/facades/Facade'

/**
 * Inject some service in a class property.
 */
export function Inject(alias?: string): PropertyDecorator {
  return (target: any, key: string | symbol) => {
    const injected = Reflect.getMetadata('design:type', target, key)

    if (!alias && injected) {
      alias = Reflect.getMetadata('ioc:alias', injected)
    }

    alias = alias || (key as string)

    debug('injecting service %o', {
      alias,
      target: target.constructor.name,
      targetKey: key
    })

    Object.defineProperty(target, key, { value: Facade.createFor(alias) })
  }
}
