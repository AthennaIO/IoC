import { Ioc } from '#src/Container/Ioc';

/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare global {
    export const ioc: Ioc;
    export const container: Ioc;
}
