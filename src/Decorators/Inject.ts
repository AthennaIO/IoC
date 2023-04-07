/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { Facade } from '#src/index'

/**
 * Inject some dependency of the service container in some property.
 */
export function Inject(alias?: string): PropertyDecorator {
  return (target: any, key: string | symbol) => {
    if (!alias) {
      alias = key as string
    }

    Object.defineProperty(target, key, { value: Facade.createFor(alias) })
  }
}
