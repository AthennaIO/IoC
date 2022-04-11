/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '../../src/Ioc'
import { SumService } from '../Stubs/SumService'
import { Facade } from '../../src/Facades/Facade'

describe('\n FacadeTest', () => {
  let ioc = new Ioc()

  beforeEach(() => {
    ioc = new Ioc()

    ioc.bind('Athenna/Services/SumService', SumService)
  })

  it('should be able to create a new Facade for SumService', async () => {
    const Sum = Facade.createFor<SumService>('Athenna/Services/SumService')

    expect(Sum.get()).toBe(0)
    expect(Sum.number).toBe(0)
    expect(Sum.set(10).get()).toBe(10)
    expect(Sum.set(10)).toBeInstanceOf(SumService)
    expect((await Sum.setAsync(10)).get()).toBe(10)
    expect(await Sum.setAsync(10)).toBeInstanceOf(SumService)
  })

  it('should be able to save instances for latter usage using Facades', async () => {
    const Sum = Facade.createFor<SumService>('Athenna/Services/SumService')

    const sum = await Sum.set(10).set(10).setAsync(10)

    expect(sum.get()).toBe(30)
    expect(sum.number).toBe(30)
  })
})
