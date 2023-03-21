/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * 判断 传入path是否为外部链接的地址
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
/* export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
} */

export function validMobile (str) {
  return /^1[3-9]\d{9}$/.test(str) // 校验手机号
}
