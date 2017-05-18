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
    getZookeepersJMX: function (endpoint) {
      return HttpFactory.req('GET', endpoint + '/jmx/zookeeper');
    }
  }
});

totalZookeepersModule.controller('TotalZookeepersCtrl', function ($scope, $log, $location, ZookeepersBackendFactory) {
  $scope.showZookeepersDashboard = function () {
    var newPath = "cluster/" + $scope.cluster.NAME + "/zookeepers";
    $location.path(newPath, true);
  };

  ZookeepersBackendFactory.getZookeepersJMX($scope.cluster.KAFKA_LENSES_URL).then(
    function success(allZookeeperJMX) {
      $scope.allZookeeperJMX = allZookeeperJMX;
    },
    function failure() {
      $scope.connectionFailure = true;
    });
});