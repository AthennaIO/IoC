/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class UserService {
  #users = [
    { id: 1, name: 'João' },
    { id: 2, name: 'Victor' },
  ]

  constructor(clientService) {
    this.#users.push({ id: 3, name: 'Paulo' })

    this.#users = this.#users.map(user => {
      user.clients = clientService.find()

      return user
    })
  }

  find() {
    return this.#users
  }
}
