/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Test, type Context } from '@athenna/test'
import { BaseTest } from '#tests/helpers/BaseTest'
import { Annotation } from '#src/helpers/Annotation'
import { StringHelper } from '#tests/fixtures/StringHelper'

export default class ServiceAnnotationTest extends BaseTest {
  @Test()
  public async shouldBeAbleToPreregisterServicesUsingServiceAnnotation({ assert }: Context) {
    const ProductService = await this.import('#tests/fixtures/ProductService')

    const metadata = Annotation.getMeta(ProductService)

    assert.equal(metadata.type, 'transient')
    assert.equal(metadata.camelAlias, 'productService')
    assert.equal(metadata.alias, 'App/Services/ProductService')
    assert.equal(metadata.isRegistered, false)
  }

  @Test()
  public async shouldNotReRegisterTheServiceIfItIsAlreadyRegisteredInTheServiceContainer({ assert }: Context) {
    ioc.singleton('App/Services/ProductService', StringHelper).alias('productService', 'App/Services/ProductService')

    const ProductService = await this.import('#tests/fixtures/ProductService')

    assert.isFalse(Annotation.isAnnotated(ProductService))
  }
}
