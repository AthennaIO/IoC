/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from 'src/Ioc'

export {}

declare global {
  const ioc: {
    use: <Dependency = any>(alias: string) => Dependency
  }
}

const _global = global as any

if (!_global.ioc) {
  _global.ioc = {}

  const ioc = new Ioc()

  _global.ioc.use = ioc.safeUse.bind(ioc)
}

export * from 'src/Ioc'
export * from 'src/Providers/ServiceProvider'
