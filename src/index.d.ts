/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SinonMock } from 'sinon'

export class Facade {
  /**
   * The container to resolve dependencies.
   *
   * @type {Ioc}
   */
  static container: Ioc

  /**
   * Set the container if it does not exist.
   *
   * @return {typeof Facade}
   */
  static setContainer(): typeof Facade

  /**
   * Create a new Facade for the alias specified
   *
   * @param {string} alias
   * @return {typeof Facade}
   */
  static createFor(alias: string): typeof Facade

  /**
   * Get the facade alias registered to resolve deps
   * from the Ioc.
   *
   * @return {string}
   */
  static getFacadeAlias(): string

  /**
   * Get the facade provider resolved from the Ioc.
   *
   * @return {any}
   */
  static getFacadeProvider(): any

  /**
   * Set a fake return value in the Facade method.
   *
   * @param method {string}
   * @param returnValue {any}
   * @return {typeof Facade}
   */
  static fakeMethod(method: string, returnValue: any): typeof Facade

  /**
   * Restore the mocked method to his default state.
   *
   * @param method {string}
   * @return {typeof Facade}
   */
  static restoreMethod(method: string): typeof Facade

  /**
   * Restore all the mocked methods of this facade to
   * their default state.
   *
   * @return {typeof Facade}
   */
  static restoreAllMethods(): typeof Facade

  /**
   * Return a sinon mock instance of the Facade.
   *
   * @return {SinonMock}
   */
  static getMock(): SinonMock
}

export class ServiceProvider {
  /**
   * All the container bindings that should be registered.
   *
   * @type {Record<string, new (...args: any[]) => any>}
   */
  bindings: Record<string, new (...args: any[]) => any>
  /**
   * All the container instances that should be registered.
   *
   * @type {Record<string, any>}
   */
  instances: Record<string, any>
  /**
   * All the container singletons that should be registered.
   *
   * @type {Record<string, new (...args: any[]) => any>}
   */
  singletons: Record<string, new (...args: any[]) => any>
  /**
   * The ioc container instance
   *
   * @type {Ioc}
   */
  container: Ioc

  /**
   * Set where the type of application where this provider can
   * be registered or not.
   *
   * @return {string[]}
   */
  get bootstrapIn(): string[]

  /**
   * Register any application services.
   *
   * @return {void|Promise<void>}
   */
  register(): void | Promise<void>

  /**
   * Bootstrap any application services.
   *
   * @return {void|Promise<void>}
   */
  boot(): void | Promise<void>

  /**
   * Shutdown any application services.
   *
   * @return {void|Promise<void>}
   */
  shutdown(): void | Promise<void>

  /**
   * Register all three attributes defined within
   * ServiceProvider.
   *
   * @return {this}
   */
  registerAttributes(): this
}

export class Ioc {
  /**
   * Hold all the dependencies that are mocked. The mocked
   * dependencies will never be replaced if its alias exists here.
   *
   * @type {string[]}
   */
  static fakes: string[]

  /**
   * The awilix container instance.
   *
   * @type {import('awilix').AwilixContainer<any>}
   */
  static container: import('../node_modules/awilix/lib/awilix').AwilixContainer<any>

  /**
   * Creates a new instance of IoC.
   *
   * @param {import('awilix').ContainerOptions} [options]
   * @return {Ioc}
   */
  constructor(options?: import('awilix').ContainerOptions)

  /**
   * Reconstruct the awilix container and mocks.
   *
   * @param {import('awilix').ContainerOptions} [options]
   * @return {Ioc}
   */
  reconstruct(options?: import('awilix').ContainerOptions): Ioc

  /**
   * List all bindings of the Ioc.
   *
   * @return {import('awilix').RegistrationHash}
   */
  list(): import('awilix').RegistrationHash

  /**
   * Return the registration of the dependency.
   *
   * @return {import('awilix').Resolver<any> & { hasCamelAlias: boolean }}
   */
  getRegistration(alias: string): import('awilix').Resolver<any> & { hasCamelAlias: boolean }

  /**
   * Resolve a service provider from the container or
   * returns undefined if not found.
   *
   * @param {string} alias
   * @return {any|undefined}
   */
  use(alias: string): any | undefined

  /**
   * Resolve a service provider from the container or
   * throws exception if not found.
   *
   * @param {string} alias
   * @return {any}
   */
  safeUse(alias: string): any

  /**
   * Register and alias to other dependency alias of the
   * container.
   *
   * @param {string} alias
   * @param {string} dependencyAlias
   * @return {Ioc}
   */
  alias(alias: string, dependencyAlias: string): Ioc

  /**
   * Bind a transient dependency to the container.
   * Transient dependencies will always resolve a new
   * instance of it everytime you (or Athenna internally)
   * call ".use" or ".safeUse" method.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  bind(alias: string, dependency: any, createCamelAlias?: boolean): Ioc

  /**
   * Bind a transient dependency to the container.
   * Transient dependencies will always resolve a new
   * instance of it everytime you (or Athenna internally)
   * call ".use" or ".safeUse" method.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  transient(alias: string, dependency: any, createCamelAlias?: boolean): Ioc

  /**
   * Bind a scoped dependency to the container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  scoped(alias: string, dependency: any, createCamelAlias?: boolean): Ioc

  /**
   * Bind an instance dependency to the container.
   * Instance dependencies have the same behavior of
   * singleton dependencies, but you will have more control
   * on how you want to create your dependency constructor.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  instance(alias: string, dependency: any, createCamelAlias?: boolean): Ioc

  /**
   * Bind a singleton dependency to the container.
   * Singleton dependencies will always resolve the same
   * instance of it everytime you (or Athenna internally)
   * call ".use" or ".safeUse" method.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  singleton(alias: string, dependency: any, createCamelAlias?: boolean): Ioc

  /**
   * Bind a fake dependency to the container.
   * Fake dependencies will not let the container
   * register the dependencies until you call ".unfake"
   * method.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  fake(alias: string, dependency: any, createCamelAlias?: boolean): Ioc

  /**
   * Remove the fake dependency from fakes map.
   *
   * @param {string} alias
   * @return {Ioc}
   */
  unfake(alias: string): Ioc

  /**
   * Remove all fake dependencies from fakes map.
   *
   * @return {Ioc}
   */
  clearAllFakes(): Ioc

  /**
   * Verify if dependency alias is fake or not.
   *
   * @return {boolean}
   */
  isFaked(alias: string): boolean

  /**
   * Register a fake method to the dependency.
   *
   * @param {string} alias
   * @param {string} method
   * @param {any} returnValue
   * @return {Ioc}
   */
  fakeMethod(alias: string, method: string, returnValue: any): Ioc

  /**
   * Restore the dependency method to the default state.
   *
   * @param {string} alias
   * @param {string} method
   * @return {Ioc}
   */
  restoreMethod(alias: string, method: string): Ioc

  /**
   * Restore all the dependency methods to the default state.
   *
   * @param {string} alias
   * @return {Ioc}
   */
  restoreAllMethods(alias: string): Ioc

  /**
   * Verify if the container has the dependency or not.
   *
   * @param {string} alias
   * @return {boolean}
   */
  hasDependency(alias: string): boolean
}

declare global {
  let ioc: Ioc
}
