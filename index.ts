/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { IoC } from './src/IoC'

export {}

declare global {
  const ioc: {
    use: (alias: string) => any
  }
}

const _global = global as any

if (!_global.ioc) {
  _global.ioc = {}

  _global.ioc.use = new IoC().use
}
