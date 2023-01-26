/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src/Container/Ioc'
import { Module } from '@athenna/common'

export class ServiceProvider {
  /**
   * The Ioc container instance.
   */
  public container: Ioc

  public constructor() {
    this.container = new Ioc()
  }

  /**
   * Set where the type of application where this provider can
   * be registered or not.
   */
  public get bootstrapIn(): string[] {
    return ['*']
  }

  /**
   * All the container bindings that should be registered.
   */
  public get bindings(): Record<string, any | Promise<any>> {
    return {}
  }

  /**
   * All the container instances that should be registered.
   */
  public get instances(): Record<string, any | Promise<any>> {
    return {}
  }

  /**
   * All the container singletons that should be registered.
   */
  public get singletons(): Record<string, any | Promise<any>> {
    return {}
  }

  /**
   * Register any application services.
   */
  public register(): void | Promise<void> {
    //
  }

  /**
   * Bootstrap any application services.
   */
  public boot(): void | Promise<void> {
    //
  }

  /**
   * Shutdown any application services.
   */
  public shutdown(): void | Promise<void> {
    //
  }

  /**
   * Register all three attributes defined within
   * ServiceProvider.
   */
  public registerAttributes(): this {
    Object.keys(this.bindings).forEach(alias => {
      this.container.bind(alias, Module.get(this.bindings[alias]))
    })

    Object.keys(this.instances).forEach(alias => {
      this.container.instance(alias, Module.get(this.instances[alias]))
    })

    Object.keys(this.singletons).forEach(alias => {
      this.container.singleton(alias, Module.get(this.singletons[alias]))
    })

    return this
  }
}
