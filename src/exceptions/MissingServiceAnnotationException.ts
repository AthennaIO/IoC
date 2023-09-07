/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Exception } from '@athenna/common'

export class MissingServiceAnnotationException extends Exception {
  public constructor(name: any) {
    super({
      status: 500,
      code: 'E_MISSING_SERVICE_ANNOTATION',
      message: `Missing @Service() annotation in ${name} dependency.`,
      help: `The @Service() annotation is required to be present in your ${name} dependency to use @Inject() or @MockInject() annotations.`
    })
  }
}
