# @polyseam/barout

A tiny module which replaces values in a string with corresponding properties
from an object.

The unique property of the library is that the template string will be valid
typescript itself because you can wrap your literal with quotes and triple
braces.

```typescript
import {compile} from '@polyseam/barout';

const template = `
// the triple braces tells barout we should remove the surrounding quotes
const numbers = "{{{ myArray }}}";
console.log(Array.isArray(numbers)); // true

const greeting = "Hello, {{ whoToGreet }}!";
console.log(greeting); // Hello, World!
`

const renderScript = compile(template, {
  myArray: [1, 2, 3]
  whoToGreet: 'World'
});

console.log(renderScript);
// Output:
// const array = [1, 2, 3];
```
