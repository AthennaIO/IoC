/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { type Client } from './ClientService.js'

export class ClientServiceMock {
  private clients: Client[] = [
    { id: 1, name: 'Mock' },
    { id: 2, name: 'Mock' },
  ]

  public find() {
    return this.clients
  }
}
