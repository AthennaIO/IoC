/* eslint-disable import/first */
/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src/index'
import { test } from '@japa/runner'
import { Exec } from '@athenna/common'
import { HelpersProvider } from '#tests/Stubs/HelpersProvider'
import { ProviderService } from '#tests/Stubs/ProviderService'

test.group('ProviderDecoratorTest', group => {
  group.setup(async () => {
    new Ioc().reconstruct()
    await import('#tests/Stubs/ProviderService')
    new HelpersProvider().registerAttributes()

    /**
     * Wait 10ms so awilix could register the attributes
     * that are promises. Due to import('...')
     */
    await Exec.sleep(10)
  })

  test('should be able to register dependencies using the provider decorator', async ({ assert }) => {
    const providerService = ioc.use<ProviderService>('providerService')

    assert.isDefined(providerService.findOneUser())
  })
})
