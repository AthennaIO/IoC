/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  IOC_TYPE,
  IOC_ALIAS,
  IOC_REGISTERED,
  IOC_CAMEL_ALIAS
} from '#src/constants/MetadataKeys'
import { Options } from '@athenna/common'
import type { ServiceOptions } from '#src'

export type ServiceMeta = {
  type: string
  alias: string
  camelAlias?: string
  isRegistered: boolean
}

export class Annotation {
  /**
   * Verify if provider is decorated or not.
   */
  public static isAnnotated(target: any): boolean {
    return Reflect.hasMetadata(IOC_REGISTERED, target)
  }

  /**
   * Define all metadata for a service.
   */
  public static defineServiceMeta(target: any, options: ServiceOptions) {
    Options.whenDefined(options.type, type => {
      Reflect.defineMetadata(IOC_TYPE, type, target)
    })

    Options.whenDefined(options.alias, alias => {
      Reflect.defineMetadata(IOC_ALIAS, alias, target)
    })

    Options.whenDefined(options.camelAlias, camelAlias => {
      Reflect.defineMetadata(IOC_CAMEL_ALIAS, camelAlias, target)
    })

    if (Annotation.hasAllMetaDefined(target)) {
      Reflect.defineMetadata(IOC_REGISTERED, false, target)
    }
  }

  /**
   * Define the service as registered.
   */
  public static defineAsRegistered(target: any) {
    Reflect.defineMetadata(IOC_REGISTERED, true, target)
  }

  /**
   * Verify if all metadata is defined in the service.
   */
  public static hasAllMetaDefined(target: any) {
    const hasType = Reflect.hasMetadata(IOC_TYPE, target)
    const hasAlias = Reflect.hasMetadata(IOC_ALIAS, target)

    return hasType && hasAlias
  }

  /**
   * Get all the metadata from the service.
   */
  public static getMeta(target: any): ServiceMeta {
    return {
      type: Reflect.getMetadata(IOC_TYPE, target) || 'transient',
      alias:
        Reflect.getMetadata(IOC_ALIAS, target) || `App/Services/${target.name}`,
      camelAlias: Reflect.getMetadata(IOC_CAMEL_ALIAS, target),
      isRegistered: Reflect.getMetadata(IOC_REGISTERED, target)
    }
  }
}
