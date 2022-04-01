/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from 'src/Ioc'

export class ServiceProvider {
  /**
   * The ioc container instance
   */
  public container: Ioc

  /**
   * All the container bindings that should be registered.
   */
  public bindings?: Record<string, new (...args: any[]) => any>

  /**
   * All the container instances that should be registered.
   */
  public instances?: Record<string, any>

  /**
   * All the container singletons that should be registered.
   */
  public singletons?: Record<string, new (...args: any[]) => any>

  public constructor() {
    this.container = new Ioc()
  }

  /**
   * Register any application services.
   *
   * @return void
   */
  public register?(): void | Promise<void>

  /**
   * Bootstrap any application services.
   *
   * @return void
   */
  public boot?(): void | Promise<void>

  public registerAttributes(): this {
    const bindings: any = this.bindings
    const instances: any = this.instances
    const singletons: any = this.singletons

    if (bindings) {
      Object.keys(bindings).forEach(alias => {
        this.container.bind(alias, bindings[alias])
      })
    }

    if (instances) {
      Object.keys(instances).forEach(alias => {
        this.container.instance(alias, instances[alias])
      })
    }

    if (instances) {
      Object.keys(singletons).forEach(alias => {
        this.container.singleton(alias, singletons[alias])
      })
    }

    return this
  }
}
