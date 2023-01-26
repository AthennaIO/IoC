/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export interface Client {
  id: number
  name: string
}

export class ClientService {
  private clients = [
    { id: 1, name: 'LinkApi' },
    { id: 2, name: 'Semantix' },
  ]

  public find(): Client[] {
    return this.clients
  }
}
