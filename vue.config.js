const webpack = require('webpack')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const externals = {
	'element-ui':'ELEMENT',
	'vue': 'Vue',
	'vue-router': 'VueRouter',
	'vuex': 'Vuex',
	'axios': 'axios',
	'JsSIP':'JsSIP'
}

module.exports = {
	publicPath:process.env.NODE_ENV === 'production'
    ? '/assistance/' //这里是打包正式配置 eg: outbound.ynt.ai:7001/crm/#/login
    : '/',

	outputDir: 'dist',
	// productionSourceMap: false,

	chainWebpack: config => {
		config.externals(externals)
		config.resolve.extensions.merge(['.js', '.vue', '.json', '.less'])
		config.resolve.alias.set('@@', path.resolve(__dirname, './public'))
		config.resolve.alias.set('@', path.resolve(__dirname, './src'))
	},

    devServer: {
        host: '0.0.0.0',
        port:  8085,
        https: false,
        hotOnly: false,
        // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
        proxy: {
            '^/api/': {
				// target: 'http://10.1.20.178:8008/assistance/',//费晓

				// target: 'http://10.1.20.149:8008/',//王斌
				// target: 'http://10.1.20.182:8008/',//章刚
				
				target: 'http://192.168.88.51:8008/assistance/',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
        }, // string | Object
        before: app => {}
    },

	configureWebpack: {
		optimization: {
			minimizer: [
				new TerserPlugin({
					sourceMap: true, // Must be set to true if using source-maps in production
					terserOptions: {
						compress: {
							drop_console: process.env.NODE_ENV === 'production' ? true : false,
							// drop_console: process.env.NODE_ENV === 'production' ? true : false,
						},
					},
				}),
			],
		}
	},

	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'less',
			patterns: []
			// patterns: [path.resolve(__dirname, './src/less/index.less')]
		}
	},
	pwa: {
			iconPaths: {
			  favicon32: './favicon.ico',
			  favicon16: './favicon.ico',
			  appleTouchIcon: './favicon.ico',
			  maskIcon: './favicon.ico',
			  msTileImage: './favicon.ico'
			}
		  },
}
