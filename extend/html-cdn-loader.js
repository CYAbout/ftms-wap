/**
 * 图片地址替换
 * 相对路径替换为cdn地址
 */
const apiConfig = require('../api.config')
const isProdMode = Object.is(process.env.NODE_ENV, 'production')

module.exports = source => {
  if (isProdMode) {
    source = source.replace(/src="\/images\//g, `src="${apiConfig.cdnUrl}/images/`)
    // source = source.replace(/src="\/partials\//g, `src="${apiConfig.cdnUrl}/partials/`);
  }
  return source
}
