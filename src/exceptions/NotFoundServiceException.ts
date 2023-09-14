/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'

export class NotFoundServiceException extends Exception {
  public constructor(alias: string) {
    super({
      status: 500,
      code: 'E_NOT_FOUND_SERVICE_ERROR',
      message: `The service with ${alias} alias has not been found inside the container.`,
      help: `First you need to bind your ${alias} inside the container using the ioc.bind() or ioc.singleton() methods. Then execute the ioc.list() method to verify that your service is registered inside the container.`
    })
  }
}
