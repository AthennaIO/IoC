/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Service } from '#src/annotations/Service'

export interface Client {
  id: number
  name: string
}

@Service({
  name: 'App/Services/Names/ClientService'
})
export class ClientService {
  private signature = Math.random()

  private clients = [
    { id: 1, name: 'LinkApi' },
    { id: 2, name: 'Semantix' }
  ]

  public find(): Client[] {
    return this.clients
  }

  public getSignature(): number {
    return this.signature
  }
}
