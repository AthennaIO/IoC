/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src/index'
import { Module } from '@secjs/utils'

export class ServiceProvider {
  /**
   * Set where the type of application where this provider can
   * be registered or not.
   *
   * @return {string[]}
   */
  get bootstrapIn() {
    return ['*']
  }

  /**
   * All the container bindings that should be registered.
   *
   * @type {Record<string, new (...args: any[]) => any>}
   */
  get bindings() {
    return {}
  }

  /**
   * All the container instances that should be registered.
   *
   * @return {Record<string, any>}
   */
  get instances() {
    return {}
  }

  /**
   * All the container singletons that should be registered.
   *
   * @return {Record<string, new (...args: any[]) => any>}
   */
  get singletons() {
    return {}
  }

  constructor() {
    /**
     * The ioc container instance
     *
     * @type {Ioc}
     */
    this.container = new Ioc()
  }

  /**
   * Register any application services.
   *
   * @return {void|Promise<void>}
   */
  async register() {
    //
  }

  /**
   * Bootstrap any application services.
   *
   * @return {void|Promise<void>}
   */
  async boot() {
    //
  }

  /**
   * Register all three attributes defined within
   * ServiceProvider.
   *
   * @return {this}
   */
  registerAttributes() {
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
