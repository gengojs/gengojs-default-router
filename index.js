/*jslint node: true, forin: true, jslint white: true, newcap: true*/

/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * accept-language.js
 * This module parses the routes
 * and sets the dot notation
 * according to the path.
 */
var _ = require('lodash');
var cldr = require('cldr');

// Helpers

function isLocale(str) {
  'use strict';
  str = str.toLowerCase().replace('-', '_');
  // Compare the locales against cldr
  return _.contains(cldr.localeIds, str);
}

// Router class
function Router(path) {
  'use strict';
  if (path) this.path = path;
}

// Router.route base class (inheritance hack)
function RouteBase(path) {
  'use strict';
  this.path = path;
  return this.path;
}

// Router prototype: isLocale
Router.prototype.isLocale = isLocale;

// Router prototype: route
Router.prototype.route = function() {
  'use strict';
  return (new RouteBase(this.path));
};



// Route.route prototype: toArray
RouteBase.prototype.toArray = function(path) {
  'use strict';
  path = path ? path.split('/') : this.path.split('/');
  var filtered = [],
    result = [];
  var version = /\d{1,2}(\.)\d{1,2}((\.)\d{1,2})?$/;
  if (path.length < 3) {
    // It's safe to say that path[0] will always be ''
    // so add the second '' and define it as the index
    if (path[1] === '') {
      result.push('index');
    } else {
      // Make sure the path does not contain a locale
      // and maybe something does exist besides ''? (precaution)
      if (!isLocale(path[1])) result.push(path[1]);
    }
  } else {
    // For every item in the path
    // check to see if it contains a version or
    // if its a regular name. then add it to the 
    // filtered array
    _.forEach(path, function(item) {
      //Make sure the path does not contain a locale
      if (!isLocale(item))
        if (item.match(version)) {
          // Prevent the version dots from being
          // interpreted as a dot notation
          filtered.push(item.replace('.', '*'));
        } else {
          filtered.push(item);
        }
    }, this);

    path = filtered;
    // Once we have filtered 
    for (var count = 1; count < path.length; count++) {
      // Make sure the path does not contain a locale
      if (!isLocale(path[count]))
        if (count === 1) {
          if (path[count] === '') result.push('index');
          else result.push(path[count]);
        } else {
          // Make sure nothing else is empty
          if (path[count] !== '') result.push(path[count]);
        }
    }
  }
  return result;
};

// Route.route prototype: toDot
RouteBase.prototype.toDot = function(array) {
  'use strict';
  array = array ? array : this.toArray();
  if (array.length > 1) return array.join().replace(/,/g, '.');
  else return array[0];
};

/* Let Router also inherit RouteBase's prototype */

// Router().toArray(path)
Router.prototype.toArray = RouteBase.prototype.toArray;
// Router().toDot(path)
Router.prototype.toDot = RouteBase.prototype.toDot;

// Ship it!
function router(req) {
  'use strict';
  /*jshint validthis:true*/

  // Set options
  var options = this.plugins._router.options;
  // Set defaults
  options = _.defaults(options || {}, require('./defaults'));
  // Expose internal API
  if (req && options.enabled) this.router = new Router(req, this.utils);
  // Debug
  if (this.router && options.enabled)
    this.utils.debug('route')('path:', this.router.route(),
      'toArray:', this.router.route().toArray(),
      'toDot:', this.router.route().toDot());
}

module.exports = function() {
  'use strict';
  var pkg = require('./package');
  pkg.type = 'api';
  return {
    main: router,
    package: pkg
  };
};