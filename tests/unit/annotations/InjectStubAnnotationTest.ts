/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { BaseTest } from '#tests/helpers/BaseTest'
import { InjectStub } from '#src/annotations/InjectStub'
import { StringHelper } from '#tests/fixtures/StringHelper'
import { StringHelperFake } from '#tests/fixtures/StringHelperFake'
import { Test, type Stub, type Context, type StubInstance } from '@athenna/test'

export default class InjectStubAnnotationTest extends BaseTest {
  @Test()
  public async shouldBeAbleToRegisterStubbedServicesUsingInjectStubAnnotation({ assert }: Context) {
    class Test {
      @InjectStub(StringHelper)
      public stringHelperStub: Stub
    }

    const test = new Test()

    assert.isDefined(test.stringHelperStub)
    assert.isTrue(ioc.has('stringHelper'))
  }

  @Test()
  public async shouldBeAbleToUseStubExpectationAPIWithTheInjectedStub({ assert }: Context) {
    class Test {
      @InjectStub(StringHelper)
      public stringHelperStub: StubInstance<StringHelper>
    }

    const test = new Test()

    const stringHelper = ioc.safeUse('stringHelper')

    test.stringHelperStub.run.returns('Hello World')

    assert.equal(stringHelper.run(), 'Hello World')
    assert.calledOnce(stringHelper.run)
    assert.calledOnce(test.stringHelperStub.run)
  }

  @Test()
  public async shouldBeAbleToRegisterFakeServicesForAnAliasUsingInjectStubAnnotation({ assert }: Context) {
    class Test {
      @InjectStub(StringHelperFake)
      public stringHelperStub: Stub
    }

    const test = new Test()

    assert.isDefined(test.stringHelperStub)
    assert.isTrue(ioc.has('stringHelper'))
  }
}
