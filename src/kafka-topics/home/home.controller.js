angularAPP.controller('HomeCtrl', function ($scope, $rootScope, BrokersBackendFactory, env) {
  $rootScope.showList = true;

  $scope.$on('$routeChangeSuccess', function() {
    $scope.kafkaRest = env.getSelectedCluster().KAFKA_REST;
  });

  BrokersBackendFactory.getBrokersJMX($scope.cluster.KAFKA_LENSES_URL).then(
    function success(allBrokerJMX) {
      $scope.allBrokerJMX = allBrokerJMX;
    },
    function failure() {
      $scope.connectionFailure = true;
    });

});