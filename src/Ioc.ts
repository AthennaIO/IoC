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
  AwilixContainer,
  ContainerOptions,
  createContainer,
  GlobWithOptions,
  InjectionMode,
} from 'awilix'

import { Is, String } from '@secjs/utils'
import { RegisterENUM } from 'src/Enum/RegisterENUM'
import { DependencyAlreadyExistsException } from 'src/Exceptions/DependencyAlreadyExistsException'

export class Ioc {
  private static container: AwilixContainer<any>

  constructor(options?: ContainerOptions) {
    if (Ioc.container) return

    this.reconstruct(options)
  }

  reconstruct(options?: ContainerOptions): this {
    Object.assign({}, { injectionMode: InjectionMode.PROXY }, options)

    Ioc.container = createContainer(options)

    return this
  }

  list(alias: string | (string | GlobWithOptions)[]) {
    return Ioc.container.loadModules(Is.String(alias) ? [alias] : alias)
  }

  use<Dependency = any>(alias: string): Dependency {
    return Ioc.container.resolve<Dependency>(alias)
  }

  bind(alias: string, Dependency: any): void {
    this.register(alias, Dependency, RegisterENUM.TRANSIENT)
  }

  scope(alias: string, Dependency: any): void {
    this.register(alias, Dependency, RegisterENUM.SCOPED)
  }

  singleton(alias: string, Dependency: any): void {
    this.register(alias, Dependency, RegisterENUM.SINGLETON)
  }

  hasDependency(alias: string) {
    return Ioc.container.hasRegistration(alias)
  }

  private register(
    alias: string,
    Dependency: any,
    registerType: RegisterENUM,
  ): void {
    this.verifyDependencyAlias(alias)

    if (alias.includes('/')) {
      const aliasOfAlias = alias.split('/').pop() as string

      this.verifyDependencyAlias(aliasOfAlias)
    }

    if (Is.Class(Dependency)) {
      Ioc.container.register(alias, asClass(Dependency)[registerType]())
    } else if (Is.Function(Dependency)) {
      Ioc.container.register(alias, asFunction(Dependency)[registerType]())
    } else {
      Ioc.container.register(alias, asValue(Dependency)[registerType]())
    }

    if (alias.includes('/')) {
      const aliasOfAlias = alias.split('/').pop() as string

      Ioc.container.register(String.toCamelCase(aliasOfAlias), aliasTo(alias))
    }
  }

  private verifyDependencyAlias(alias: string) {
    const existDependency = this.hasDependency(alias)

    if (existDependency) {
      throw new DependencyAlreadyExistsException(alias)
    }
  }
}
