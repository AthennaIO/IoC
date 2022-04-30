/**
 * @athennaio/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class SumService {
  number = 0

  /**
   * Set a number.
   *
   * @param {number} number
   * @return {SumService}
   */
  set(number) {
    this.number = number + this.number

    return this
  }

  /**
   * Set a number.
   *
   * @param {number} number
   * @return {Promise<SumService>}
   */
  async setAsync(number) {
    this.number = number + this.number

    return this
  }

  /**
   * Get the number
   *
   * @return {number}
   */
  get() {
    return this.number
  }
}
