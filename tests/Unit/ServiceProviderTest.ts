/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Ioc } from '../../src/Ioc'
import { HelpersProvider } from '../Stubs/HelpersProvider'

describe('\n ServiceProviderTest', () => {
  let ioc = new Ioc()

  beforeEach(() => (ioc = new Ioc().reconstruct()))

  it('should be able to create custom service providers', async () => {
    await new HelpersProvider().boot()

    expect(ioc.use('Helpers/NewStringHelper')).toBeTruthy()
  })
})
