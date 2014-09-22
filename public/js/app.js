'use strict';


// Declare app level module which depends on filters, and services
angular.module('reader', [
  'ui.router',
  'ui.bootstrap',
  'ngSanitize',
  'reader.filters',
  'reader.services',
  'reader.directives',
  'reader.controllers'
])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $stateProvider.
      state('home', {
        'url': '/home',
        'templateUrl': '/partials/home.html'
      })
      .state('home.register', {
        'url': '/register',
        'templateUrl': '/partials/register.html',
        'controller': 'RegisterController'
      })
      .state('home.login', {
        'url': '/login',
        'templateUrl': '/partials/login.html',
        'controller': 'LoginController'
      })
      .state('reader', {
        'url': '/reader',
        'templateUrl': '/partials/reader.html',
        'controller': 'FeedController'
      })
      .state('articles', {
        'url': '/articles',
        'templateUrl': '/partials/articles.html',
        'controller': 'ArticleController'
      });


    $urlRouterProvider.otherwise("/home/register");
  }]);