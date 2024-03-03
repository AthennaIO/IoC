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
  asFunction,
  InjectionMode,
  createContainer,
  type Resolver,
  type AwilixContainer,
  type RegistrationHash,
  type ContainerOptions
} from 'awilix'

import { sep } from 'node:path'
import { debug } from '#src/debug'
import type { LoadModuleOptions } from '#src'
import { Annotation } from '#src/helpers/Annotation'
import { Is, Path, Exec, String, Module, Options } from '@athenna/common'
import { NotFoundServiceException } from '#src/exceptions/NotFoundServiceException'

export class Ioc {
  /**
   * Hold all the services that are fakes. The fake
   * services will never be replaced if its alias
   * exists here.
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
   * Reconstruct the awilix container and fakes.
   */
  public reconstruct(options?: ContainerOptions): Ioc {
    options = Options.create(options, { injectionMode: InjectionMode.CLASSIC })

    Ioc.fakes = []
    Ioc.container = createContainer(options)

    debug(
      'Reconstructing the container using the following options: %o.',
      options
    )

    return this
  }

  /**
   * List all bindings of the Ioc.
   */
  public list(): RegistrationHash {
    return Ioc.container.registrations
  }

  /**
   * Return the registration of the service.
   */
  public getRegistration<T = any>(alias: string): Resolver<T> {
    return Ioc.container.getRegistration(alias)
  }

  /**
   * Resolve a service from the container or
   * returns undefined if not found.
   */
  public use<T = any>(alias: string): T {
    return Ioc.container.resolve(alias, { allowUnregistered: true })
  }

  /**
   * Resolve a service from the container or
   * throws exception if not found.
   */
  public safeUse<T = any>(alias: string): T {
    if (!this.has(alias)) {
      throw new NotFoundServiceException(alias)
    }

    return Ioc.container.resolve<T>(alias)
  }

  /**
   * Register an alias to another service alias.
   */
  public alias(subAlias: string, originalAlias: string): Ioc {
    if (!this.has(originalAlias)) {
      throw new NotFoundServiceException(originalAlias)
    }

    debug(
      'registering sub alias %s to %s original alias.',
      subAlias,
      originalAlias
    )

    Ioc.container.register(subAlias, aliasTo(originalAlias))

    return this
  }

  /**
   * Bind a transient service to the container.
   * Transient services will always resolve a new
   * instance of it every time you (or Athenna internally)
   * call ".use" or ".safeUse" method.
   */
  public bind(alias: string, service: any): Ioc {
    this.register(alias, service, { type: 'transient' })

    return this
  }

  /**
   * Bind a transient service to the container.
   * Transient services will always resolve a new
   * instance of it every time you (or Athenna internally)
   * call ".use" or ".safeUse" method.
   */
  public transient(alias: string, service: any): Ioc {
    this.register(alias, service, { type: 'transient' })

    return this
  }

  /**
   * Bind an instance service to the container.
   * Instance services have the same behavior of
   * singleton services, but you will have more control
   * on how you want to create your service constructor.
   */
  public instance(alias: string, service: any): Ioc {
    this.register(alias, service, { type: 'singleton' })

    return this
  }

  /**
   * Bind a singleton service to the container.
   * Singleton services will always resolve the same
   * instance of it every time you (or Athenna internally)
   * call ".use" or ".safeUse" method.
   */
  public singleton(alias: string, service: any): Ioc {
    this.register(alias, service, { type: 'singleton' })

    return this
  }

  /**
   * Bind a fake service to the container.
   * Fake services will not let the container
   * re-register the service alias until you call
   * "ioc.unfake()" method.
   */
  public fake(alias: string, service: any): Ioc {
    this.register(alias, service, { type: 'singleton' })

    Ioc.fakes.push(alias)

    return this
  }

  /**
   * Remove the fake service from fakes map.
   */
  public unfake(alias: string): Ioc {
    const index = Ioc.fakes.indexOf(alias)

    if (index > -1) {
      Ioc.fakes.splice(index, 1)
    }

    return this
  }

  /**
   * Remove all fake services from fakes array.
   */
  public clearAllFakes(): Ioc {
    Ioc.fakes = []

    return this
  }

  /**
   * Verify if service alias is fake or not.
   */
  public isFaked(alias: string): boolean {
    return Ioc.fakes.includes(alias)
  }

  /**
   * Verify if the container has the service or not.
   */
  public has(alias: string): boolean {
    return Ioc.container.hasRegistration(alias)
  }

  /**
   * Import and register a module found in the determined
   * path.
   */
  public async loadModule(
    path: string,
    options: LoadModuleOptions = {}
  ): Promise<void> {
    options = Options.create(options, {
      addCamelAlias: true,
      parentURL: Path.toHref(Path.pwd() + sep)
    })

    const Service = await Module.resolve(path, options.parentURL)
    const meta = Annotation.getMeta(Service)

    this[meta.type](meta.alias, Service)
    Annotation.defineAsRegistered(Service)

    if (meta.alias.includes('/') && options.addCamelAlias && !meta.camelAlias) {
      const subAlias = meta.alias.split('/').pop()

      this.alias(String.toCamelCase(subAlias), meta.alias)
    }

    if (meta.name) {
      this.alias(meta.name, meta.alias)
    }

    if (meta.camelAlias) {
      this.alias(meta.camelAlias, meta.alias)
    }
  }

  /**
   * Import and register all the files found in all
   * the determined paths.
   */
  public async loadModules(
    paths: string[],
    options: LoadModuleOptions = {}
  ): Promise<void> {
    await Exec.concurrently(paths, async path => {
      await this.loadModule(path, options)
    })
  }

  /**
   * Get the Awilix binder based on the type of the
   * service.
   */
  private getAwilixBinder(
    type: 'transient' | 'scoped' | 'singleton',
    service: any
  ): any {
    if (Is.Class(service)) {
      return asClass(service)[type]()
    }

    if (Is.Function(service)) {
      return asFunction(service)[type]()
    }

    return asValue(service)
  }

  /**
   * Register the binder in the Awilix container.
   */
  private register(
    alias: string,
    service: any,
    options: {
      type?: 'transient' | 'scoped' | 'singleton'
    }
  ): void {
    if (this.isFaked(alias)) {
      return
    }

    options = Options.create(options, { type: 'transient' })

    /**
     * Saving the logic inside the function to reuse the code
     * for promises and no promises services.
     */
    const register = service => {
      const binder = this.getAwilixBinder(options.type, service)

      debug('registering service: %o', {
        name: service?.name,
        type: options.type,
        alias
      })

      Ioc.container.register(alias, binder)
    }

    if (service && service.then) {
      debug(
        'service with alias %s is a promise. waiting for it to resolve to be registered.',
        alias
      )

      service.then(service => register(service))

      return
    }

    register(service)
  }
}
