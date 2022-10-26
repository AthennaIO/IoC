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
  get singletons() {
    return {
      'Helpers/ClientService': import('#tests/Stubs/ClientService'),
    }
  }

  get bindings() {
    return {
      'Helpers/NewStringHelper': import('#tests/Stubs/StringHelper'),
    }
  }

  get instances() {
    return {
      'Helpers/UserService': import('#tests/Stubs/UserService'),
    }
  }

  register() {
    this.container.instance('Helpers/StringFn', () => 'StringFn')
  }

  boot() {
    this.container.instance('Helpers/NumberFn', () => 'NumberFn')
  }

  shutdown() {
    this.container.instance('Helpers/StringFn', null)
    this.container.instance('Helpers/NumberFn', null)
  }
}
