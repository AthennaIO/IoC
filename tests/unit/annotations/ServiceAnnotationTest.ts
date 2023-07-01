/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Test } from '@athenna/test'
import { BaseTest } from '#tests/helpers/BaseTest'
import type { Context } from '@athenna/test/types'
import type { ProductService } from '#tests/stubs/ProductService'

export default class ServiceAnnotationTest extends BaseTest {
  @Test()
  public async shouldBeAbleToRegisterDependenciesUsingServiceDecoratorAndResolveByCamelAlias({ assert }: Context) {
    await this.import('#tests/stubs/ProductService')

    const productService = ioc.use<ProductService>('productService')

    assert.deepEqual(productService.find(), [
      { id: 1, name: 'iPhone 1' },
      { id: 2, name: 'iPhone 2' },
      { id: 3, name: 'iPhone 3' },
    ])
  }

  @Test()
  public async shouldBeAbleToRegisterDependenciesUsingServiceDecoratorAndResolveByFullAlias({ assert }: Context) {
    await this.import('#tests/stubs/ProductService')

    const productService = ioc.use<ProductService>('App/Services/ProductService')

    assert.deepEqual(productService.find(), [
      { id: 1, name: 'iPhone 1' },
      { id: 2, name: 'iPhone 2' },
      { id: 3, name: 'iPhone 3' },
    ])
  }

  @Test()
  public async shouldNotReRegisterTheDependencyIfItIsAlreadyRegisteredInTheContainer({ assert }: Context) {
    await this.import('#tests/stubs/ProductService')

    const productService = ioc.use<ProductService>('App/Services/ProductService')

    productService.products.pop()

    await this.import('#tests/stubs/ProductService')

    assert.deepEqual(productService.find(), [
      { id: 1, name: 'iPhone 1' },
      { id: 2, name: 'iPhone 2' },
    ])
  }
}
