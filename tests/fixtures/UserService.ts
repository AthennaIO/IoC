/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Service } from '#src/annotations/Service'
import { type Client, ClientService } from './ClientService.js'

export interface User {
  id: number
  name: string
  clients?: Client[]
}

@Service()
export class UserService {
  private users: User[] = [
    { id: 1, name: 'João' },
    { id: 2, name: 'Victor' }
  ]

  public constructor(clientService: ClientService) {
    this.users.push({ id: 3, name: 'Paulo' })

    this.users = this.users.map(user => {
      user.clients = clientService.find()

      return user
    })
  }

  public find() {
    return this.users
  }
}
