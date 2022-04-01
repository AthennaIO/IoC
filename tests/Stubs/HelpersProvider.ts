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
  public bindings = {
    'Helpers/NewStringHelper': StringHelper,
  }
}
