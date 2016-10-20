import test from 'ava';

import createChain from './';

test('createChain basic', t => {
	const chain = createChain(f => () => f);
	
	const actual = chain(1)(2)(3).execute();
	const expected = [[1], [2], [3]];

	t.deepEqual(actual, expected);
});

test('createChain multiple args', t => {
	const chain = createChain(f => () => f);

	const expected = [[1, 1.5], [2, 2.5], [3]];

	const actual = chain(1, 1.5)(2, 2.5)(3).execute();
	t.deepEqual(actual, expected);
});

test('createChain fork', t => {
	let actual;
	let expected;
	const chain = createChain(f => () => f);
	
	const chainTemplate = chain(1)(2)(3);

	actual = chainTemplate('a').execute();
	expected = [ [1], [2], [3], ['a'] ];
	t.deepEqual(actual, expected);

	actual = chainTemplate('b').execute();
	expected = [ [1], [2], [3], ['b'] ];
	t.deepEqual(actual, expected);
});

test('createChain fork out of order', t => {
	let actual;
	let expected;
	const chain = createChain(f => () => f);
	
	const chainTemplate = chain(1)(2)(3);

	const chainA = chainTemplate('a');

	actual = chainTemplate('b').execute();
	expected = [ [1], [2], [3], ['b'] ];
	t.deepEqual(actual, expected);

	actual = chainA.execute();
	expected = [ [1], [2], [3], ['a'] ];
	t.deepEqual(actual, expected);
});

test('createChain fork multiple levels', t => {
	let actual;
	let expected;
	const chain = createChain(f => () => f);
	
	const chainTemplate = chain(1)(2)(3);

	actual = chainTemplate.execute();
	expected = [ [1], [2], [3] ];
	t.deepEqual(actual, expected);

	actual = chainTemplate(4).execute();
	expected = [ [1], [2], [3], [4] ];
	t.deepEqual(actual, expected);
});

test('createChain fork multiple levels out of order', t => {
	let actual;
	let expected;
	const chain = createChain(f => () => f);
	
	const chainTemplate = chain(1)(2)(3);

	actual = chainTemplate(4).execute();
	expected = [ [1], [2], [3], [4] ];
	
	actual = chainTemplate.execute();
	expected = [ [1], [2], [3] ];
	t.deepEqual(actual, expected);
});

test('createChain test execute', t => {
	const chain = createChain(bundle => options => ({ bundle, options }));
	
	const actual = chain(1)(2)(3).execute({ doSomething: true });
	const expected = {
		bundle: [[1], [2], [3]],
		options: { doSomething: true },
	};

	t.deepEqual(actual, expected);
});
