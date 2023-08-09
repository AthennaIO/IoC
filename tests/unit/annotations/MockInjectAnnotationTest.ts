/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { MockInject, type Mock } from '#src'
import { Test, type Context } from '@athenna/test'
import { BaseTest } from '#tests/helpers/BaseTest'
import { SumService } from '#tests/stubs/SumService'
import { OrderService } from '#tests/stubs/OrderService'
import { MissingServiceAnnotationException } from '#src/exceptions/MissingServiceAnnotationException'

export default class MockInjectAnnotationTest extends BaseTest {
  @Test()
  public async shouldBeAbleToResolveDependenciesUsingTheMockInjectAnnotationInTests() {
    const closure = async () => {
      await this.import('#tests/stubs/OrderService')

      class Test {
        @MockInject(OrderService)
        public orderServiceMock: Mock

        public shouldWork() {
          this.orderServiceMock.expects('find').returns([
            { id: 1, title: 'Order 1' },
            { id: 2, title: 'Order 2' },
            { id: 3, title: 'Order 3' },
          ])

          /**
           * The code bellow is the same of injecting
           * OrderService into a controller and calling
           * orderService.find() method.
           */
          ioc.use('App/Services/OrderService').find()

          this.orderServiceMock.verify()
        }
      }

      return Test
    }

    const Test = await closure()
    const test = new Test()

    test.shouldWork()
  }

  @Test()
  public async shouldThrowAnErrorIfTheDependencyDoesNotHaveServiceAnnotation({ assert }: Context) {
    const closure = async () => {
      await this.import('#tests/stubs/SumService')

      class Test {
        @MockInject(SumService)
        public sumServiceMock: Mock
      }

      return Test
    }

    await assert.rejects(closure, MissingServiceAnnotationException)
  }
}
