/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class ClientServiceMock {
  private clients = [
    { id: 1, name: 'Mock' },
    { id: 2, name: 'Mock' },
  ]

  find() {
    return this.clients
  }
}
