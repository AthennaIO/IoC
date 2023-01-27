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
  return (target: any, key: string | symbol) => {
    if (!alias) {
      alias = key as string
    }

    const dependency = ioc.use(alias)

    if (dependency) {
      defineValue(target, key, dependency)

      return
    }

    defineValue(target, key, getProxyResolver(alias, dependency))
  }
}

/**
 * Define some value in the target, values defined by Inject
 * decorator cannot be writable, enumerable or configurable.
 */
function defineValue(target: string, key: string | symbol, value: any) {
  Object.defineProperty(target, key, {
    value,
    writable: false,
    enumerable: false,
    configurable: false,
  })
}

/**
 * Create a proxy that will resolve the dependency
 * when called.
 *
 * @example
 *  // If userService has not been resolved,
 *  // Proxy will resolve it and define the property.
 *  this.userService.findOne()
 */
function getProxyResolver(alias: string, dependency: any) {
  const handler = {
    get: (_: any, key: string) => {
      if (!dependency) {
        dependency = ioc.safeUse(alias)
      }

      return dependency[key]
    },
  }

  return new Proxy({}, handler)
}
