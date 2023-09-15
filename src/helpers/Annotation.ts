/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Options } from '@athenna/common'
import type { ServiceOptions } from '#src'

export type ServiceMeta = {
  type: string
  alias: string
  camelAlias?: string
  registered: boolean
  [key: string]: any
}

export class Annotation {
  /**
   * Verify if provider is decorated or not.
   */
  public static isAnnotated(target: any): boolean {
    return Reflect.hasMetadata('ioc:registered', target)
  }

  /**
   * Define all metadata for a service.
   */
  public static defineMeta(target: any, options: ServiceOptions) {
    Object.keys(options).forEach(key => {
      const value = options[key]

      Options.whenDefined(value, value => {
        Reflect.defineMetadata(`ioc:${key}`, value, target)
      })
    })

    Reflect.defineMetadata('ioc:registered', false, target)
  }

  /**
   * Define the service as registered.
   */
  public static defineAsRegistered(target: any) {
    Reflect.defineMetadata('ioc:registered', true, target)
  }

  /**
   * Get all the metadata from the service.
   */
  public static getMeta(target: any): ServiceMeta {
    const meta: any = {}

    Reflect.getMetadataKeys(target).forEach(key => {
      const value = Reflect.getMetadata(key, target)

      meta[key.replace('ioc:', '')] = value
    })

    if (!meta.type) {
      meta.type = 'transient'
    }

    if (!meta.alias) {
      meta.alias = `App/Services/${target.name}`
    }

    return meta
  }
}
