/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ServiceProvider } from '#src/index'

export class HelpersProvider extends ServiceProvider {
  singletons = {
    'Helpers/ClientService': import('#tests/Stubs/ClientService'),
  }

  bindings = {
    'Helpers/NewStringHelper': import('#tests/Stubs/StringHelper'),
  }

  instances = {
    'Helpers/UserService': import('#tests/Stubs/UserService'),
  }

  register() {
    this.container.instance('Helpers/StringFn', () => 'StringFn')
  }

  boot() {
    this.container.instance('Helpers/NumberFn', () => 'NumberFn')
  }
}
