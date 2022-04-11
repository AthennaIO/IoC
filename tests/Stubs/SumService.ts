/**
 * @athennaio/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class SumService {
  public number = 0

  set(number: number): this {
    this.number = number + this.number

    return this
  }

  async setAsync(number: number): Promise<this> {
    this.number = number + this.number

    return this
  }

  get(): number {
    return this.number
  }
}
