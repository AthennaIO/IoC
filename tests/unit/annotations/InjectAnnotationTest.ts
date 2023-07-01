/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Inject } from '#src'
import { Test } from '@athenna/test'
import { BaseTest } from '#tests/helpers/BaseTest'
import type { Context } from '@athenna/test/types'
import type { InjectService } from '#tests/stubs/InjectService'
import { MissingServiceAnnotationException } from '#src/exceptions/MissingServiceAnnotationException'
import { NotFoundDependencyException } from '#src/exceptions/NotFoundDependencyException'

export default class InjectAnnotationTest extends BaseTest {
  @Test()
  public async shouldBeAbleToResolveDependenciesUsingTheInjectAnnotation({ assert }: Context) {
    await this.import('#tests/stubs/ClientService')
    await this.import('#tests/stubs/UserService')
    await this.import('#tests/stubs/InjectService')

    const injectService = ioc.use<InjectService>('injectService')

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
  public async shouldBeAbleToResolveDependenciesAliasUsingTheInjectAnnotation({ assert }: Context) {
    await this.import('#tests/stubs/ClientService')
    await this.import('#tests/stubs/UserService')
    await this.import('#tests/stubs/InjectService')

    const injectService = ioc.use<InjectService>('injectService')

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
  public async shouldThrowExceptionWhenTryingToResolveADependencyThatDoesNotExist({ assert }: Context) {
    assert.throws(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Inject('NotFound/Alias')
        public notFound: any
      }
    }, NotFoundDependencyException)
  }

  @Test()
  public async shouldThrowExceptionWhenTryingToResolveADependencyThatDoesNotHaveServiceAnnotationPresent({
    assert,
  }: Context) {
    ioc.singleton('missingAnnotationService', () => 'hello')

    assert.throws(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class Test {
        @Inject()
        public missingAnnotationService: any
      }
    }, MissingServiceAnnotationException)
  }
}