/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc, Inject } from '#src'
import { Exec } from '@athenna/common'
import { InjectService } from '#tests/Stubs/InjectService'
import { BeforeEach, Test, TestContext } from '@athenna/test'
import { HelpersProvider } from '#tests/Stubs/HelpersProvider'
import { NotFoundDependencyException } from '#src/Exceptions/NotFoundDependencyException'

export default class InjectDecoratorTest {
  @BeforeEach()
  public async beforeEach() {
    new Ioc().reconstruct()

    new HelpersProvider().registerAttributes()

    /**
     * Wait 10ms so awilix could register the attributes
     * that are promises. Due to import('...')
     */
    await Exec.sleep(10)
  }

  @Test()
  public async shouldBeAbleToResolveDependenciesUsingTheInjectAnnotation({ assert }: TestContext) {
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
  }

  @Test()
  public async shouldBeAbleToResolveDependenciesAliasUsingTheInjectAnnotation({ assert }: TestContext) {
    const injectService = ioc.use<InjectService>('Helpers/InjectService')

    assert.deepEqual(injectService.findOneUser(), {
      id: 1,
      name: 'João',
      clients: [
        { id: 1, name: 'LinkApi' },
        { id: 2, name: 'Semantix' },
      ],
    })
  }

  @Test()
  public async shouldThrowExceptionWhenTryingToResolveADependencyThatDoesNotExist({ assert }: TestContext) {
    class Test {
      @Inject('NotFound/Alias')
      public notFound: any
    }

    assert.throws(() => new Test().notFound.value, NotFoundDependencyException)
  }
}
