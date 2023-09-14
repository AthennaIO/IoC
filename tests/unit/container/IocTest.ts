/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exec, Module } from '@athenna/common'
import { BaseTest } from '#tests/helpers/BaseTest'
import { Test, type Context } from '@athenna/test'
import { UserService } from '#tests/fixtures/UserService'
import { ClientService } from '#tests/fixtures/ClientService'
import { ClientServiceMock } from '#tests/fixtures/ClientServiceMock'
import { NotFoundServiceException } from '#src/exceptions/NotFoundServiceException'

export default class IocTest extends BaseTest {
  @Test()
  public async shouldBeAbleToRegisterTransientServicesInsideTheContainer({ assert }: Context) {
    container.transient('Services/ClientService', ClientService)

    const clientServiceOne = container.safeUse<ClientService>('Services/ClientService')
    const clientServiceTwo = container.safeUse<ClientService>('Services/ClientService')

    assert.notDeepEqual(clientServiceOne, clientServiceTwo)
    assert.notDeepEqual(clientServiceOne.getSignature(), clientServiceTwo.getSignature())
  }

  @Test()
  public async shouldBeAbleToRegisterSingletonServicesInsideTheContainer({ assert }: Context) {
    container.singleton('Services/ClientService', ClientService)

    const clientServiceOne = container.safeUse<ClientService>('Services/ClientService')
    const clientServiceTwo = container.safeUse<ClientService>('Services/ClientService')

    assert.deepEqual(clientServiceOne, clientServiceTwo)
    assert.deepEqual(clientServiceOne.getSignature(), clientServiceTwo.getSignature())
  }

  @Test()
  public async shouldBeAbleToUseBindMethodToRegisterTransientServicesInsideTheContainer({ assert }: Context) {
    container.transient('Services/ClientService', ClientService)

    const clientServiceOne = container.safeUse<ClientService>('Services/ClientService')
    const clientServiceTwo = container.safeUse<ClientService>('Services/ClientService')

    assert.notDeepEqual(clientServiceOne, clientServiceTwo)
    assert.notDeepEqual(clientServiceOne.getSignature(), clientServiceTwo.getSignature())
  }

  @Test()
  public async shouldBeAbleToListServicesOfTheContainer({ assert }: Context) {
    container.transient('Services/UserService', UserService)
    container.singleton('Services/ClientService', ClientService)

    const dependencies = container.list()

    assert.isObject(dependencies)
    assert.lengthOf(Object.keys(dependencies), 2)
  }

  @Test()
  public async shouldBeAbleToGetTheRegistrationObjectOfTheService({ assert }: Context) {
    container.bind('Services/UserService', UserService)

    const registration = container.getRegistration('Services/UserService')

    assert.deepEqual(registration.lifetime, 'TRANSIENT')
  }

  @Test()
  public async shouldCreateAnAliasForTheAlias({ assert }: Context) {
    container.singleton('Services/ClientService', ClientService).alias('clientService', 'Services/ClientService')
    container.singleton('Services/UserService', UserService).alias('userService', 'Services/UserService')

    const userService = container.safeUse('userService')

    assert.lengthOf(userService.find(), 3)
  }

  @Test()
  public async shouldBeAbleToOverrideServicesAndItSubAliases({ assert }: Context) {
    container.singleton('Services/ClientService', ClientService)
    container.singleton('Services/UserService', UserService).alias('userService', 'Services/UserService')
    container.singleton('Services/UserService', ClientService)

    const clientService = container.safeUse('Services/UserService')

    assert.deepEqual(clientService.find(), [
      { id: 1, name: 'LinkApi' },
      { id: 2, name: 'Semantix' }
    ])

    const clientServiceCamelAlias = container.safeUse('userService')

    assert.deepEqual(clientServiceCamelAlias.find(), [
      { id: 1, name: 'LinkApi' },
      { id: 2, name: 'Semantix' }
    ])
  }

