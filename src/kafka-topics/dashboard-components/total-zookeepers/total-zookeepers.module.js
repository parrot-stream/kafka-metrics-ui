var totalZookeepersModule = angular.module('totalZookeepers', ["HttpFactory"]);

totalZookeepersModule.directive('totalZookeepers', function (templates) {
  return {
    restrict: 'E',
    templateUrl: 'src/kafka-topics/dashboard-components/total-zookeepers/total-zookeepers.html',
    controller: 'TotalZookeepersCtrl'
  };
});

totalZookeepersModule.factory('ZookeepersBackendFactory', function (HttpFactory) {
  return {
    /*
     getBrokers: function (endpoint) {
     return HttpFactory.req('GET', endpoint + '/brokers');
     },
     */
    getZookeepersJMX: function (endpoint) {
      return HttpFactory.req('GET', endpoint + '/jmx/zookeeper');
    }
  }
});

totalZookeepersModule.controller('TotalZookeepersCtrl', function ($scope, $log, $location, ZookeepersBackendFactory) {
  $scope.showZookeepersDashboard = function () {
    console.log("showZookeepersDashboard");
    $location.path("cluster/" + $scope.cluster.NAME + "/zookeepers", true);
  };

  // ZookeepersBackendFactory.getBrokers($scope.cluster.KAFKA_REST).then(
  //   function success(brokers) {
  //$scope.totalBrokers = brokers.brokers.length;
  ZookeepersBackendFactory.getZookeepersJMX($scope.cluster.KAFKA_BACKEND).then(
    function success(allZookeeperJMX) {
      console.log("1");
      console.log(allZookeeperJMX);
      $scope.allZookeeperJMX = allZookeeperJMX;
    },
    function failure() {
      console.log("2");
      $scope.connectionFailure = true;
    });
  // },
  // function failure() {
  //   $scope.connectionFailure = true;
  // });

});