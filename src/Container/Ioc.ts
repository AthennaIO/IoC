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
  asValue,
  Resolver,
  asFunction,
  InjectionMode,
  createContainer,
  AwilixContainer,
  RegistrationHash,
  ContainerOptions,
} from 'awilix'

import { String, Options, Is } from '@athenna/common'
import { ProviderFaker } from '#src/Helpers/ProviderFaker'
import { NotFoundDependencyException } from '#src/Exceptions/NotFoundDependencyException'

export class Ioc {
  /**
   * Hold all the dependencies that are fakes. The fake
   * dependencies will never be replaced if its alias exists here.
   */
  public static fakes: string[] = []

  /**
   * The awilix container instance.
   */
  public static container: AwilixContainer

  /**
   * Creates a new instance of IoC.
   */
  public constructor(options?: ContainerOptions) {
    if (Ioc.container) {
      return this
    }

    this.reconstruct(options)
  }

  /**
   * Reconstruct the awilix container and mocks.
   */
  public reconstruct(options?: ContainerOptions): Ioc {
    options = Options.create(options, { injectionMode: InjectionMode.CLASSIC })

    Ioc.fakes = []
    Ioc.container = createContainer(options)

    return this
  }

  /**
   * List all bindings of the Ioc.
   */
  public list(): RegistrationHash {
    return Ioc.container.registrations
  }

  /**
   * Return the registration of the dependency.
   */
  public getRegistration<T = any>(
    alias: string,
  ): Resolver<T> & { hasCamelAlias: boolean } {
    const registration = Ioc.container.getRegistration(alias) as Resolver<T> & {
      hasCamelAlias: boolean
    }

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
   */
  public use<T = any>(alias: string): T {
    return Ioc.container.resolve(alias, { allowUnregistered: true })
  }

  /**
   * Resolve a service provider from the container or
   * throws exception if not found.
   */
  public safeUse<T = any>(alias: string): T {
    if (!this.hasDependency(alias)) {
      throw new NotFoundDependencyException(alias)
    }

    return Ioc.container.resolve<T>(alias)
  }

  /**
   * Register and alias to other dependency alias of the
   * container.
   */
  public alias(alias: string, dependencyAlias: string): Ioc {
    if (!this.hasDependency(dependencyAlias)) {
      throw new NotFoundDependencyException(dependencyAlias)
    }

    Ioc.container.register(alias, aliasTo(dependencyAlias))

    return this
  }

  /**
   * Bind a transient dependency to the container.
   * Transient dependencies will always resolve a new
   * instance of it everytime you (or Athenna internally)
   * call ".use" or ".safeUse" method.
   */
  public bind(alias: string, dependency: any, createCamelAlias = true): Ioc {
    this.register(alias, dependency, { type: 'transient', createCamelAlias })

    return this
  }

  /**
   * Bind a transient dependency to the container.
   * Transient dependencies will always resolve a new
   * instance of it everytime you (or Athenna internally)
   * call ".use" or ".safeUse" method.
   */
  public transient(
    alias: string,
    dependency: any,
    createCamelAlias = true,
  ): Ioc {
    this.register(alias, dependency, { type: 'transient', createCamelAlias })

    return this
  }

  /**
   * Bind a scoped dependency to the container.
   */
  public scoped(alias: string, dependency: any, createCamelAlias = true): Ioc {
    this.register(alias, dependency, { type: 'scoped', createCamelAlias })

    return this
  }

  /**
   * Bind an instance dependency to the container.
   * Instance dependencies have the same behavior of
   * singleton dependencies, but you will have more control
   * on how you want to create your dependency constructor.
   */
  public instance(
    alias: string,
    dependency: any,
    createCamelAlias = true,
  ): Ioc {
    this.register(alias, dependency, { type: 'singleton', createCamelAlias })

    return this
  }

  /**
   * Bind a singleton dependency to the container.
   * Singleton dependencies will always resolve the same
   * instance of it everytime you (or Athenna internally)
   * call ".use" or ".safeUse" method.
   */
  public singleton(
    alias: string,
    dependency: any,
    createCamelAlias = true,
  ): Ioc {
    this.register(alias, dependency, { type: 'singleton', createCamelAlias })

    return this
  }

  /**
   * Bind a fake dependency to the container.
   * Fake dependencies will not let the container
   * register the dependencies until you call ".unfake"
   * method.
   */
  public fake(alias: string, dependency: any, createCamelAlias = true): Ioc {
    this.register(alias, dependency, { type: 'singleton', createCamelAlias })

    Ioc.fakes.push(alias)

    return this
  }

  /**
   * Remove the fake dependency from fakes map.
   */
  public unfake(alias: string): Ioc {
    const index = Ioc.fakes.indexOf(alias)

    if (index > -1) {
      Ioc.fakes.splice(index, 1)
    }

    return this
  }

  /**
   * Remove all fake dependencies from fakes map.
   */
  public clearAllFakes(): Ioc {
    Ioc.fakes = []

    return this
  }

  /**
   * Verify if dependency alias is fake or not.
   */
  public isFaked(alias: string): boolean {
    return Ioc.fakes.includes(alias)
  }

  /**
   * Register a fake method to the dependency.
   */
  public fakeMethod(alias: string, method: string, returnValue: any): Ioc {
    ProviderFaker.fakeMethod(alias, method, returnValue)

    return this
  }

  /**
   * Restore the dependency method to the default state.
   */
  public restoreMethod(alias: string, method: string): Ioc {
    ProviderFaker.restoreMethod(alias, method)

    return this
  }

  /**
   * Restore all the dependency methods to the default state.
   */
  public restoreAllMethods(alias: string): Ioc {
    ProviderFaker.restoreAllMethods(alias)

    return this
  }

  /**
   * Verify if the container has the dependency or not.
   */
  public hasDependency(alias: string): boolean {
    return Ioc.container.hasRegistration(alias)
  }

  /**
   * Get the Awilix binder based on the type of the
   * dependency.
   */
  private getAwilixBinder(
    type: 'transient' | 'scoped' | 'singleton',
    dependency: any,
  ): any {
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
   */
  private register(
    alias: string,
    dependency: any,
    options: {
      type?: 'transient' | 'scoped' | 'singleton'
      createCamelAlias?: boolean
    },
  ): void {
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
      const binder = this.getAwilixBinder(options.type, dep)

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
