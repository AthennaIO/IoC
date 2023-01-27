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
import { Inject } from '#src/Decorators/Inject'
import { InjectService } from '#tests/Stubs/InjectService'
import { HelpersProvider } from '#tests/Stubs/HelpersProvider'
import { NotFoundDependencyException } from '#src/Exceptions/NotFoundDependencyException'

test.group('InjectDecoratorTest', group => {
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
    const injectService = ioc.use<InjectService>('Helpers/InjectService')

    assert.deepEqual(injectService.findClients(), [
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
    const injectService = ioc.use<InjectService>('Helpers/InjectService')

    assert.deepEqual(injectService.findOneUser(), {
      id: 1,
      name: 'João',
      clients: [
        { id: 1, name: 'LinkApi' },
        { id: 2, name: 'Semantix' },
      ],
    })
  })

  test('should throw exception when trying to resolve a dependency that does not exist', async ({ assert }) => {
    class Test {
      @Inject('NotFound/Alias')
      public notFound: any
    }

    assert.throws(() => new Test().notFound.value, NotFoundDependencyException)
  })
})
