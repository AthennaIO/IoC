/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { StringHelper } from './StringHelper'
import { ServiceProvider } from '../../src/Providers/ServiceProvider'

export class HelpersProvider extends ServiceProvider {
  async boot(): Promise<void> {
    this.container.bind('Helpers/NewStringHelper', StringHelper)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async register(): Promise<void> {}
}
