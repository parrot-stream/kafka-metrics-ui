var angular = require('angular');
var angularAPP = angular.module('angularAPP');

var HomeCtrl = function ($scope, $rootScope, BrokersBackendFactory) {

  $rootScope.showList = true;

  $scope.$on('$routeChangeSuccess', function () {
    //$scope.kafkaRest = env.getSelectedCluster().KAFKA_REST;
  });

  BrokersBackendFactory.getBrokersJMX($scope.cluster.KAFKA_LENSES_URL).then(
    function success(allBrokerJMX) {
      $scope.allBrokerJMX = allBrokerJMX;
    },
    function failure() {
      $scope.connectionFailure = true;
    });

};

// HomeCtrl.$inject = ['$scope', '$rootScope', 'BrokersBackendFactory', 'env'];

angularAPP.controller('HomeCtrl', HomeCtrl);