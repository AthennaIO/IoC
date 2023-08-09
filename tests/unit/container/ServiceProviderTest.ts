/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseTest } from '#tests/helpers/BaseTest'
import { Test, type Context } from '@athenna/test'
import { HelpersProvider } from '#tests/stubs/HelpersProvider'

export default class ServiceProviderTest extends BaseTest {
  @Test()
  public async shouldBeAbleToRegisterDependencies({ assert }: Context) {
    new HelpersProvider().register()

    assert.isDefined(ioc.use('Helpers/StringFn'))
  }

  @Test()
  public async shouldBeAbleToBootDependencies({ assert }: Context) {
    new HelpersProvider().boot()

    assert.isDefined(ioc.use('Helpers/NumberFn'))
  }

  @Test()
  public async shouldBeAbleToShutdownDependencies({ assert }: Context) {
    new HelpersProvider().register()
    new HelpersProvider().boot()
    new HelpersProvider().shutdown()

    assert.isNull(ioc.use('Helpers/StringFn'))
    assert.isNull(ioc.use('Helpers/NumberFn'))
  }
}
