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
import { String } from '@athenna/common'
import { Facade } from '#src/facades/Facade'
import { Annotation } from '#src/helpers/Annotation'

/**
 * Inject a stub instance of the service in a class
 * (usually test classes).
 */
export function InjectStub(Service: any): PropertyDecorator {
  return (target: any, key: string | symbol) => {
    let { alias, camelAlias } = Annotation.getMeta(Service)

    debug('injecting stubbed service %o', {
      alias,
      target: target.constructor.name,
      targetKey: key,
      service: Service,
      serviceName: Service.name
    })

    if (!camelAlias) {
      camelAlias = String.toCamelCase(Service.name)
    }

    ioc.fake(alias, Service).alias(camelAlias, alias)

    Object.defineProperty(target, key, {
      value: Facade.createFor(alias).stub()
    })
  }
}
