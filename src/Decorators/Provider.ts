/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'reflect-metadata'

import { String } from '@athenna/common'

/**
 * Register some dependency inside the IoC container.
 */
export function Provider(
  alias?: string,
  type: 'fake' | 'scoped' | 'singleton' | 'transient' = 'transient',
): ClassDecorator {
  return (target: any) => {
    if (!alias) {
      alias = String.toCamelCase(target.name)
    }

    if (ioc.hasDependency(alias)) {
      return
    }

    ioc[type](alias, target)
  }
}
