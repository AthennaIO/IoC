/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@secjs/utils'

export class DependencyAlreadyExistsException extends Exception {
  public constructor(alias: string) {
    const content = `The alias ${alias} is already in use inside the container`

    super(
      content,
      500,
      'DEPENDENCY_EXISTS_EXCEPTION',
      'Remember that Ioc creates an alias for the alias that is using "/". Try changing the name that you are trying to use as alias',
    )
  }
}
