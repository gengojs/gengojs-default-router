# gengojs-default-router

The default router plugin for gengo.js, the best i18n library for Node.

[![Build Status](https://travis-ci.org/iwatakeshi/gengojs-default-router.svg?branch=master)](https://travis-ci.org/iwatakeshi/gengojs-default-route)

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
The default router is already included in gengojs so you should not have to require it.


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

None

## Debug

Unix:

```bash
DEBUG=default-router
```
Windows:

```bash
SET DEBUG=default-router
```

## Contribute

Feel free to contribute or even fork the project.
This plugin has been written in ES6 and can be seen under lib/index.js.
