/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Service } from '#src/annotations/Service'

interface Product {
  id: number
  name: string
}

@Service()
export class ProductService {
  public products: Product[] = [
    { id: 1, name: 'iPhone 1' },
    { id: 2, name: 'iPhone 2' },
  ]

  public constructor() {
    this.products.push({ id: 3, name: 'iPhone 3' })
  }

  public find() {
    return this.products
  }
}
