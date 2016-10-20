import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
	entry: 'src/index.js',
	dest: 'dist/index.js',
	format: 'cjs',
	plugins: [ 
		resolve({
			jsnext: true,
		}),
		commonjs(),
		babel({
			exclude: 'node_modules/**',
			babelrc: false,
			presets: ['es2015-rollup'],
		}),
	],
	exports: 'named',
};
