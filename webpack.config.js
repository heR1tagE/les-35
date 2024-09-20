  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const MiniCssExtractPlugin = require('mini-css-extract-plugin');
  const TerserPlugin = require('terser-webpack-plugin');
  const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
  const CopyWebpackPlugin = require('copy-webpack-plugin');
  const ESLintPlugin = require('eslint-webpack-plugin');
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

  module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    
    return {
      mode: isProduction ? 'production' : 'development',
      
      entry: './src/index.ts',
      target: 'web',

      // DevServer для автоматической перезагрузки
      devServer: {
        static: './dist',
        hot: true,
        port: 3000,
        open: true,
      },

      output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        assetModuleFilename: 'assets/[hash][ext][query]',
        clean: true,
      },

      // Работа с внешними CSS файлами, Sass, LESS и TypeScript
      module: {
        rules: [
          {
            // Работа с CSS и препроцессорами (Sass/SCSS и LESS)
            test: /\.(sa|sc|c)ss$/,
            use: [
              isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
              'css-loader',
              'postcss-loader',
              'sass-loader',
            ],
          },
          {
            test: /\.less$/,
            use: [
              isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
              'css-loader',
              'postcss-loader',
              'less-loader',
            ],
          },
          {
            // Компиляция TypeScript
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            // Транспиляция JavaScript с помощью Babel
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              },
            },
          },
          {
            // Работа с изображениями и шрифтами
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
          },
        ],
      },

      plugins: [
        new ESLintPlugin({ extensions: ['js', 'ts'] }),  // Проверка кода с ESLint
        new HtmlWebpackPlugin({
          template: './src/index.html',
        }),
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css',
        }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(__dirname, 'src/assets'),
              to: path.resolve(__dirname, 'dist/assets'),
            },
          ],
        }),
        ...(isProduction ? [new BundleAnalyzerPlugin()] : []), // Визуализация пакетов в production
      ],

      // Оптимизация для production
      optimization: {
        minimizer: [
          new TerserPlugin(),
          new CssMinimizerPlugin(),
        ],
        splitChunks: {
          chunks: 'all',
        },
      },

      // Настройка расширений для TS и JS файлов
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },
    };
  };
