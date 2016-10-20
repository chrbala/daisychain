export default execute => {
	const Chain = (bundle = []) => {
		const chain = (...next) => Chain([ 
			...bundle, 
			next,
		]);

		chain.execute = (...rest) => execute(bundle)(...rest);
		return chain;
	};

	return Chain();
};
