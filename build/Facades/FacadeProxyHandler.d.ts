import { SinonMock } from 'sinon';
import { Ioc } from '#src/Container/Ioc';
import { Facade } from '#src/Facades/Facade';
import { Except } from '@athenna/common';

/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

type FacadeType<T = any> = Except<FacadeProxyHandler, 'get' | '__callStatic'> & T;
declare class FacadeProxyHandler<T = any> {
    /**
     * The container to resolve dependencies.
     */
    private container;
    /**
     * The facade accessor that will be used
     * to resolve the dependency inside the
     * service container.
     */
    private facadeAccessor;
    /**
     * The mocked provider instance that will
     * be used with Sinon.
     */
    private mockedProvider;
    /**
     * Creates a new instance of FacadeProxyHandler.
     */
    constructor(container: Ioc, facadeAccessor: string);
    /**
     * Get the facade alias registered to resolve deps
     * from the Ioc.
     */
    getFacadeAlias(): string;
    /**
     * Get the facade provider resolved from the Ioc.
     */
    getFacadeProvider(): T;
    /**
     * Set a fake return value in the Facade method.
     */
    fakeMethod(method: string, returnValue: any): FacadeType<T>;
    /**
     * Restore the mocked method to his default state.
     */
    restoreMethod(method: string): FacadeType<T>;
    /**
     * Restore all the mocked methods of this facade to
     * their default state.
     */
    restoreAllMethods(): FacadeType<T>;
    /**
     * Return a sinon mock instance.
     */
    getMock(): SinonMock;
    /**
     * Method called by Proxy everytime a new property is called.
     */
    get(facade: typeof Facade, key: string): any;
    /**
     * Returns the provider method with a Proxy applied in apply.
     * This way we guarantee that we are working with
     * the same instance when a Facade method returns this.
     */
    __callStatic(facade: typeof Facade, key: string): any;
}

export { FacadeProxyHandler, FacadeType };
