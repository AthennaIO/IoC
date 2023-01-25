import { AwilixContainer, ContainerOptions, RegistrationHash, Resolver } from 'awilix';

/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

declare class Ioc {
    /**
     * Hold all the dependencies that are fakes. The fake
     * dependencies will never be replaced if its alias exists here.
     */
    static fakes: string[];
    /**
     * The awilix container instance.
     */
    static container: AwilixContainer;
    /**
     * Creates a new instance of IoC.
     */
    constructor(options?: ContainerOptions);
    /**
     * Reconstruct the awilix container and mocks.
     */
    reconstruct(options?: ContainerOptions): Ioc;
    /**
     * List all bindings of the Ioc.
     */
    list(): RegistrationHash;
    /**
     * Return the registration of the dependency.
     */
    getRegistration<T = any>(alias: string): Resolver<T> & {
        hasCamelAlias: boolean;
    };
    /**
     * Resolve a service provider from the container or
     * returns undefined if not found.
     */
    use<T = any>(alias: string): T;
    /**
     * Resolve a service provider from the container or
     * throws exception if not found.
     */
    safeUse<T = any>(alias: string): T;
    /**
     * Register and alias to other dependency alias of the
     * container.
     */
    alias(alias: string, dependencyAlias: string): Ioc;
    /**
     * Bind a transient dependency to the container.
     * Transient dependencies will always resolve a new
     * instance of it everytime you (or Athenna internally)
     * call ".use" or ".safeUse" method.
     */
    bind(alias: string, dependency: any, createCamelAlias?: boolean): Ioc;
    /**
     * Bind a transient dependency to the container.
     * Transient dependencies will always resolve a new
     * instance of it everytime you (or Athenna internally)
     * call ".use" or ".safeUse" method.
     */
    transient(alias: string, dependency: any, createCamelAlias?: boolean): Ioc;
    /**
     * Bind a scoped dependency to the container.
     */
    scoped(alias: string, dependency: any, createCamelAlias?: boolean): Ioc;
    /**
     * Bind an instance dependency to the container.
     * Instance dependencies have the same behavior of
     * singleton dependencies, but you will have more control
     * on how you want to create your dependency constructor.
     */
    instance(alias: string, dependency: any, createCamelAlias?: boolean): Ioc;
    /**
     * Bind a singleton dependency to the container.
     * Singleton dependencies will always resolve the same
     * instance of it everytime you (or Athenna internally)
     * call ".use" or ".safeUse" method.
     */
    singleton(alias: string, dependency: any, createCamelAlias?: boolean): Ioc;
    /**
     * Bind a fake dependency to the container.
     * Fake dependencies will not let the container
     * register the dependencies until you call ".unfake"
     * method.
     */
    fake(alias: string, dependency: any, createCamelAlias?: boolean): Ioc;
    /**
     * Remove the fake dependency from fakes map.
     */
    unfake(alias: string): Ioc;
    /**
     * Remove all fake dependencies from fakes map.
     */
    clearAllFakes(): Ioc;
    /**
     * Verify if dependency alias is fake or not.
     */
    isFaked(alias: string): boolean;
    /**
     * Register a fake method to the dependency.
     */
    fakeMethod(alias: string, method: string, returnValue: any): Ioc;
    /**
     * Restore the dependency method to the default state.
     */
    restoreMethod(alias: string, method: string): Ioc;
    /**
     * Restore all the dependency methods to the default state.
     */
    restoreAllMethods(alias: string): Ioc;
    /**
     * Verify if the container has the dependency or not.
     */
    hasDependency(alias: string): boolean;
    /**
     * Get the Awilix binder based on the type of the
     * dependency.
     */
    private getAwilixBinder;
    /**
     * Register the binder in the Awilix container.
     */
    private register;
}

export { Ioc };
