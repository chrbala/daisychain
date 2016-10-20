import createChain from '../createChain';

export default createChain(bundle => initialValue => 
	bundle.reduce((curr, [transform]) =>
		transform(curr), initialValue
	)
);
