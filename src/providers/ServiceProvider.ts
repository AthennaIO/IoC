/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src/container/Ioc'

export class ServiceProvider {
  /**
   * The Ioc container instance.
   */
  public container: Ioc

  public constructor() {
    this.container = new Ioc()
  }

  /**
   * Set where the environment of application where this provider can
   * be registered or not.
   */
  public get environment(): string[] {
    return ['*']
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
}
