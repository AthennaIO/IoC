/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src/index'

export class ServiceProvider {
  /**
   * All the container bindings that should be registered.
   *
   * @type {Record<string, new (...args: any[]) => any>}
   */
  bindings = {}

  /**
   * All the container instances that should be registered.
   *
   * @type {Record<string, any>}
   */
  instances = {}

  /**
   * All the container singletons that should be registered.
   *
   * @type {Record<string, new (...args: any[]) => any>}
   */
  singletons = {}

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
  async register() {}

  /**
   * Bootstrap any application services.
   *
   * @return {void|Promise<void>}
   */
  async boot() {}

  /**
   * Register all three attributes defined within
   * ServiceProvider.
   *
   * @return {this}
   */
  registerAttributes() {
    Object.keys(this.bindings).forEach(alias => {
      this.container.bind(alias, this.bindings[alias])
    })

    Object.keys(this.instances).forEach(alias => {
      this.container.instance(alias, this.instances[alias])
    })

    Object.keys(this.singletons).forEach(alias => {
      this.container.singleton(alias, this.singletons[alias])
    })

    return this
  }
}
