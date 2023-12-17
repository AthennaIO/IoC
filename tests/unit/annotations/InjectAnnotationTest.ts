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
import { NotFoundServiceException } from '#src/exceptions/NotFoundServiceException'

export default class InjectAnnotationTest extends BaseTest {
  @Test()
  public async shouldBeAbleToPreregisterServicesUsingInjectAnnotationUsingPropertyType({ assert }: Context) {
    const InjectService = await this.import('#tests/fixtures/InjectService')

    const injectService = new InjectService()

    assert.isDefined(injectService.clientService)
  }

  @Test()
  public async shouldBeAbleToPreregisterServicesUsingInjectAnnotationUsingDefinedAlias({ assert }: Context) {
    const InjectService = await this.import('#tests/fixtures/InjectService')

    const injectService = new InjectService()

    assert.isDefined(injectService.userService)
  }

  @Test()
  public async shouldBeAbleToPreregisterServicesUsingInjectAnnotationUsingPropertyKeyAsAlias({ assert }: Context) {
    const InjectService = await this.import('#tests/fixtures/InjectService')

    const injectService = new InjectService()

    Reflect.defineMetadata('design:type', undefined, injectService)

    assert.isDefined(injectService.noMetadataService)
  }

  @Test()
  public async shouldThrowExceptionIfTryingToUseAServiceThatIsOnlyPreregistered({ assert }: Context) {
    const InjectService = await this.import('#tests/fixtures/InjectService')

    const injectService = new InjectService()

    assert.throws(() => injectService.findClients(), NotFoundServiceException)
  }
}
