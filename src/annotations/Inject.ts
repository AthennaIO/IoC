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
import { MissingServiceAnnotationException } from '#src/exceptions/MissingServiceAnnotationException'

/**
 * Inject some dependency of the service container in some property.
 */
export function Inject(alias?: string): PropertyDecorator {
  return (target: any, key: string | symbol) => {
    if (!alias) {
      alias = key as string
    }

    debug(
      'Injecting %s dependency alias in %s dependency.',
      alias,
      target.constructor.name,
    )

    const dependency = ioc.safeUse(alias)

    if (!Reflect.hasMetadata('ioc:registered', dependency.constructor)) {
      throw new MissingServiceAnnotationException(dependency.constructor.name)
    }

    debug(
      'Dependency alias %s injected in %s dependency.',
      alias,
      target.constructor.name,
    )

    Object.defineProperty(target, key, { value: dependency })
  }
}
