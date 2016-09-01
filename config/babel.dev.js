module.exports = {
	babelrc: false,
	cacheDirectory: true,
	presets: [
		'babel-preset-es2015',
		'babel-preset-es2016',
		'babel-preset-es2017',
	].map(require.resolve),
	plugins: [
		'babel-plugin-syntax-trailing-function-commas',
		'babel-plugin-transform-class-properties',
		'babel-plugin-transform-object-rest-spread',
	].map(require.resolve).concat([
		[require.resolve('babel-plugin-transform-runtime'), {
			helpers: false,
			polyfill: false,
			regenerator: true
		}],
		[require.resolve("babel-plugin-transform-react-jsx"), {
			"pragma": "m"
		}],
		[require.resolve("babel-plugin-transform-strict-mode"), {
			"strict": true
		}]
	])
};