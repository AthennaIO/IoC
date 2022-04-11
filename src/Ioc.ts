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

export class Ioc {
  private static mocks: {
    alias: string
    Dependency: any
    createCamelAlias: boolean
  }[] = []

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
    return Ioc.container.resolve<Dependency>(alias, {
      allowUnregistered: true,
    })
  }

  safeUse<Dependency = any>(alias: string): Dependency {
    if (!this.hasDependency(alias)) {
      throw new NotFoundDependencyException(alias)
    }

    return Ioc.container.resolve<Dependency>(alias) as Dependency
  }

  alias(alias: string, dependencyAlias: string): this {
    if (!this.hasDependency(dependencyAlias)) {
      throw new NotFoundDependencyException(dependencyAlias)
    }

    Ioc.container.register(alias, aliasTo(dependencyAlias))

    return this
  }

  bind(
    alias: string,
    Dependency: new (...args: any[]) => any,
    createCamelAlias = true,
  ): this {
    this.registerByType(
      alias,
      Dependency,
      RegisterENUM.TRANSIENT,
      createCamelAlias,
    )

    return this
  }

  instance(alias: string, Dependency: any, createCamelAlias = true): this {
    this.registerByType(
      alias,
      Dependency,
      RegisterENUM.SINGLETON,
      createCamelAlias,
    )

    return this
  }

  mock(alias: string, Dependency: any, createCamelAlias = true): this {
    Ioc.mocks.push({ alias, Dependency, createCamelAlias })

    return this
  }

  scope(
    alias: string,
    Dependency: new (...args: any[]) => any,
    createCamelAlias = true,
  ): this {
    this.registerByType(
      alias,
      Dependency,
      RegisterENUM.SCOPED,
      createCamelAlias,
    )

    return this
  }

  singleton(
    alias: string,
    Dependency: new (...args: any[]) => any,
    createCamelAlias = true,
  ): this {
    this.registerByType(
      alias,
      Dependency,
      RegisterENUM.SINGLETON,
      createCamelAlias,
    )

    return this
  }

  hasDependency(alias: string): boolean {
    return Ioc.container.hasRegistration(alias)
  }

  private registerByType(
    alias: string,
    Dependency: any,
    registerType: RegisterENUM,
    createCamelAlias = true,
  ): void {
    if (Is.Class(Dependency)) {
      this.register(alias, Dependency, registerType, createCamelAlias, asClass)

      return
    }

    if (Is.Function(Dependency)) {
      this.register(
        alias,
        Dependency,
        registerType,
        createCamelAlias,
        asFunction,
      )

      return
    }

    this.register(alias, Dependency, registerType, createCamelAlias, asValue)
  }

  private register(
    alias: string,
    Dependency: any,
    registerType: RegisterENUM,
    createCamelAlias = true,
    binder: any,
  ) {
    const mock = Ioc.mocks.find(mock => mock.alias === alias)

    if (mock) {
      Dependency = mock.Dependency
      createCamelAlias = mock.createCamelAlias
    }

    if (Dependency.then) {
      Dependency.then(realDependency => {
        if (binder.name === 'asValue') {
          Ioc.container.register(alias, binder(realDependency))

          return
        }

        Ioc.container.register(alias, binder(realDependency)[registerType]())
      })
    } else {
      if (binder.name === 'asValue') {
        Ioc.container.register(alias, binder(Dependency))

        return
      }

      Ioc.container.register(alias, binder(Dependency)[registerType]())
    }

    if (alias.includes('/') && createCamelAlias) {
      const aliasOfAlias = alias.split('/').pop() as string

      this.alias(String.toCamelCase(aliasOfAlias), alias)
    }
  }
}
