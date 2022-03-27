/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '../../src/Ioc'
import { UserService } from '../Stubs/UserService'
import { ClientService } from '../Stubs/ClientService'

describe('\n IocTest', () => {
  let ioc = new Ioc()

  beforeEach(() => (ioc = new Ioc().reconstruct()))

  it('should be able to bind dependencies inside the container and use then', async () => {
    ioc.singleton('Services/ClientService', ClientService)
    ioc.bind('Services/UserService', UserService)

    const userService = ioc.safeUse<UserService>('Services/UserService')

    expect(userService.find()).toHaveLength(3)
  })

  it('should create an alias for the alias', async () => {
    ioc.singleton('Services/ClientService', ClientService)
    ioc.singleton('Services/UserService', UserService)

    const userService = ioc.safeUse<UserService>('userService')

    expect(userService.find()).toHaveLength(3)
  })

  it('should throw a dependency already exists exception', async () => {
    ioc.singleton('Services/ClientService', ClientService)
    ioc.singleton('Services/UserService', UserService)

    try {
      ioc.singleton('Services/UserService', UserService)
    } catch (error) {
      expect(error.name).toBe('DependencyAlreadyExistsException')
      expect(error.status).toBe(500)
      expect(error.content).toBe(`The alias Services/UserService is already in use inside the container`)
    }

    try {
      ioc.singleton('userService', UserService)
    } catch (error) {
      expect(error.name).toBe('DependencyAlreadyExistsException')
      expect(error.status).toBe(500)
      expect(error.content).toBe(`The alias userService is already in use inside the container`)
    }

    try {
      ioc.singleton('Addons/Services/UserService', UserService)
    } catch (error) {
      expect(error.name).toBe('DependencyAlreadyExistsException')
      expect(error.status).toBe(500)
      expect(error.content).toBe(`The alias userService is already in use inside the container`)
    }
  })

  it('should be able to use other providers inside services', async () => {
    ioc.singleton('Services/ClientService', ClientService)
    ioc.singleton('Services/UserService', UserService)

    const userService = ioc.safeUse<UserService>('userService')

    expect(userService.find()).toHaveLength(3)
    expect(userService.find()[0].clients).toHaveLength(2)
  })

  it('should be able to create alias from other providers in the Ioc', async () => {
    ioc
      .singleton('Services/ClientService', ClientService)
      .alias('Services/Aliases/ClientService', 'Services/ClientService')

    const clientService = ioc.safeUse<ClientService>('Services/Aliases/ClientService')

    expect(clientService.find()).toHaveLength(2)
    expect(clientService.find()[0]).toStrictEqual({ id: 1, name: 'LinkApi' })
  })

  it('should return undefined when the dependency does not exist', async () => {
    const clientService = ioc.use('Services/ClientService')

    expect(clientService).toBeFalsy()
  })

  it('should throw an error when trying to use a dependency that does not exist', async () => {
    ioc.singleton('Services/ClientService', ClientService)

    try {
      ioc.safeUse<ClientService>('Services/Aliases/ClientService')
    } catch (error) {
      expect(error.name).toBe('NotFoundDependencyException')
      expect(error.content).toBe(
        'The dependency alias Services/Aliases/ClientService has not been found inside the container',
      )
    }
  })
})
