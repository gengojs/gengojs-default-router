/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * Router
 * This module parses the routes
 * and sets the dot notation
 * according to the path.
 */
import _ from 'lodash';
import cldr from 'cldr';
import debug from 'debug';

class Path {
  constructor(path) {
    this.path = path;
  }

  isLocale(str) {
    str = str.toLowerCase().replace('-', '_');
    // Compare the locales against cldr
    return _.contains(cldr.localeIds, str);
  }
  /* Converts the path to an Array */
  toArray(path) {
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
        if (!this.isLocale(path[1])) result.push(path[1]);
      }
    } else {
      // For every item in the path
      // check to see if it contains a version or
      // if its a regular name. then add it to the 
      // filtered array
      _.forEach(path, function(item) {
        //Make sure the path does not contain a locale
        if (!this.isLocale(item) || !/favicon\.ico/g.test(item))
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
        if (!this.isLocale(path[count]))
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
  }
  toDot(array) {
    array = array ? array : this.toArray();
    if (array.length > 1) return array.join().replace(/,/g, '.');
    else return array[0];
  }
}

class Router extends Path {
  constructor(path, enabled) {
    super(path);
    this.enabled = enabled;
  }
  isEnabled() {
    return this.enabled;
  }
}

export
default () => {
  'use strict';
  return {
    main: function(req) {
      // Set options
      var options = this.options.router;
      // Expose internal API
      if (req && options.enabled)
        this.router = new Router(req.path, this.utils, options.enabled);
      // Debug
      if (this.router && options.enabled)
        debug('default-router')('path:', this.router.route(),
          'toArray:', this.router.route().toArray(),
          'toDot:', this.router.route().toDot());
    },
    package: _.merge({
      type: 'router'
    }, require('./package')),
    defaults: require('./defaults'),
    // Export the class for
    // test purposes
    mock: Router
  };
};