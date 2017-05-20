var totalSchemasModule = angular.module('totalSchemas', ["HttpFactory"]);

totalSchemasModule.directive('totalSchemas', function (templates) {
  return {
    restrict: 'E',
    templateUrl: 'src/kafka-topics/dashboard-components/total-schemas/total-schemas.html',
    controller: 'TotalSchemasCtrl'
  };
});

totalSchemasModule.factory('SchemasBackendFactory', function (HttpFactory) {
  return {
    getBrokers: function (endpoint) {
      return HttpFactory.req('GET', endpoint + '/brokers');
    },
    getSchemaRegistryJMX: function (endpoint) {
      return HttpFactory.req('GET', endpoint + '/jmx/schemaRegistry');
    }
  }
});

totalSchemasModule.controller('TotalSchemasCtrl', function ($scope, $log, $location, SchemasBackendFactory) {
  $scope.showSchemaRegistryDashboard = function () {
    console.log("showSchemaRegistryDashboard");
    $location.path("cluster/" + $scope.cluster.NAME + "/schemas", true);
  };

  // BrokersBackendFactory.getBrokers($scope.cluster.KAFKA_REST).then(
  //   function success(brokers) {
  //     $scope.totalBrokers = brokers.brokers.length;
  SchemasBackendFactory.getSchemaRegistryJMX($scope.cluster.KAFKA_LENSES_URL).then(
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