var totalRestModule = angular.module('totalRest', ["HttpFactory"]);

totalRestModule.directive('totalRest', function (templates) {
  return {
    restrict: 'E',
    templateUrl: 'src/kafka-topics/dashboard-components/total-rest/total-rest.html',
    controller: 'TotalRestCtrl'
  };
});

totalRestModule.factory('RestBackendFactory', function (HttpFactory) {
  return {
    getBrokers: function (endpoint) {
      return HttpFactory.req('GET', endpoint + '/brokers');
    },
    getSchemaRegistryJMX: function (endpoint) {
      return HttpFactory.req('GET', endpoint + '/jmx/schemaRegistry');
    }
  }
});

totalRestModule.controller('TotalRestCtrl', function ($scope, $log, $location, RestBackendFactory) {
  $scope.showSchemaRegistryDashboard = function () {
    console.log("showSchemaRegistryDashboard");
    $location.path("cluster/" + $scope.cluster.NAME + "/schemas", true);
  };

  // BrokersBackendFactory.getBrokers($scope.cluster.KAFKA_REST).then(
  //   function success(brokers) {
  //     $scope.totalBrokers = brokers.brokers.length;
  RestBackendFactory.getSchemaRegistryJMX($scope.cluster.KAFKA_LENSES_URL).then(
    function success(allSchemaRegistryJMX ) {
      $scope.allSchemaRegistryJMX = allSchemaRegistryJMX ;
    },
    function failure() {
      $scope.connectionFailure = true;
    });
  // },
  // function failure() {
  //   $scope.connectionFailure = true;
  // });

});