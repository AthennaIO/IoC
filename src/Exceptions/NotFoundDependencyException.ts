/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@secjs/utils'

export class NotFoundDependencyException extends Exception {
  public constructor(alias: string) {
    const content = `The dependency alias ${alias} has not been found inside the container`

    super(
      content,
      500,
      'NOT_FOUND_EXCEPTION',
      'Try executing the ioc.list method to verify that your dependency is registered inside the container',
    )
  }
}
