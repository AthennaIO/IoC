/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {
  aliasTo,
  asClass,
  asFunction,
  asValue,
  createContainer,
  InjectionMode,
} from 'awilix'

import { Is, Options, String } from '@secjs/utils'
import { NotFoundDependencyException } from '#src/Exceptions/NotFoundDependencyException'

export * from './Facades/Facade.js'
export * from './Providers/ServiceProvider.js'

export class Ioc {
  /**
   * Dependencies that needs to be mocked when calling
   * one of the registration methods.
   *
   * @type {{alias: string, dependency: any}[]}
   */
  static mocks = []

  /**
   * The awilix container instance.
   *
   * @type {import('awilix').AwilixContainer<any>}
   */
  static container

  /**
   * Creates a new instance of IoC.
   *
   * @param {import('awilix').ContainerOptions} [options]
   * @return {Ioc}
   */
  constructor(options) {
    if (Ioc.container) return this

    this.reconstruct(options)
  }

  /**
   * Reconstruct the awilix container and mocks.
   *
   * @param {import('awilix').ContainerOptions} [options]
   * @return {Ioc}
   */
  reconstruct(options) {
    options = Options.create(options, { injectionMode: InjectionMode.CLASSIC })

    Ioc.container = createContainer(options)

    return this
  }

  /**
   * List all bindings of the Ioc.
   *
   * @return {import('awilix').RegistrationHash}
   */
  list() {
    return Ioc.container.registrations
  }

  /**
   * Resolve a service provider from the container or
   * returns undefined if not found.
   *
   * @param {string} alias
   * @return {any|undefined}
   */
  use(alias) {
    return Ioc.container.resolve(alias, { allowUnregistered: true })
  }

  /**
   * Resolve a service provider from the container or
   * throws exception if not found.
   *
   * @param {string} alias
   * @return {any}
   */
  safeUse(alias) {
    if (!this.hasDependency(alias)) {
      throw new NotFoundDependencyException(alias)
    }

    return Ioc.container.resolve(alias)
  }

  /**
   * Register and alias to other dependency alias of the
   * container.
   *
   * @param {string} alias
   * @param {string} dependencyAlias
   * @return {Ioc}
   */
  alias(alias, dependencyAlias) {
    if (!this.hasDependency(dependencyAlias)) {
      throw new NotFoundDependencyException(dependencyAlias)
    }

    Ioc.container.register(alias, aliasTo(dependencyAlias))

    return this
  }

  /**
   * Bind a transient dependency to the container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  bind(alias, dependency, createCamelAlias = true) {
    this.#register(alias, dependency, { type: 'transient', createCamelAlias })

    return this
  }

  /**
   * Bind an instance dependency to the container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  instance(alias, dependency, createCamelAlias = true) {
    this.#register(alias, dependency, { type: 'singleton', createCamelAlias })

    return this
  }

  /**
   * Saves a mock to be used in the place of mock alias.
   *
   * @param {string} alias
   * @param {any} dependency
   * @return {Ioc}
   */
  mock(alias, dependency) {
    Ioc.mocks.push({ alias, dependency })

    return this
  }

  /**
   * Bind a singleton dependency to the container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  singleton(alias, dependency, createCamelAlias = true) {
    this.#register(alias, dependency, { type: 'singleton', createCamelAlias })

    return this
  }

  /**
   * Verify if the container has the dependency or not.
   *
   * @param {string} alias
   * @return {boolean}
   */
  hasDependency(alias) {
    return Ioc.container.hasRegistration(alias)
  }

  /**
   * Get the Awilix binder based on the type of the
   * dependency.
   *
   * @param {"transient"|"scoped"|"singleton"} type
   * @param {any} dependency
   * @return {any}
   */
  #getAwilixBinder(type, dependency) {
    if (Is.Class(dependency)) {
      return asClass(dependency)[type]()
    }

    if (Is.Function(dependency)) {
      return asFunction(dependency)[type]()
    }

    return asValue(dependency)
  }

  /**
   * Get the mocked dependency if it exists.
   *
   * @param {string} alias
   * @param {any} dependency
   * @return {any}
   */
  #getMockIfExists(alias, dependency) {
    const mock = Ioc.mocks.find(mock => mock.alias === alias)

    if (!mock) {
      return dependency
    }

    return mock.dependency
  }

  /**
   * Register the binder in the Awilix container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {{ type?: string, createCamelAlias?: boolean }} options
   * @return {void}
   */
  #register(alias, dependency, options) {
    options = Options.create(options, {
      type: 'transient',
      createCamelAlias: true,
    })

    const register = dep => {
      dep = this.#getMockIfExists(alias, dep)
      const binder = this.#getAwilixBinder(options.type, dep)

      Ioc.container.register(alias, binder)

      if (alias.includes('/') && options.createCamelAlias) {
        const aliasOfAlias = alias.split('/').pop()

        this.alias(String.toCamelCase(aliasOfAlias), alias)
      }
    }

    if (dependency.then) {
      dependency.then(dep => register(dep))

      return
    }

    register(dependency)
  }
}

if (!global.ioc) {
  global.ioc = new Ioc()
}
