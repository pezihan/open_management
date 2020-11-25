module.exports = {
  devServer: {
    proxy: {
      '/open': {
        target: 'http://127.0.0.1:4000',
        //   ws: true,
        changeOrigin: true
      }
      // '/foo': {
      //   target: '<other_url>'
      // }
    }
  },
  // 基本路径 baseURL已经过时
  publicPath: './'
}
