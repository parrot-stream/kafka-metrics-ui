angularAPP.controller('HealthcheckCtrl', function ($scope, $rootScope, $http, $log, env) {

  $rootScope.showList = true;

  var allClusters = env.getAllClusters();

  angular.forEach(allClusters, function(cluster) {
    $http.get(cluster.KAFKA_LENSES_URL + '/jmx/services').then(function (response) {
      console.log(response);
      $scope.brokersJMX = response.data.brokersJMX;
      $scope.zookeeperJMX = response.data.zookeeperJMX;
      $scope.connectJMX = response.data.connectJMX;
      $scope.schemaRegistryJMX = response.data.schemaRegistryJMX;
      $scope.restProxyJMX = response.data.restProxyJMX;
      $scope.lensesJMX = response.data.lensesJMX;
      $scope.kafkaAppsJMX = response.data.kafkaAppsJMX;
    });
  });

  angular.forEach(allClusters, function(cluster) {
    $http.get(cluster.KAFKA_LENSES_URL + '/jmx/broker').then(function(response) {
        var isOk = (response.status >= 200 && response.status < 400 ) ? true : false;
        cluster.isOk = isOk;
    })
  });
  $scope.allClusters = allClusters;

  //TODO healthcheck + brokers


});
