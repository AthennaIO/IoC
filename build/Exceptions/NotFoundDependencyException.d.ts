import { Exception } from '@athenna/common';

/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare class NotFoundDependencyException extends Exception {
    constructor(alias: string);
}

export { NotFoundDependencyException };
