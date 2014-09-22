'use strict';

/* Controllers */

angular.module('reader.controllers', [])
  .controller('MasterController', ['$scope', '$rootScope', '$http', function ($scope, $rootScope, $http) {
    console.log('Master Controller initiated!');
    $rootScope.currentUser = null;
    $http.get('/auth/current').success(function (response) {
      console.log(response.data);
      if (response.success) {
        $rootScope.currentUser = response.data;
      }
    })
  }])
  .controller('RegisterController', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
    console.log('Register Controller initiated!');
    if ($rootScope.currentUser) {
      $location.path('/reader');
    }
    $scope.registerSuccess = false;
    $scope.registerFail = false;
    $scope.infoMissing = false;
    $scope.register = function () {
      console.log($scope.fullName, $scope.email, $scope.password);
      if ($scope.fullName && $scope.email && $scope.password) {
        $http.post('/auth/register', {
          fullName: $scope.fullName,
          email: $scope.email,
          password: $scope.password
        }).success(function (response) {
            if (response.success) {
              $scope.registerSuccess = true;
            }
            else
              $scope.registerFail = true;
          })
      }
      else
        $scope.infoMissing = true;
    };

  }])
  .controller('LoginController', ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
    console.log('Login Controller initiated!');
    if ($rootScope.currentUser) {
      $location.path('/reader');
    }
    $scope.loginFail = false;
    $scope.login = function () {
      $http.post('/auth/login', {
        email: $scope.email,
        password: $scope.password
      }).success(function (response) {
          console.log(response);
          $location.path('/reader');
        }).error(function (response, responseCode) {
          $scope.loginFail = true;
          console.log(response, responseCode);
        })
    };

  }])
  .controller('FeedController', ['$scope', '$http', '$rootScope', '$modal', '$log', '$location',
    function ($scope, $http, $rootScope, $modal, $log, $location) {
      console.log('Results Controller initiated!');
      $rootScope.selectedArticles = [];
      $http.get('/auth/current').success(function (response) {
        console.log(response.data);
        if (response.success) {
          $rootScope.currentUser = response.data;
        }
      });

      $scope.processFeedLink = function () {
        $http.post('/feed/process', {
          feedLink: $scope.rssFeedLink
        }).success(function (response) {
            console.log(response);
            var modalInstance = $modal.open({
              templateUrl: 'myModalContent.html',
              controller: 'ModalInstanceCtrl',
              size: undefined,
              resolve: {
                items: function () {
                  return response.data;
                }
              }
            });
            modalInstance.result.then(function (selectedItem) {
              $log.info(selectedItem);
              $scope.$broadcast('fetchDetails', selectedItem);
              $rootScope.selectedArticles = [];
              $location.path('/articles');
            }, function () {
              $log.info('Modal dismissed at: ' + new Date());
            });
          }).error(function (response, responseCode) {
            console.log(response, responseCode);
          })
      };

      $scope.$on('fetchDetails', function (e, items) {
        $http.post('/feed/process/articles', {
          articles: items,
          feedURL: $scope.rssFeedLink
        }).success(function (response) {
            console.log(response);
          });
      });
    }])
  .controller('ModalInstanceCtrl', ['$scope', '$modalInstance', 'items', '$rootScope',
    function ($scope, $modalInstance, items, $rootScope) {
      $scope.items = items;
      $scope.fetchDetails = function () {
        $modalInstance.close($rootScope.selectedArticles);
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ])
  .controller('ArticleModalCtrl', ['$scope', '$modalInstance', 'article', 'description', 'dateAdded', '$rootScope',
    function ($scope, $modalInstance, article, description, dateAdded, $rootScope) {
      $scope.article = article;
      $scope.description = description;
      $scope.dateAdded = dateAdded;

      $scope.close = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ])
  .controller('ArticleController', ['$scope', '$rootScope', '$http', '$modal', '$interval',
    function ($scope, $rootScope, $http, $modal, $interval) {
      $rootScope.articles = [];

      fetchArticles();
      $interval(fetchArticles, 5000, 5);


      function fetchArticles() {
        $http.get('/feed/fetch/articles').success(function (response) {
          console.log(response.data);
          if (response.success) {
            $rootScope.articles = response.data;
          }
        });
      }


      $scope.showDetails = function (article) {
        $scope.description = article.description;
        $scope.dateAdded = new Date(article.dateAdded).toLocaleString();
        var modalInstance = $modal.open({
          templateUrl: 'articleContent.html',
          controller: 'ArticleModalCtrl',
          size: undefined,
          resolve: {
            article: function () {
              return article;
            },
            description: function () {
              return $scope.description;
            },
            dateAdded: function () {
              return $scope.dateAdded;
            }
          }
        });
      };

      $scope.deleteArticle = function (article) {
        $http.delete('/feed/article/' + article._id).success(function (response) {
          console.log(response);
          if (response.success) {
            var index = $rootScope.articles.indexOf(article)
            $rootScope.articles.splice(index, 1);
          }
        });
      };
    }
  ])