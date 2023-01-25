import { Ioc } from '#src/Container/Ioc';
import { FacadeType } from '#src/Facades/FacadeProxyHandler';

/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare class Facade {
    /**
     * The container to resolve dependencies.
     */
    static container: Ioc;
    /**
     * Set the container if it does not exist.
     */
    static setContainer(): void;
    /**
     * Create a new Facade for the alias specified
     */
    static createFor<T = any>(alias: string): FacadeType<T>;
}

export { Facade };
