/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { Exec } from '@athenna/common'

import { Ioc } from '#src/index'
import { HelpersProvider } from '#tests/Stubs/HelpersProvider'

test.group('ServiceProviderTest', group => {
  group.each.setup(() => {
    new Ioc().reconstruct()
  })

  test('should be able to execute boot and register methods', async ({ assert }) => {
    new HelpersProvider().register()

    assert.isDefined(ioc.use('Helpers/StringFn'))

    new HelpersProvider().boot()

    assert.isDefined(ioc.use('Helpers/NumberFn'))
  })

  test('should be able to create custom service providers using default bindings attribute', async ({ assert }) => {
    new HelpersProvider().registerAttributes()

    /**
     * Wait 10ms so awilix could register the attributes
     * that are promises. Due to import('...')
     */
    await Exec.sleep(10)

    assert.isDefined(ioc.use('Helpers/UserService'))
    assert.isDefined(ioc.use('Helpers/ClientService'))
    assert.isDefined(ioc.use('Helpers/NewStringHelper'))
  })
})
