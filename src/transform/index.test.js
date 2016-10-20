import test from 'ava';

import transform from './';

test('transform', t => {
	const actual = transform
		(() => 'hello')
		(val => val + ' world!')
		.execute();
	const expected = 'hello world!';

	t.is(actual, expected);
});

// this is a simple demonstration that you can flatten a chain to
// a simple function, which could then be used as a transform in
// a different chain
test('flatten transforms', t => {
	const append = appendVal => data => data + appendVal;
	const append123 = transform
		(append('1'))
		(append('2'))
		(append('3'))
	;

	const flattenedAppend123 = append123.execute;
	const actual = flattenedAppend123('hello');
	const expected = 'hello123';
	
	t.is(actual, expected);
});
