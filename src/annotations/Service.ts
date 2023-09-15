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
import type { ServiceOptions } from '#src'
import { String, Options } from '@athenna/common'
import { Annotation } from '#src/helpers/Annotation'

/**
 * Create a service inside the service.
 */
export function Service(options?: ServiceOptions): ClassDecorator {
  return (target: any) => {
    options = Options.create(options, {
      type: 'transient',
      alias: `App/Services/${target.name}`,
      camelAlias: String.toCamelCase(target.name)
    })

    debug('Registering service in the service container %o', {
      name: target.name,
      ...options
    })

    if (ioc.has(options.alias) || ioc.has(options.camelAlias)) {
      debug('Skipping registration, service is already registered.')

      return
    }

    Annotation.defineMeta(target, options)
  }
}
