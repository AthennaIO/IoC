/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Facade } from '#src'
import { Test, BeforeEach } from '@athenna/test'
import { BaseTest } from '#tests/helpers/BaseTest'
import type { Context } from '@athenna/test/types'
import { SumService } from '#tests/stubs/SumService'
import { REAL_METHODS } from '#src/constants/RealMethods'

export default class FacadeTest extends BaseTest {
  @BeforeEach()
  public async beforeEach() {
    ioc.bind('Athenna/Services/SumService', SumService)
  }

  @Test()
  public async shouldBeAbleToGetTheFacadeAlias({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('Athenna/Services/SumService')

    assert.deepEqual(Sum.getFacadeAlias(), 'Athenna/Services/SumService')
  }

  @Test()
  public async shouldBeAbleToCreateANewFacadeForSumService({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('Athenna/Services/SumService')

    assert.equal(Sum.get(), 0)
    assert.equal(Sum.number, 0)
    assert.equal(Sum.set(10).get(), 10)
    assert.instanceOf(Sum.set(10), SumService)
    assert.equal((await Sum.setAsync(10)).get(), 10)
    assert.instanceOf(await Sum.setAsync(10), SumService)
  }

  @Test()
  public async shouldBeAbleToSaveInstancesForLaterUsageUsingFacades({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('Athenna/Services/SumService')

    const sum = await Sum.set(10).set(10).setAsync(10)

    assert.equal(sum.get(), 30)
    assert.equal(sum.number, 30)
  }

  @Test()
  public async shouldReturnUndefinedWhenTheProviderKeyDoesNotExist({ assert }: Context) {
    const Sum = Facade.createFor<any>('Athenna/Services/SumService')

    assert.isUndefined(Sum.undefinedProperty)
  }

  @Test()
  public async shouldBeAbleToMockAndRestoreFacadeMethods({ assert }: Context) {
    const Sum = Facade.createFor<any>('Athenna/Services/SumService')

    Sum.fakeMethod('get', function (n = 0) {
      return this.number + n + 10
    })

    const mock = Sum.getMock()

    mock.expects('get').exactly(1).returns(10)

    assert.deepEqual(Sum.get(), 10)
    mock.verify()
    assert.deepEqual(Sum.get(1), 11)

    Sum.restoreMethod('get')

    assert.deepEqual(Sum.get(), 0)
  }

  @Test()
  public async shouldBeAbleToRemoveAllMockedMethodsFromTheFacadeAtOneTime({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('Athenna/Services/SumService')

    Sum.fakeMethod('get', () => 1)
      .fakeMethod('sum', number => number + 1)
      .fakeMethod('setAsync', () => Sum)

    assert.deepEqual(REAL_METHODS.size, 3)

    Sum.restoreAllMethods()

    assert.deepEqual(REAL_METHODS.size, 0)
  }

  @Test()
  public async shouldBeAbleToCallRestoreMethodEvenIfTheMethodIsNotMocked({ assert }: Context) {
    const Sum = Facade.createFor<SumService>('Athenna/Services/SumService')

    assert.doesNotThrows(() => Sum.restoreMethod('not-found'))
  }
}
