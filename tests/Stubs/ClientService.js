/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class ClientService {
  #clients = [
    { id: 1, name: 'LinkApi' },
    { id: 2, name: 'Semantix' },
  ]

  find() {
    return this.#clients
  }
}
