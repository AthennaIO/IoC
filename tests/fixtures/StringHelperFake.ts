/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Service } from '#src'

@Service({
  camelAlias: 'stringHelper',
  alias: 'App/Services/StringHelper'
})
export class StringHelperFake {
  public constructor() {}

  public run() {
    return 'fake'
  }
}
