import { nodeResolve } from '@rollup/plugin-node-resolve'
import path from 'path'
import alias from '@rollup/plugin-alias'
import json from '@rollup/plugin-json'

export default {
	input: 'src/index.js',
	output: {
		name: 'Monitor', // window.VueReactivity
		format: 'umd',
		file: path.resolve('../example/dist/monitor.js'), // 输出的文件路径
		sourcemap: true, // 生成映射文件
	},
	plugins: [
		nodeResolve({
			extensions: ['.js'],
		}),
		alias({
			entries: [{ find: '@', replacement: './src' }],
		}),
		json(),
	],
}
