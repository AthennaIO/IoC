/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Inject } from '#src/Decorators/Inject'
import { ClientService } from './ClientService.js'
import { User, UserService } from './UserService.js'

export interface Client {
  id: number
  name: string
}

export class DecoratedService {
  @Inject('Helpers/UserService')
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
