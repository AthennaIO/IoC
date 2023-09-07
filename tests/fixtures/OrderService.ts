/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Service } from '#src/annotations/Service'

interface Order {
  id: number
  title: string
}

@Service()
export class OrderService {
  public orders: Order[] = [
    { id: 1, title: 'Order 1' },
    { id: 2, title: 'Order 2' }
  ]

  public constructor() {
    this.orders.push({ id: 3, title: 'Order 3' })
  }

  public find() {
    return this.orders
  }
}
