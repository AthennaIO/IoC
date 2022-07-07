export class Facade {
  /**
   * The container to resolve dependencies.
   */
  static container: any

  /**
   * Resolve the dependency from the container by the name.
   *
   * @param {string} alias
   */
  static getFacadeRoot(alias: string): any;

  /**
   * Create a new Facade for the alias specified
   *
   * @param {string} alias
   * @return {any}
   */
  static createFor(alias: string): any;
}

export class ServiceProvider {
  /**
   * Set where the type of application where this provider can
   * be registered or not.
   *
   * @return {string[]}
   */
  get bootstrapIn(): string[]

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
   * Register any application services.
   *
   * @return {void|Promise<void>}
   */
  register(): void | Promise<void>;

  /**
   * Bootstrap any application services.
   *
   * @return {void|Promise<void>}
   */
  boot(): void | Promise<void>;

  /**
   * Register all three attributes defined within
   * ServiceProvider.
   *
   * @return {this}
   */
  registerAttributes(): this;
}

export class Ioc {
  /**
   * Hold all the dependencies that are mocked. The mocked
   * dependencies will never be replaced if its alias exists here.
   *
   * @type {string[]}
   */
  static mocks: string[]

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
  constructor(options?: import('awilix').ContainerOptions);

  /**
   * Reconstruct the awilix container and mocks.
   *
   * @param {import('awilix').ContainerOptions} [options]
   * @return {Ioc}
   */
  reconstruct(options?: import('awilix').ContainerOptions): Ioc;

  /**
   * List all bindings of the Ioc.
   *
   * @return {import('awilix').RegistrationHash}
   */
  list(): import('awilix').RegistrationHash

  /**
   * Resolve a service provider from the container or
   * returns undefined if not found.
   *
   * @param {string} alias
   * @return {any|undefined}
   */
  use(alias: string): any | undefined;

  /**
   * Resolve a service provider from the container or
   * throws exception if not found.
   *
   * @param {string} alias
   * @return {any}
   */
  safeUse(alias: string): any;

  /**
   * Register and alias to other dependency alias of the
   * container.
   *
   * @param {string} alias
   * @param {string} dependencyAlias
   * @return {Ioc}
   */
  alias(alias: string, dependencyAlias: string): Ioc;

  /**
   * Bind a transient dependency to the container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  bind(alias: string, dependency: any, createCamelAlias?: boolean): Ioc;

  /**
   * Bind an instance dependency to the container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  instance(alias: string, dependency: any, createCamelAlias?: boolean): Ioc;

  /**
   * Bind a mocked dependency to the container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  mock(alias: string, dependency: any, createCamelAlias?: boolean): Ioc;

  /**
   * Remove the mock from mocks property.
   *
   * @param {string} alias
   * @return {Ioc}
   */
  unmock(alias: string): Ioc;

  /**
   * Remove all mocks from mocks property.
   *
   * @return {Ioc}
   */
  clearAllMocks(): Ioc;

  /**
   * Bind a singleton dependency to the container.
   *
   * @param {string} alias
   * @param {any} dependency
   * @param {boolean} [createCamelAlias]
   * @return {Ioc}
   */
  singleton(alias: string, dependency: any, createCamelAlias?: boolean): Ioc;

  /**
   * Verify if the container has the dependency or not.
   *
   * @param {string} alias
   * @return {boolean}
   */
  hasDependency(alias: string): boolean;
}

declare global {
  let ioc: Ioc
}
