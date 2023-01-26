/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { Ioc } from '#src/index'
import { Exec } from '@athenna/common'
import { HelpersProvider } from '#tests/Stubs/HelpersProvider'
import { DecoratedService } from '../Stubs/DecoratedService.js'
import { Inject } from '../../src/Decorators/Inject.js'
import { NotFoundDependencyException } from '../../src/Exceptions/NotFoundDependencyException.js'

test.group('InjectTest', group => {
  group.each.setup(async () => {
    new Ioc().reconstruct()

    new HelpersProvider().registerAttributes()

    /**
     * Wait 10ms so awilix could register the attributes
     * that are promises. Due to import('...')
     */
    await Exec.sleep(10)
  })

  test('should be able to resolve dependencies using the inject annotation', async ({ assert }) => {
    const decoratedService = ioc.use<DecoratedService>('Helpers/DecoratedService')

    assert.deepEqual(decoratedService.findClients(), [
      {
        id: 1,
        name: 'LinkApi',
      },
      {
        id: 2,
        name: 'Semantix',
      },
    ])
  })

  test('should be able to resolve dependencies alias using the inject annotation', async ({ assert }) => {
    const decoratedService = ioc.use<DecoratedService>('Helpers/DecoratedService')

    assert.deepEqual(decoratedService.findOneUser(), {
      id: 1,
      name: 'João',
      clients: [
        { id: 1, name: 'LinkApi' },
        { id: 2, name: 'Semantix' },
      ],
    })
  })

  test('should throw exception when trying to resolve a dependency that does not exist', async ({ assert }) => {
    assert.throws(() => {
      class _Test {
        @Inject('NotFound/Alias')
        private _notFound: any
      }
    }, NotFoundDependencyException)
  })
})
