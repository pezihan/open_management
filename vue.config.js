module.exports = {
  css: {
    extract: false
  },
  // devServer: {  // 解决跨域问题（目前服务器端已设置允许跨域）
  //   proxy: {
  //     '/open': {
  //       target: 'http://127.0.0.1:4000',
  //       //   ws: true,
  //       changeOrigin: true
  //     }
  //     // '/foo': {
  //     //   target: '<other_url>'
  //     // }
  //   }
  // },
  // 基本路径 baseURL已经过时
  publicPath: './'
}
