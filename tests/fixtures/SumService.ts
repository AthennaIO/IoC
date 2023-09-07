/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class SumService {
  public number = 0

  /**
   * Set a number.
   */
  public set(number: number): this {
    this.number = number + this.number

    return this
  }

  /**
   * Set a number.
   */
  public async setAsync(number: number): Promise<SumService> {
    this.number = number + this.number

    return this
  }

  /**
   * Get the number
   */
  public get(): number {
    return this.number
  }
}
