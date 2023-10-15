const path = require('path');
const PugPlugin = require('pug-plugin');

// const PAGES = ['index']

const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

module.exports = {
  mode,
  target,
  devtool,
  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },
  entry: {index: './src/index.pug'},
  // devServer: {
  //   static: './dist',
  // },
  output: {
    path: path.join(__dirname, 'dist/'),
    publicPath: '/',
    clean: true,
    assetModuleFilename: './assets/images/[name].[contenthash:8][ext]'
  },
  resolve: {
    alias: {
      // use alias to avoid relative paths like `./../../images/`
      Images: path.join(__dirname, './src/images/'),
      Favicons: path.join(__dirname, './src/images/favicon'),
      Fonts: path.join(__dirname, './src/fonts/')
    }
  },
  plugins: [
    new PugPlugin({
      extractComments: true,
      pretty: true,
      js: {
        filename: 'js/[name].[contenthash:8].js',
      },
      css: {
        filename: 'css/[name].[contenthash:8].css',
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: PugPlugin.loader,
      },
      // force inline images containing `?inline` query
      {
        test: /\.(webp|svg)$/i,
        type: 'asset/inline',
        resourceQuery: /inline/,
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: [
          // devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [require('postcss-preset-env')],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        // test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        test: /\.woff2?$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext][query]'
        }
      },
      {
        test: /\.webmanifest$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75
              },
            }
          }
        ],
        type: 'asset/resource',
      },
      {
        test: /\.m?js$/i,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
							[
								'@babel/preset-env', 
							]
						],
          },
        },
      },
    ],
  },
};
