/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src'
import { UserService } from '#tests/Stubs/UserService'
import { ClientService } from '#tests/Stubs/ClientService'
import { Test, BeforeEach, TestContext } from '@athenna/test'
import { ClientServiceMock } from '#tests/Stubs/ClientServiceMock'
import { NotFoundDependencyException } from '#src/Exceptions/NotFoundDependencyException'

export default class IocTest {
  @BeforeEach()
  public async beforeEach() {
    new Ioc().reconstruct()
  }

  @Test()
  public async shouldBeAbleToBindDependenciesInsideTheContainerAndUseThen({ assert }: TestContext) {
    container.bind('Services/UserService', UserService)
    container.singleton('Services/ClientService', ClientService)

    const userService = container.safeUse('Services/UserService')

    assert.lengthOf(userService.find(), 3)
  }

  @Test()
  public async shouldBeAbleToListDependenciesOfTheContainer({ assert }: TestContext) {
    container.transient('Services/UserService', UserService)
    container.singleton('Services/ClientService', ClientService)

    const dependencies = container.list()

    assert.isObject(dependencies)
    assert.lengthOf(Object.keys(dependencies), 4)
  }

  @Test()
  public async shouldBeAbleToGetTheRegistrationObjectOfTheDependency({ assert }: TestContext) {
    container.bind('Services/UserService', UserService)

    const registration = container.getRegistration('Services/UserService')

    assert.deepEqual(registration.lifetime, 'TRANSIENT')
    assert.deepEqual(registration.hasCamelAlias, true)
  }

  @Test()
  public async shouldCreateAnAliasForTheAlias({ assert }: TestContext) {
    container.singleton('Services/ClientService', ClientService)
    container.singleton('Services/UserService', UserService)

    const userService = container.safeUse('userService')

    assert.lengthOf(userService.find(), 3)
  }

  @Test()
  public async shouldBeAbleToOverrideDependencies({ assert }: TestContext) {
    container.singleton('Services/ClientService', ClientService)
    container.singleton('Services/UserService', UserService)
    container.singleton('Services/UserService', ClientService)

    const clientService = container.safeUse('Services/UserService')

    assert.deepEqual(clientService.find(), [
      { id: 1, name: 'LinkApi' },
      { id: 2, name: 'Semantix' },
    ])

    const clientServiceCamelAlias = container.safeUse('userService')

    assert.deepEqual(clientServiceCamelAlias.find(), [
      { id: 1, name: 'LinkApi' },
      { id: 2, name: 'Semantix' },
    ])
  }

  @Test()
  public async shouldBeAbleToUseOtherProvidersInsideServices({ assert }: TestContext) {
    container.singleton('Services/ClientService', ClientService)
    container.singleton('Services/UserService', UserService)

    const userService = container.safeUse('userService')

    assert.lengthOf(userService.find(), 3)
    assert.lengthOf(userService.find()[0].clients, 2)
  }

  @Test()
  public async shouldBeAbleToCreateAliasFromOtherProvidersInTheIoc({ assert }: TestContext) {
    container
      .singleton('Services/ClientService', ClientService)
      .alias('Services/Aliases/ClientService', 'Services/ClientService')

    const clientService = container.safeUse('Services/Aliases/ClientService')

    assert.lengthOf(clientService.find(), 2)
  }

  @Test()
  public async shouldReturnUndefinedWhenTheDependencyDoesNotExist({ assert }: TestContext) {
    const clientService = container.use('Services/ClientService')

    assert.isUndefined(clientService)
  }

  @Test()
  public async shouldThrowAnErrorWhenTryingToUseADependencyThatDoesNotExist({ assert }: TestContext) {
    container.singleton('Services/ClientService', ClientService)

    const useCase = () => container.safeUse('Services/Aliases/ClientService')

    assert.throws(useCase, NotFoundDependencyException)
  }

  @Test()
  public async shouldBeAbleToCreateMockInsideTheContainer({ assert }: TestContext) {
    container.fake('Services/ClientService', ClientServiceMock)
    container.singleton('Services/ClientService', ClientService) // This call will not replace ClientServiceMock.

    const clientService = container.safeUse('Services/ClientService')

    assert.lengthOf(clientService.find(), 2)
    assert.deepEqual(clientService.find()[0], { id: 1, name: 'Mock' })
  }

  @Test()
  public async shouldBeAbleToClearTheMocksFromTheContainer({ assert }: TestContext) {
    container.fake('Services/ClientService', ClientServiceMock)
    container.unfake('Services/ClientService')
    container.singleton('Services/ClientService', ClientService) // This call will replace ClientServiceMock.

    const clientService = container.safeUse('Services/ClientService')

    assert.lengthOf(clientService.find(), 2)
    assert.deepEqual(clientService.find()[0], { id: 1, name: 'LinkApi' })
  }

  @Test()
  public async shouldThrowANotFoundDependencyExceptionWhenAliasDoesntExist({ assert }: TestContext) {
    const useCase = () => container.alias('Alias', 'OtherAlias')

    assert.throws(useCase, NotFoundDependencyException)
  }
}
