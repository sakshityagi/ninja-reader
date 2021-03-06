'use strict';

/* Filters */

angular.module('reader.filters', []).
  filter('interpolate', ['version', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    };
  }])
  .filter('truncate', function () {
    return function (text, length, end) {
      if (isNaN(length))
        length = 10;

      if (end === undefined)
        end = "...";

      if (text.length <= length || text.length - end.length <= length) {
        return text;
      }
      else {
        return String(text).substring(0, length - end.length) + end;
      }
    };
  });
