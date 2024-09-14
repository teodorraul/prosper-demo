const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.tsx',
	mode: 'development',
	output: {
		filename: 'bundle.[fullhash].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: process.env.IS_DEVELOPMENT ? "/" : process.env.SUBDIR,
	},
	devServer: {
		historyApiFallback: true,
	},
	plugins: [
		new CopyPlugin({
			patterns: [{ from: 'static', to: '' }],
		}),
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
		new webpack.DefinePlugin({
			'process.env.SUPABASE_URL': JSON.stringify(
				process.env.SUPABASE_URL
			),
			'process.env.SUPABASE_ANON_KEY': JSON.stringify(
				process.env.SUPABASE_ANON_KEY
			),
			'process.env.IS_DEVELOPMENT': process.env.IS_DEVELOPMENT,
			// This enables `/subdir/<APP>` as root deployments
			'process.env.ROOT_PATH': JSON.stringify(
				process.env.SUBDIR
			)
		}),
		new VanillaExtractPlugin(),
		new MiniCssExtractPlugin(),
	],
	resolve: {
		modules: [__dirname, 'src', 'node_modules'],
		extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
	},
	module: {
		rules: [
			{
				test: /\.(js|ts)x?$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				exclude: /node_modules/,
				use: ['file-loader'],
			},
			{
				test: /\.css$/i,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: require.resolve('css-loader'),
						options: {
							url: false,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								config: './postcss.config.js',
							},
						},
					},
				],
			},
		],
	},
};
