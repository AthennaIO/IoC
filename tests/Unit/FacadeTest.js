/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'

import { Ioc, Facade } from '#src/index'
import { SumService } from '#tests/Stubs/SumService'

test.group('\n FacadeTest', group => {
  let ioc = new Ioc()

  group.each.setup(() => {
    ioc = new Ioc()

    ioc.bind('Athenna/Services/SumService', SumService)
  })

  test('should be able to create a new Facade for SumService', async ({ assert }) => {
    /** @type {SumService & typeof Facade} */
    const Sum = Facade.createFor('Athenna/Services/SumService')

    assert.equal(Sum.get(), 0)
    assert.equal(Sum.number, 0)
    assert.equal(Sum.set(10).get(), 10)
    assert.instanceOf(Sum.set(10), SumService)
    assert.equal((await Sum.setAsync(10)).get(), 10)
    assert.instanceOf(await Sum.setAsync(10), SumService)
  })

  test('should be able to save instances for latter usage using Facades', async ({ assert }) => {
    /** @type {SumService & typeof Facade} */
    const Sum = Facade.createFor('Athenna/Services/SumService')

    const sum = await Sum.set(10).set(10).setAsync(10)

    assert.equal(sum.get(), 30)
    assert.equal(sum.number, 30)
  })

  test('should be able to access methods from the Facade class when needed', async ({ assert }) => {
    /** @type {SumService & typeof Facade} */
    const Sum = Facade.createFor('Athenna/Services/SumService')

    assert.instanceOf(Sum.container, Ioc)
  })

  test('should return undefined when the provider key does not exist', async ({ assert }) => {
    /** @type {SumService & typeof Facade} */
    const Sum = Facade.createFor('Athenna/Services/SumService')

    assert.isUndefined(Sum.value)
  })
})
