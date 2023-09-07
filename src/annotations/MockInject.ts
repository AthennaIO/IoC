/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { Module } from '@athenna/common'
import { MissingServiceAnnotationException } from '#src/exceptions/MissingServiceAnnotationException'
import { debug } from '#src/debug'

const require = Module.createRequire(import.meta.url)

/**
 * Mock and inject some dependency of the service container in some property.
 */
export function MockInject(dependency: any): PropertyDecorator {
  return (target: any, key: string | symbol) => {
    if (!Reflect.hasMetadata('ioc:registered', dependency)) {
      throw new MissingServiceAnnotationException(dependency.name)
    }

    const sinon = require('sinon')
    const alias = Reflect.getMetadata('ioc:alias', dependency)

    debug(
      'Registering %s dependency as singleton in the service container with %s alias.',
      dependency.name,
      alias
    )

    ioc.singleton(alias, dependency, true)

    Object.defineProperty(target, key, {
      value: sinon.mock(ioc.safeUse(alias))
    })

    debug(
      'Dependency %s registered as a mock in %s target.',
      dependency.name,
      target.constructor.name
    )
  }
}
