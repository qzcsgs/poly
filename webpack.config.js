const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ip = require('ip').address()

module.exports = {
  entry: './src/js/app.js',
  output: {
    filename: 'app.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  // server
  devServer: {
    contentBase: __dirname + '/dist',
    host: ip
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" }
      ]
    },
    {
      test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'
    }
    ]
  },
  plugins: [
    // 加入 html 模板任务
    new HtmlWebpackPlugin({
      // 模板文件
      template: './src/index.html',
      // 打包后文件名称，会自动放到 output 指定的 dist 目录
      filename: 'index.html'
    }),
    new UglifyJsPlugin(),
    new CleanWebpackPlugin(['dist'])
  ]
}
