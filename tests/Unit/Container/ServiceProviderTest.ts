/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src'
import { Exec } from '@athenna/common'
import { Test, BeforeEach, TestContext } from '@athenna/test'
import { HelpersProvider } from '#tests/Stubs/HelpersProvider'

export default class ServiceProviderTest {
  @BeforeEach()
  public async beforeEach() {
    new Ioc().reconstruct()
  }

  @Test()
  public async shouldBeAbleToExecuteBootRegisterAndShutdownMethods({ assert }: TestContext) {
    new HelpersProvider().register()

    assert.isDefined(ioc.use('Helpers/StringFn'))

    new HelpersProvider().boot()

    assert.isDefined(ioc.use('Helpers/NumberFn'))

    new HelpersProvider().shutdown()

    assert.isNull(ioc.use('Helpers/StringFn'))
    assert.isNull(ioc.use('Helpers/NumberFn'))
  }

  @Test()
  public async shouldBeAbleToCreateCustomServiceProvidersUsingDefaultBindingsAttribute({ assert }: TestContext) {
    new HelpersProvider().registerAttributes()

    /**
     * Wait 10ms so awilix could register the attributes
     * that are promises. Due to import('...')
     */
    await Exec.sleep(10)

    assert.isDefined(ioc.use('Helpers/UserService'))
    assert.isDefined(ioc.use('Helpers/ClientService'))
    assert.isDefined(ioc.use('Helpers/NewStringHelper'))
  }
}
