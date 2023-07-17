/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Inject, Service } from '#src'
import { ClientService } from './ClientService.js'
import { type User, UserService } from './UserService.js'

export interface Client {
  id: number
  name: string
}

@Service()
export class InjectService {
  @Inject('App/Services/UserService')
  private userService: UserService

  @Inject()
  private clientService: ClientService

  public findOneUser(): User {
    return this.userService.find()[0]
  }

  public findClients(): Client[] {
    return this.clientService.find()
  }
}
