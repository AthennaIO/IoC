import { Ioc } from '#src/Container/Ioc';

/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare class ProviderFaker {
    /**
     * The Ioc container instance.
     */
    static container: Ioc;
    /**
     * Set the container instance.
     */
    static boot(): typeof ProviderFaker;
    /**
     * Fake a provider method.
     */
    static fakeMethod(alias: string, method: string, returnValue: any): void;
    /**
     * Restore a provider method to the default state.
     */
    static restoreMethod(alias: string, method: string): void;
    /**
     * Restore all the providers methods with the alias
     * to the default state.
     */
    static restoreAllMethods(alias: string): void;
    /**
     * Get the provider from the container.
     */
    private static getProvider;
    /**
     * Generate the method key for the map.
     */
    private static getKey;
    /**
     * Get the provider prototype to make mods.
     */
    private static getProviderProto;
}

export { ProviderFaker };
