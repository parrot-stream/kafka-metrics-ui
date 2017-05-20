var totalConnectModule = angular.module('totalConnect', ["HttpFactory"]);

totalConnectModule.directive('totalConnect', function (templates) {
  return {
    restrict: 'E',
    templateUrl: 'src/kafka-topics/dashboard-components/total-connect/total-connect.html',
    controller: 'TotalConnectCtrl'
  };
});

totalConnectModule.factory('ConnectBackendFactory', function (HttpFactory) {
  return {
    getConnectJMX: function (endpoint) {
      return HttpFactory.req('GET', endpoint + '/jmx/connect');
    }
  }
});

totalConnectModule.controller('TotalConnectCtrl', function ($scope, $log, $location, ConnectBackendFactory) {
  $scope.showConnectDashboard = function () {
    console.log("showConnectDashboard");
    $location.path("cluster/" + $scope.cluster.NAME + "/connect", true);
  };

  ConnectBackendFactory.getConnectJMX($scope.cluster.KAFKA_LENSES_URL).then(
    function success(allConnectJMX) {
      //console.log(allConnectJMX);
      $scope.allConnectJMX = allConnectJMX.data;
    },
    function failure() {
      $scope.connectionFailure = true;
    });

});