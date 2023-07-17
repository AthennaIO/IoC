/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { Except } from '@athenna/common/types'
import type { FacadeProxyHandler } from '#src/facades/FacadeProxyHandler'

export type FacadeType<T = unknown> = Except<
  FacadeProxyHandler,
  'get' | '__callStatic'
> &
  T
