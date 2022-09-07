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
  /**
   * Creates a new instance of NotFoundDependencyException.
   *
   * @param {string} alias
   * @return {NotFoundDependencyException}
   */
  constructor(alias) {
    const content = `The dependency ${alias} has not been found inside the container.`

    super(
      content,
      500,
      'E_NOT_FOUND_DEPENDENCY_ERROR',
      `First you need to bind your ${alias} inside the container using the ioc.bind or ioc.singleton methods. Then execute the ioc.list method to verify that your dependency is registered inside the container.`,
    )
  }
}
