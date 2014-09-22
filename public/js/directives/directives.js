'use strict';

/* Directives */


angular.module('reader.directives', []).
  directive('appVersion', ['version', function (version) {
    return function (scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('checkbox', [function(){
    return {
      link: function(scope, elem, attrs, model){
        $(elem).on('click', function(){
          console.log(elem[0].checked, elem[0].value, scope.selectedArticles.indexOf(scope.item.id));
          var index = scope.selectedArticles.indexOf(elem[0].value);
          if(elem[0].checked && index === -1){
            scope.selectedArticles.push(elem[0].value);
          }
          if(!elem[0].checked && index !== -1){
            scope.selectedArticles.splice(index, 1);
          }
        });
      }
    }
  }]);
