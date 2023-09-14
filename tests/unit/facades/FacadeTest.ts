/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Facade } from '#src'
import { BaseTest } from '#tests/helpers/BaseTest'
import { SumService } from '#tests/fixtures/SumService'
import { Test, BeforeEach, type Context } from '@athenna/test'

export default class FacadeTest extends BaseTest {
  @BeforeEach()
  public async beforeEach() {
    ioc.bind('SumService', SumService)
    ioc.singleton('SumServiceSingleton', SumService)
  }

  @Test()
  public async shouldBeAbleToGetTheFacadeAlias({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('SumService')

    assert.deepEqual(Sum.facadeAccessor, 'SumService')
  }

  @Test()
  public async shouldBeAbleToCreateANewFacadeForSumService({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('SumService')

    assert.equal(Sum.get(), 0)
    assert.equal(Sum.number, 0)
    assert.equal(Sum.set(10).get(), 10)
    assert.instanceOf(Sum.set(10), SumService)
    assert.equal((await Sum.setAsync(10)).get(), 10)
    assert.instanceOf(await Sum.setAsync(10), SumService)
  }

  @Test()
  public async shouldBeAbleToSaveInstancesForLaterUsageUsingFacades({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('SumService')

    const sum = await Sum.set(10).set(10).setAsync(10)

    assert.equal(sum.get(), 30)
    assert.equal(sum.number, 30)
  }

  @Test()
  public async shouldBeAbleToFreezeAndUnfreezeTheServiceInstanceInTheFacade({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('SumService')

    Sum.freeze()
    Sum.number = 1000

    assert.deepEqual(Sum.number, 1000)

    Sum.unfreeze()

    assert.deepEqual(Sum.number, 0)
  }

  @Test()
  public async shouldBeAbleToGetTheFreezedServiceInstanceWhenFreezingIt({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('SumService')

    Sum.freeze()

    const sumService = Sum.getFreezedProvider()

    assert.deepEqual(sumService.get(), 0)
  }

  @Test()
  public async shouldBeAbleToSetValuesInTheFacadesProperties({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('SumServiceSingleton')

    Sum.number = 1000

    assert.equal(Sum.number, 1000)
  }

  @Test()
  public async shouldBeAbleToSetValuesInTheFacadeStubbedInstanceProperties({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('SumService')

    Sum.stub()
    Sum.number = 1000

    Sum.get = function () {
      return this.number + 1
    }

    assert.equal(Sum.get(), 1001)
    assert.equal(Sum.number, 1000)
  }

  @Test()
  public async shouldBeAbleToSetValuesInTheFacadeServiceProperties({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('SumService')

    Sum.stub()
    Sum.number = 1000

    Sum.get = function () {
      return this.number + 1
    }

    assert.equal(Sum.get(), 1001)
    assert.equal(Sum.number, 1000)
  }

  @Test()
  public async shouldReturnUndefinedWhenTheProviderKeyDoesNotExist({ assert }: Context) {
    const Sum = Facade.createFor<any>('SumService')

    assert.isUndefined(Sum.undefinedProperty)
  }

  @Test()
  public async shouldBeAbleToCreateAStubForTheFacade({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('SumService')

    const stub = Sum.stub()

    stub.get.returns(100)

    assert.deepEqual(Sum.get(), 100)
    assert.returned(stub.get, 100)

    Sum.restore()

    assert.deepEqual(Sum.get(), 0)
  }

  @Test()
  public async shouldBeAbleToGetTheFreezedServiceInstanceWhenStubbingIt({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('SumService')

    const stub = Sum.stub()

    stub.get.returns(100)

    assert.deepEqual(Sum.get(), 100)
    assert.returned(stub.get, 100)
    assert.calledTimes(stub.get, 1)

    const sumService = Sum.getFreezedProvider()

    assert.deepEqual(sumService.get(), 100)
    assert.returned(stub.get, 100)
    assert.calledTimes(stub.get, 2)

    Sum.restore()

    assert.deepEqual(Sum.get(), 0)
  }

  @Test()
  public async shouldBeAbleToCreateStubsForFacadeMethods({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('SumService')

    const stub = Sum.when('get').return(100)

    assert.deepEqual(Sum.get(), 100)
    assert.returned(stub, 100)

    Sum.restore()

    assert.deepEqual(Sum.get(), 0)
  }
}
