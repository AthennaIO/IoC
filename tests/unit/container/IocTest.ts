/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exec, Module } from '@athenna/common'
import { Test, type Context } from '@athenna/test'
import { BaseTest } from '#tests/helpers/BaseTest'
import { UserService } from '#tests/stubs/UserService'
import { ClientService } from '#tests/stubs/ClientService'
import { ClientServiceMock } from '#tests/stubs/ClientServiceMock'
import { NotFoundDependencyException } from '#src/exceptions/NotFoundDependencyException'

export default class IocTest extends BaseTest {
  @Test()
  public async shouldBeAbleToRegisterTransientDependenciesInsideTheContainer({ assert }: Context) {
    container.transient('Services/ClientService', ClientService)

    const clientServiceOne = container.safeUse<ClientService>('Services/ClientService')
    const clientServiceTwo = container.safeUse<ClientService>('Services/ClientService')

    assert.notDeepEqual(clientServiceOne, clientServiceTwo)
    assert.notDeepEqual(clientServiceOne.getSignature(), clientServiceTwo.getSignature())
  }

  @Test()
  public async shouldBeAbleToRegisterSingletonDependenciesInsideTheContainer({ assert }: Context) {
    container.singleton('Services/ClientService', ClientService)

    const clientServiceOne = container.safeUse<ClientService>('Services/ClientService')
    const clientServiceTwo = container.safeUse<ClientService>('Services/ClientService')

    assert.deepEqual(clientServiceOne, clientServiceTwo)
    assert.deepEqual(clientServiceOne.getSignature(), clientServiceTwo.getSignature())
  }

  @Test()
  public async shouldBeAbleToUseBindMethodToRegisterTransientDependenciesInsideTheContainer({ assert }: Context) {
    container.transient('Services/ClientService', ClientService)

    const clientServiceOne = container.safeUse<ClientService>('Services/ClientService')
    const clientServiceTwo = container.safeUse<ClientService>('Services/ClientService')

    assert.notDeepEqual(clientServiceOne, clientServiceTwo)
    assert.notDeepEqual(clientServiceOne.getSignature(), clientServiceTwo.getSignature())
  }

  @Test()
  public async shouldBeAbleToListDependenciesOfTheContainer({ assert }: Context) {
    container.transient('Services/UserService', UserService)
    container.singleton('Services/ClientService', ClientService)

    const dependencies = container.list()

    assert.isObject(dependencies)
    assert.lengthOf(Object.keys(dependencies), 4)
  }

  @Test()
  public async shouldBeAbleToGetTheRegistrationObjectOfTheDependency({ assert }: Context) {
    container.bind('Services/UserService', UserService)

    const registration = container.getRegistration('Services/UserService')

    assert.deepEqual(registration.lifetime, 'TRANSIENT')
    assert.deepEqual(registration.hasCamelAlias, true)
  }

  @Test()
  public async shouldCreateAnAliasForTheAlias({ assert }: Context) {
    container.singleton('Services/ClientService', ClientService)
    container.singleton('Services/UserService', UserService)

    const userService = container.safeUse('userService')

    assert.lengthOf(userService.find(), 3)
  }

  @Test()
  public async shouldBeAbleToOverrideDependencies({ assert }: Context) {
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
  public async shouldBeAbleToUseOtherProvidersInsideServices({ assert }: Context) {
    container.singleton('Services/ClientService', ClientService)
    container.singleton('Services/UserService', UserService)

    const userService = container.safeUse('userService')

    assert.lengthOf(userService.find(), 3)
    assert.lengthOf(userService.find()[0].clients, 2)
  }

  @Test()
  public async shouldBeAbleToCreateAliasFromOtherProvidersInTheIoc({ assert }: Context) {
    container
      .singleton('Services/ClientService', ClientService)
      .alias('Services/Aliases/ClientService', 'Services/ClientService')

    const clientService = container.safeUse('Services/Aliases/ClientService')

    assert.lengthOf(clientService.find(), 2)
  }

  @Test()
  public async shouldReturnUndefinedWhenTheDependencyDoesNotExist({ assert }: Context) {
    const clientService = container.use('Services/ClientService')

    assert.isUndefined(clientService)
  }

  @Test()
  public async shouldThrowAnErrorWhenTryingToUseADependencyThatDoesNotExist({ assert }: Context) {
    container.singleton('Services/ClientService', ClientService)

    const useCase = () => container.safeUse('Services/Aliases/ClientService')

    assert.throws(useCase, NotFoundDependencyException)
  }

  @Test()
  public async shouldBeAbleToCreateFakeInsideTheContainer({ assert }: Context) {
    container.fake('Services/ClientService', ClientServiceMock)
    container.singleton('Services/ClientService', ClientService) // This call will not replace ClientServiceMock.

    const clientService = container.safeUse('Services/ClientService')

    assert.lengthOf(clientService.find(), 2)
    assert.deepEqual(clientService.find()[0], { id: 1, name: 'Mock' })
  }

  @Test()
  public async shouldBeAbleToClearTheFakeDependenciesFromTheContainer({ assert }: Context) {
    container.fake('Services/ClientService', ClientServiceMock)
    container.unfake('Services/ClientService')
    container.singleton('Services/ClientService', ClientService) // This call will replace ClientServiceMock.

    const clientService = container.safeUse('Services/ClientService')

    assert.lengthOf(clientService.find(), 2)
    assert.deepEqual(clientService.find()[0], { id: 1, name: 'LinkApi' })
  }

  @Test()
  public async shouldBeAbleToClearAllTheFakeDependenciesFromTheContainer({ assert }: Context) {
    container.fake('Services/ClientService', ClientServiceMock)
    container.clearAllFakes()
    container.singleton('Services/ClientService', ClientService) // This call will replace ClientServiceMock.

    const clientService = container.safeUse('Services/ClientService')

    assert.lengthOf(clientService.find(), 2)
    assert.deepEqual(clientService.find()[0], { id: 1, name: 'LinkApi' })
  }

  @Test()
  public async shouldThrowANotFoundDependencyExceptionWhenAliasDoesntExist({ assert }: Context) {
    const useCase = () => container.alias('Alias', 'OtherAlias')

    assert.throws(useCase, NotFoundDependencyException)
  }

  @Test()
  public async shouldBeAbleToRegisterDependenciesAsPromises({ assert }: Context) {
    container.transient('Services/ClientService', Module.get(import('#tests/stubs/ClientService')))

    await Exec.sleep(10)

    const clientService = container.safeUse<ClientService>('Services/ClientService')

    assert.deepEqual(clientService.find(), [
      { id: 1, name: 'LinkApi' },
      { id: 2, name: 'Semantix' },
    ])
  }
}
