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
  InjectionMode,
} from 'awilix'

import { Is, String } from '@secjs/utils'
import { RegisterENUM } from 'src/Enum/RegisterENUM'
import { NotFoundDependencyException } from 'src/Exceptions/NotFoundDependencyException'
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

  use<Dependency = any>(alias: string): Dependency | undefined {
    try {
      return Ioc.container.resolve<Dependency>(alias) as Dependency
    } catch (error) {
      return undefined
    }
  }

  safeUse<Dependency = any>(alias: string): Dependency {
    if (!this.hasDependency(alias)) {
      throw new NotFoundDependencyException(alias)
    }

    return Ioc.container.resolve<Dependency>(alias) as Dependency
  }

  alias(alias: string, dependencyAlias: string): this {
    this.verifyDependencyAlias(alias)

    if (!this.hasDependency(dependencyAlias)) {
      throw new NotFoundDependencyException(dependencyAlias)
    }

    Ioc.container.register(alias, aliasTo(dependencyAlias))

    return this
  }

  bind(alias: string, Dependency: any): this {
    this.register(alias, Dependency, RegisterENUM.TRANSIENT)

    return this
  }

  scope(alias: string, Dependency: any): this {
    this.register(alias, Dependency, RegisterENUM.SCOPED)

    return this
  }

  singleton(alias: string, Dependency: any): this {
    this.register(alias, Dependency, RegisterENUM.SINGLETON)

    return this
  }

  hasDependency(alias: string): boolean {
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
      Ioc.container.register(alias, asValue(Dependency))
    }

    if (alias.includes('/')) {
      const aliasOfAlias = alias.split('/').pop() as string

      this.alias(String.toCamelCase(aliasOfAlias), alias)
    }
  }

  private verifyDependencyAlias(alias: string) {
    const existDependency = this.hasDependency(alias)

    if (existDependency) {
      throw new DependencyAlreadyExistsException(alias)
    }
  }
}
