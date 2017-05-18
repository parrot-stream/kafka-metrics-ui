
var totalBrokersModule = angular.module('totalBrokers', ["HttpFactory"]);

totalBrokersModule.directive('totalBrokers', function(templates) {
  return {
    restrict: 'E',
    templateUrl: 'src/kafka-topics/dashboard-components/total-brokers/total-brokers.html',
    controller: 'TotalBrokersCtrl'
  };
});

totalBrokersModule.factory('BrokersBackendFactory', function (HttpFactory) {
    return {
        getBrokers: function (endpoint) {
           return HttpFactory.req('GET', endpoint + '/brokers');
        },
        getBrokersJMX: function (endpoint) {
          return HttpFactory.req('GET', endpoint + '/jmx/broker');
        }
    }
});

totalBrokersModule.controller('TotalBrokersCtrl', function ($scope, $log, $location, BrokersBackendFactory) {
  $scope.showBrokersDashboard = function () {
    console.log("showBrokersDashboard");
    $location.path("cluster/" + $scope.cluster.NAME + "/brokers", true);
  };

  // BrokersBackendFactory.getBrokers($scope.cluster.KAFKA_REST).then(
  //   function success(brokers) {
  //     $scope.totalBrokers = brokers.brokers.length;
      BrokersBackendFactory.getBrokersJMX($scope.cluster.KAFKA_LENSES_URL).then(
        function success(allBrokerJMX) {
          $scope.allBrokerJMX = allBrokerJMX;
        },
        function failure() {
          $scope.connectionFailure = true;
        });
    // },
    // function failure() {
    //   $scope.connectionFailure = true;
    // });

});