  @Test()
  public async shouldBeAbleToUseOtherServicesInsideServices({ assert }: Context) {
    container.singleton('Services/ClientService', ClientService).alias('clientService', 'Services/ClientService')
    container.singleton('Services/UserService', UserService).alias('userService', 'Services/UserService')

    const userService = container.safeUse('userService')

    assert.lengthOf(userService.find(), 3)
    assert.lengthOf(userService.find()[0].clients, 2)
  }

  @Test()
  public async shouldBeAbleToCreateAliasFromOtherServicesInTheIoc({ assert }: Context) {
    container
      .singleton('Services/ClientService', ClientService)
      .alias('Services/Aliases/ClientService', 'Services/ClientService')

    const clientService = container.safeUse('Services/Aliases/ClientService')

    assert.lengthOf(clientService.find(), 2)
  }

  @Test()
  public async shouldReturnUndefinedWhenTheServiceDoesNotExist({ assert }: Context) {
    const clientService = container.use('Services/ClientService')

    assert.isUndefined(clientService)
  }

  @Test()
  public async shouldThrowAnErrorWhenTryingToUseAServiceThatDoesNotExist({ assert }: Context) {
    container.singleton('Services/ClientService', ClientService)

    const useCase = () => container.safeUse('Services/Aliases/ClientService')

    assert.throws(useCase, NotFoundServiceException)
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
  public async shouldBeAbleToClearTheFakeServicesFromTheContainer({ assert }: Context) {
    container.fake('Services/ClientService', ClientServiceMock)
    container.unfake('Services/ClientService')
    container.singleton('Services/ClientService', ClientService) // This call will replace ClientServiceMock.

    const clientService = container.safeUse('Services/ClientService')

    assert.lengthOf(clientService.find(), 2)
    assert.deepEqual(clientService.find()[0], { id: 1, name: 'LinkApi' })
  }

  @Test()
  public async shouldBeAbleToClearAllTheFakeServicesFromTheContainer({ assert }: Context) {
    container.fake('Services/ClientService', ClientServiceMock)
    container.clearAllFakes()
    container.singleton('Services/ClientService', ClientService) // This call will replace ClientServiceMock.

    const clientService = container.safeUse('Services/ClientService')

    assert.lengthOf(clientService.find(), 2)
    assert.deepEqual(clientService.find()[0], { id: 1, name: 'LinkApi' })
  }

  @Test()
  public async shouldThrowANotFoundServiceExceptionWhenAliasDoesntExist({ assert }: Context) {
    const useCase = () => container.alias('Alias', 'OtherAlias')

    assert.throws(useCase, NotFoundServiceException)
  }

  @Test()
  public async shouldBeAbleToRegisterServicesAsPromises({ assert }: Context) {
    container.transient('Services/ClientService', Module.get(import('#tests/fixtures/ClientService')))

    await Exec.sleep(10)

    const clientService = container.safeUse<ClientService>('Services/ClientService')

    assert.deepEqual(clientService.find(), [
      { id: 1, name: 'LinkApi' },
      { id: 2, name: 'Semantix' }
    ])
  }

  @Test()
  public async shouldBeAbleToRegisterAServiceByPath({ assert }: Context) {
    await container.loadModule(Path.fixtures('StringHelper.ts'))

    assert.isTrue(container.has('stringHelper'))
    assert.isTrue(container.has('App/Services/StringHelper'))
  }

  @Test()
  public async shouldBeAbleToRegisterAnAnnotatedServiceByPath({ assert }: Context) {
    await container.loadModule(Path.fixtures('ClientService.ts'))

    assert.isTrue(container.has('clientService'))
    assert.isTrue(container.has('App/Services/ClientService'))
  }

  @Test()
  public async shouldBeAbleToRegisterMultiplesServicePaths({ assert }: Context) {
    await container.loadModules([Path.fixtures('StringHelper.ts'), Path.fixtures('ClientService.ts')])

    assert.isTrue(container.has('stringHelper'))
    assert.isTrue(container.has('App/Services/StringHelper'))
    assert.isTrue(container.has('clientService'))
    assert.isTrue(container.has('App/Services/ClientService'))
  }
}
