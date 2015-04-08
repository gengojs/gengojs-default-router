'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
/**
 * Takeshi Iwana aka iwatakeshi
 * MIT 2015
 * Router
 * This module parses the routes
 * and sets the dot notation
 * according to the path.
 */

var _import = require('lodash');

var _import2 = _interopRequireWildcard(_import);

var _cldr = require('cldr');

var _cldr2 = _interopRequireWildcard(_cldr);

var _debug = require('debug');

var _debug2 = _interopRequireWildcard(_debug);

var Path = (function () {
  function Path(path) {
    _classCallCheck(this, Path);

    this.path = path;
  }

  _createClass(Path, [{
    key: 'isLocale',
    value: function isLocale(str) {
      str = str.toLowerCase().replace('-', '_');
      // Compare the locales against cldr
      return _import2['default'].contains(_cldr2['default'].localeIds, str);
    }
  }, {
    key: 'toArray',

    /* Converts the path to an Array */
    value: function toArray(path) {
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
        _import2['default'].forEach(path, function (item) {
          //Make sure the path does not contain a locale
          if (!this.isLocale(item) || !/favicon\.ico/g.test(item)) if (item.match(version)) {
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
          if (!this.isLocale(path[count])) if (count === 1) {
            if (path[count] === '') result.push('index');else result.push(path[count]);
          } else {
            // Make sure nothing else is empty
            if (path[count] !== '') result.push(path[count]);
          }
        }
      }
      return result;
    }
  }, {
    key: 'toDot',
    value: function toDot(array) {
      array = array ? array : this.toArray();
      if (array.length > 1) {
        return array.join().replace(/,/g, '.');
      } else {
        return array[0];
      }
    }
  }]);

  return Path;
})();

var Router = (function (_Path) {
  function Router(path, enabled) {
    _classCallCheck(this, Router);

    _get(Object.getPrototypeOf(Router.prototype), 'constructor', this).call(this, path);
    this.enabled = enabled;
  }

  _inherits(Router, _Path);

  _createClass(Router, [{
    key: 'isEnabled',
    value: function isEnabled() {
      return this.enabled;
    }
  }]);

  return Router;
})(Path);

exports['default'] = function () {
  'use strict';
  var pkg = require('./package');
  pkg.type = 'router';
  return {
    main: function router(req) {
      // Set options
      var options = this._router.options;
      // Set defaults
      options = this._router.options = _import2['default'].defaults(options || {}, require('./defaults'));
      // Expose internal API
      if (req && options.enabled) this.router = new Router(req.path, this.utils, options.enabled);
      // Debug
      if (this.router && options.enabled) _debug2['default']('default-router')('path:', this.router.route(), 'toArray:', this.router.route().toArray(), 'toDot:', this.router.route().toDot());
    },
    'package': pkg,
    // Export the class for
    // test purposes
    mock: Router
  };
};

module.exports = exports['default'];