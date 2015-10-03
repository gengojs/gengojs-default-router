# gengojs-default-router

The default router plugin for gengo.js.

[![Build Status](https://travis-ci.org/gengojs/plugin-router.svg?branch=master)](https://travis-ci.org/gengojs/plugin-router)

An example usage with options is:

```js

var gengo = require('gengojs');
var router = require('gengojs-default-router');

/* In whatever framework you are using: */

// I'll use express for an example
// but it shouldn't matter

var app = require('express')();
app.use(gengo({
   // Specify the type
   // of option to modify
	router:{
		/* options */
	}
},/*router()*/));
```


## Options

```json
{
	"enabled":false
}
```
## Internal API

* `this.router.toArray()` returns the path as an array

* `this.router.toDot()` returns the path as a dotted string

* `this.router.isEnabled()` returns a boolean based on the enabled option

**Example**:

```js
// Plugin ship
function ship(){
	// Context
	this.router.toArray();
	this.router.toDot();
	this.router.isEnabled();
}
```

## Dependencies

Not Applicable

## Debug

Unix:

```bash
DEBUG=gengo.router
```
Windows:

```bash
SET DEBUG=gengo.router
```

## Contribute

Feel free to contribute or even fork the project.
This plugin has been written in ES6 and can be seen under lib/index.js.
