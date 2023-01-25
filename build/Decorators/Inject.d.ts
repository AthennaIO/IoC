/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Inject some dependency of the service container in some property.
 */
declare function Inject(alias?: string): PropertyDecorator;

export { Inject };
