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

import { Is, Options, String } from '@athenna/common'
import { ProviderFaker } from '#src/Helpers/ProviderFaker'
import { NotFoundDependencyException } from '#src/Exceptions/NotFoundDependencyException'

export * from './Facades/Facade.js'
export * from './Providers/ServiceProvider.js'

export class Ioc {
  /**
   * Hold all the dependencies that are fakes. The fake
   * dependencies will never be replaced if its alias exists here.
   *
   * @type {string[]}
   */
  static fakes = []

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

    Ioc.fakes = []
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
   * Return the registration of the dependency.
   *
   * @return {import('awilix').Resolver<any> & { hasCamelAlias: boolean }}
   */
  getRegistration(alias) {
    const registration = Ioc.container.getRegistration(alias)

    registration.hasCamelAlias = false

    if (alias.includes('/')) {
      const aliasOfAlias = alias.split('/').pop()

      if (Ioc.container.hasRegistration(String.toCamelCase(aliasOfAlias))) {
        registration.hasCamelAlias = true
      }
    }

    return registration
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
   * Bind a scoped dependency to the container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  scoped(alias, dependency, createCamelAlias = true) {
    this.#register(alias, dependency, { type: 'scoped', createCamelAlias })

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
   * Bind a fake dependency to the container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  fake(alias, dependency, createCamelAlias = true) {
    this.#register(alias, dependency, { type: 'singleton', createCamelAlias })

    Ioc.fakes.push(alias)

    return this
  }

  /**
   * Remove the fake dependency from fakes map.
   *
   * @param {string} alias
   * @return {Ioc}
   */
  unfake(alias) {
    const index = Ioc.fakes.indexOf(alias)

    if (index > -1) {
      Ioc.fakes.splice(index, 1)
    }

    return this
  }

  /**
   * Remove all fake dependencies from fakes map.
   *
   * @return {Ioc}
   */
  clearAllFakes() {
    Ioc.fakes = []

    return this
  }

  /**
   * Verify if dependency alias is fake or not.
   *
   * @return {boolean}
   */
  isFaked(alias) {
    return Ioc.fakes.includes(alias)
  }

  /**
   * Register a fake method to the dependency.
   *
   * @param {string} alias
   * @param {string} method
   * @param {any} returnValue
   * @return {Ioc}
   */
  fakeMethod(alias, method, returnValue) {
    ProviderFaker.fakeMethod(alias, method, returnValue)

    return this
  }

  /**
   * Restore the dependency method to the default state.
   *
   * @param {string} alias
   * @param {string} method
   * @return {Ioc}
   */
  restoreMethod(alias, method) {
    ProviderFaker.restoreMethod(alias, method)

    return this
  }

  /**
   * Restore all the dependency methods to the default state.
   *
   * @param {string} alias
   * @return {Ioc}
   */
  restoreAllMethods(alias) {
    ProviderFaker.restoreAllMethods(alias)

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
   * Register the binder in the Awilix container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {{ type?: string, createCamelAlias?: boolean }} options
   * @return {void}
   */
  #register(alias, dependency, options) {
    if (this.isFaked(alias)) {
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

    if (dependency && dependency.then) {
      dependency.then(dep => register(dep))

      return
    }

    register(dependency)
  }
}

if (!global.ioc) {
  global.ioc = new Ioc()
}
