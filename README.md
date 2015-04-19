# gengojs-default-router

The default router plugin for gengo.js, the best i18n library for Express, Koa, Hapi.*

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


##Options

```json
{
	"enabled":false
}
```
##Internal API

`toArray()` returns the path as an array

`toDot()` returns the path as a dotted string

`isEnabled()` returns a boolean based on the enabled option

##Dependencies

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