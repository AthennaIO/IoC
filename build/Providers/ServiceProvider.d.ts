import { Ioc } from '#src/Container/Ioc';

/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare class ServiceProvider {
    /**
     * The Ioc container instance.
     */
    container: Ioc;
    constructor();
    /**
     * Set where the type of application where this provider can
     * be registered or not.
     */
    get bootstrapIn(): string[];
    /**
     * All the container bindings that should be registered.
     */
    get bindings(): Record<string, any | Promise<any>>;
    /**
     * All the container instances that should be registered.
     */
    get instances(): Record<string, any | Promise<any>>;
    /**
     * All the container singletons that should be registered.
     */
    get singletons(): Record<string, any | Promise<any>>;
    /**
     * Register any application services.
     */
    register(): void | Promise<void>;
    /**
     * Bootstrap any application services.
     */
    boot(): void | Promise<void>;
    /**
     * Shutdown any application services.
     */
    shutdown(): void | Promise<void>;
    /**
     * Register all three attributes defined within
     * ServiceProvider.
     */
    registerAttributes(): this;
}

export { ServiceProvider };
