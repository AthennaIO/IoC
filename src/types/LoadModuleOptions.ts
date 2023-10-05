/**
 * @athenna/ioc
 *
 * (c) João Lenon <lenon@athenna.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export type LoadModuleOptions = {
  /**
   * The parent URL that will be used in Module.resolve()
   * method. This option is useful to determined which
   * node_modules should be used to import the path.
   *
   * @default 'Path.toHref(Path.pwd() + sep)'
   */
  parentURL?: string

  /**
   * Automatically add the camel alias based on the
   * file name. If the file is using @Service() annotation
   * and the camelAlias is defined, the camelAlias defined
   * in the annotation will be used instead.
   *
   * @default true
   */
  addCamelAlias?: boolean
}
