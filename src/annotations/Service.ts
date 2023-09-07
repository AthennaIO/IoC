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
import { Options } from '@athenna/common'
import type { ServiceOptions } from '#src/types/ServiceOptions'

/**
 * Create a service inside the service provider.
 */
export function Service(options?: ServiceOptions): ClassDecorator {
  return (target: any) => {
    options = Options.create(options, {
      alias: `App/Services/${target.name}`,
      type: 'transient'
    })

    const alias = options.alias
    const createCamelAlias = true

    debug(
      'Registering %s dependency as a %s in the service container with %s alias.',
      target.name,
      options.type,
      alias
    )

    if (ioc.hasDependency(alias)) {
      debug(
        'Dependency with alias %s already exists in the service provider, skipping registration of %s dependency.',
        alias,
        target.name
      )

      defineMetadata(target, options)

      return
    }

    ioc[options.type](alias, target, createCamelAlias)

    debug(
      'Dependency %s with alias %s registered in the service container as a %s dependency.',
      target.name,
      alias,
      options.type
    )

    defineMetadata(target, options)
  }
}

export function defineMetadata(target: any, options: ServiceOptions) {
  Reflect.defineMetadata('ioc:registered', true, target)
  Reflect.defineMetadata('ioc:type', options.type, target)
  Reflect.defineMetadata('ioc:alias', options.alias, target)
  Reflect.defineMetadata('ioc:camelAlias', options.alias, target)
}
