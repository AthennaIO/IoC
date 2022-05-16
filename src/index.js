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
   * Hold all the dependencies that are mocked. The mocked
   * dependencies will never be replaced if its alias exists here.
   *
   * @type {string[]}
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

    Ioc.mocks = []
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
   * Bind a mock dependency to the container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  mock(alias, dependency, createCamelAlias = true) {
    this.#register(alias, dependency, { type: 'singleton', createCamelAlias })

    Ioc.mocks.push(alias)

    return this
  }

  /**
   * Remove the mock from mocks property.
   *
   * @param {string} alias
   * @return {Ioc}
   */
  unmock(alias) {
    const index = Ioc.mocks.indexOf(alias)

    if (index > -1) {
      Ioc.mocks.splice(index, 1)
    }

    return this
  }

  /**
   * Remove all mocks from mocks property.
   *
   * @return {Ioc}
   */
  clearAllMocks() {
    Ioc.mocks = []

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
   * Verify if alias is mocked.
   *
   * @param {string} alias
   * @return {boolean}
   */
  #isMocked(alias) {
    return !!Ioc.mocks.find(mockAlias => alias === mockAlias)
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
    if (this.#isMocked(alias)) {
      return
    }

    options = Options.create(options, {
      type: 'transient',
      createCamelAlias: true,
    })

    /**
     * Saving the logic inside the function to reuse the code
     * for promises and no promises dependencies.
     */
    const register = dep => {
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
