/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc as IocImpl } from '#src/Container/Ioc'

export {}

declare global {
  export const ioc: IocImpl
  export const container: IocImpl
}

const __global: any = global

if (!__global.ioc) {
  __global.ioc = new IocImpl()
}

if (!__global.container) {
  __global.container = new IocImpl()
}
