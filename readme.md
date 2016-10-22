# daisychain

## Usage

### What is it?
daisychain is a generic tool that takes a series of inputs and does *something* with them.

### Wait, what do I actually use it for?
daisychain was built in particular for immutably transforming data in a series of thunks, then performing side effects in a controlled way when they are needed.

### Huh?
Okay, let's get more concrete with a simple contrived example.

```javascript
import createChain from 'daisychain';

const flatten = arrayOfArrays => [].concat(...arrayOfArrays);
const sum = nums => nums.reduce(
  (runningTotal, current) => runningTotal + current
, 0);

const execute = bundle => multiplier => 
  sum(flatten(bundle)) * multiplier;

const multiplySum = createChain(execute);

// right now, the internal value of the chain is: []

// the chain creates a function that can be called an
// arbitrary number of times, 

const chain = 
  multiplySum
    (1)
    (2)
    (3)
;

// the internal value is [ [1], [2], [3] ]

// result = (1 + 2 + 3) * 2 = 12
const result = chain.execute(2);
```

Appends to the chain function immutably, so you can safely do this:

```javascript
const nums = 
  chain
    (1)
    (2)
    (3)
;

const numsFork = 
  nums
    (4)
    (5)
    (6)
;

// nums internal value: [ [1], [2], [3] ]
// numsFork internal value: [ [1], [2], [3], [4], [5], [6] ]
```

### How about a less contrived example?

```javascript
// note: this is a very simple transform created with createChain.
// it could even fit in a tweet! See src/transform if you're curious.
import { transform } from 'daisychain'

const sliceParams = url => url.slice(url.indexOf('?') + 1);
const splitParamString = paramString => paramString.split('&');
const paramsToTuples = params => params.map(param => param.split('='));

const tuplesMap = _transform => 
  tuples => tuples.map(tuple => tuple.map(value => _transform(value)));

const parseUrl = 
  transform
    (sliceParams)
    (splitParamString)
    (paramsToTuples)
    (tuplesMap(unescape))
;

const url = 'www.whatever.com?hello=world&key=value&expletive=%24%23@%21';
const parsed = parseUrl.execute(url);

/*
  parsed = [ 
    [ 'hello', 'world' ],
    [ 'key', 'value' ],
    [ 'expletive', '$#@!' ],
  ]
*/
```

Note that this chain creates the same result as:

```javascript
const parsed = mapToTuples(unescape)(
  paramsToTuples(
    splitParamString(
      sliceParams(url)
    )
  )
);
```

or

```javascript
let value = sliceParams(url);
value = splitParamString(value);
value = paramsToTuples(value);
value = mapToTuples(unescape)(value);
```
But of course the chain is much easier to read!

### What about side effects?
You can of course enact side effects with the results of the chains you create. But it's also appropriate to bind side effects to the chain in execute() instead of just returning a value. 

```javascript
const execute = bundle => (url, initialData) => {
  const processedData = processData(bundle, initialData);
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(processedData),
  });
};
```

### Anything else?
You can use as many arguments as you like in the chain, like so:

```javascript
const mixedTypes = 
  bundle
    (1, 'hello')
    (2, 'other', 'values')
    (3)
;

// mixedTypes internal value: [ [1, 'hello'], [2, 'other', 'values'], [3] ]

```
You can also use an arbitrary number of arguments when calling chain.execute().

## Roadmap
There isn't a huge amount of work to do on the code. If you read the source, it's quite small. The majority of changes in this project will probably be additions of common idioms made from daisychain and documentation on more best practices as it gets used more. I would also like to flow type the source.