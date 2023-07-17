/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '#src'
import { AfterEach } from '@athenna/test'

export class BaseTest {
  @AfterEach()
  public baseAfterEach() {
    new Ioc().reconstruct()
  }

  public reconstructIoc() {
    new Ioc().reconstruct()
  }

  public async import(module: string) {
    return import(`${module}.js?version=${Math.random()}`)
  }
}
