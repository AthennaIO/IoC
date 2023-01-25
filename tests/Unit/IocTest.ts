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
import { UserService } from '#tests/Stubs/UserService'
import { ClientService } from '#tests/Stubs/ClientService'
import { ClientServiceMock } from '#tests/Stubs/ClientServiceMock'
import { NotFoundDependencyException } from '#src/Exceptions/NotFoundDependencyException'

test.group('IocTest', group => {
  group.each.setup(async () => {
    new Ioc().reconstruct()
  })

  test('should be able to bind dependencies inside the container and use then', async ({ assert }) => {
    container.bind('Services/UserService', UserService)
    container.singleton('Services/ClientService', ClientService)

    const userService = container.safeUse('Services/UserService')

    assert.lengthOf(userService.find(), 3)
  })

  test('should be able to list dependencies of the container', async ({ assert }) => {
    container.transient('Services/UserService', UserService)
    container.singleton('Services/ClientService', ClientService)

    const dependencies = container.list()

    assert.isObject(dependencies)
    assert.lengthOf(Object.keys(dependencies), 4)
  })

  test('should be able to get the registration object of the dependency', async ({ assert }) => {
    container.bind('Services/UserService', UserService)

    const registration = container.getRegistration('Services/UserService')

    assert.deepEqual(registration.lifetime, 'TRANSIENT')
    assert.deepEqual(registration.hasCamelAlias, true)
  })

  test('should create an alias for the alias', async ({ assert }) => {
    container.singleton('Services/ClientService', ClientService)
    container.singleton('Services/UserService', UserService)

    const userService = container.safeUse('userService')

    assert.lengthOf(userService.find(), 3)
  })

  test('should be able to override dependencies', async ({ assert }) => {
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
  })

  test('should be able to use other providers inside services', async ({ assert }) => {
    container.singleton('Services/ClientService', ClientService)
    container.singleton('Services/UserService', UserService)

    const userService = container.safeUse('userService')

    assert.lengthOf(userService.find(), 3)
    assert.lengthOf(userService.find()[0].clients, 2)
  })

  test('should be able to create alias from other providers in the Ioc', async ({ assert }) => {
    container
      .singleton('Services/ClientService', ClientService)
      .alias('Services/Aliases/ClientService', 'Services/ClientService')

    const clientService = container.safeUse('Services/Aliases/ClientService')

    assert.lengthOf(clientService.find(), 2)
    assert.deepEqual(clientService.find()[0], { id: 1, name: 'LinkApi' })
  })

  test('should return undefined when the dependency does not exist', async ({ assert }) => {
    const clientService = container.use('Services/ClientService')

    assert.isUndefined(clientService)
  })

  test('should throw an error when trying to use a dependency that does not exist', async ({ assert }) => {
    container.singleton('Services/ClientService', ClientService)

    const useCase = () => container.safeUse('Services/Aliases/ClientService')

    assert.throws(useCase, NotFoundDependencyException)
  })

  test('should be able to create mock inside the container', async ({ assert }) => {
    container.fake('Services/ClientService', ClientServiceMock)
    container.singleton('Services/ClientService', ClientService) // This call will not replace ClientServiceMock.

    const clientService = container.safeUse('Services/ClientService')

    assert.lengthOf(clientService.find(), 2)
    assert.deepEqual(clientService.find()[0], { id: 1, name: 'Mock' })
  })

  test('should be able to clear the mocks from the container', async ({ assert }) => {
    container.fake('Services/ClientService', ClientServiceMock)
    container.unfake('Services/ClientService')
    container.singleton('Services/ClientService', ClientService) // This call will replace ClientServiceMock.

    const clientService = container.safeUse('Services/ClientService')

    assert.lengthOf(clientService.find(), 2)
    assert.deepEqual(clientService.find()[0], { id: 1, name: 'LinkApi' })
  })

  test('should throw a not found dependency exception when alias doesnt exist', async ({ assert }) => {
    const useCase = () => container.alias('Alias', 'OtherAlias')

    assert.throws(useCase, NotFoundDependencyException)
  })
})
