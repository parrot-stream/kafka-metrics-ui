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
    },
    print20: function (text) {
      var length = text.length;
      if (length < 30) {
        var spaces = 30 - length;
      } else {
        var spaces = 0;
      }
      for (var s = 0; s < spaces; ++s) {
        text = text + "&nbsp;"
      }
      return text;
    }
  }
});

totalZookeepersModule.controller('TotalZookeepersCtrl', function ($scope, $log, $location, $routeParams, ZookeepersBackendFactory, $sce, env) {
  $scope.showZookeepersDashboard = function () {
    var newPath = "cluster/" + $scope.cluster.NAME + "/zookeepers";
    $location.path(newPath, true);
  };

  var topicMenuItem = $routeParams.menuItem;

  $scope.selectedMenuItem = (topicMenuItem != undefined) ? topicMenuItem : 'infrastructure';

  $scope.setMenuSelection = function(currentMenuItem, cluster) {
    $scope.selectedMenuItem = currentMenuItem;
    $location.path("cluster/"+ cluster.NAME + "/zookeepers/" + currentMenuItem, false);
  };

  $scope.onTabChanges = function(currentTabIndex, cluster){
    $location.path ("cluster/"+ cluster.NAME + "/topic/" +  topicCategoryUrl + "/" + topicName +  "/" + $scope.selectedMenuItem + "/" + currentTabIndex, false);
  };

  ZookeepersBackendFactory.getZookeepersJMX($scope.cluster.KAFKA_LENSES_URL).then(
    function success(allZookeeperJMX) {
      $scope.allZookeeperJMX = allZookeeperJMX;
      var processCPU = "";
      var systemCPU = "";
      var availableProcessors = "";
      var architecture = "";
      var openFileDescriptors = "";
      var maxFileDescriptors = "";
      var packetsSent = "";
      var version = "";
      var uptime = "";
      var lastZxid = "";
      var nodeCount = "";
      var watchCount = "";
      var aliveConnections = "";
      var maxRequestLatency = "";
      var clientPort = "";
      var packetsReceived = "";
      var tickTime = "";
      allZookeeperJMX.data.forEach(function (zk) {
        processCPU += ZookeepersBackendFactory.print20(parseFloat(Math.round(zk.osMetrics.processCpuLoad * 100 * 100) / 100).toFixed(2) + " %");
        systemCPU += ZookeepersBackendFactory.print20(parseFloat(Math.round(zk.osMetrics.systemCpuLoad * 100 * 100) / 100).toFixed(2) + " %");
        availableProcessors += ZookeepersBackendFactory.print20(zk.osMetrics.availableProcessors + "");
        architecture += ZookeepersBackendFactory.print20(zk.osMetrics.architecture + "");
        openFileDescriptors += ZookeepersBackendFactory.print20(zk.osMetrics.openFileDescriptorCount + "");
        maxFileDescriptors += ZookeepersBackendFactory.print20(zk.osMetrics.maxFileDescriptorCount + "");
        packetsSent += ZookeepersBackendFactory.print20(zk.commonZK.packetsSent+"");
        version += ZookeepersBackendFactory.print20(zk.commonZK.version.substring(0,18));
        uptime += ZookeepersBackendFactory.print20(humanizeDuration(zk.runtimeMetrics.uptime, { largest: 2,  units: ['d', 'h'], round : true })); //  | humanizeDuration:{ largest: 2,  units: ['d', 'h'], round : true } }}</pre>
        lastZxid += ZookeepersBackendFactory.print20(zk.inMemory.lastZxid);
        nodeCount += ZookeepersBackendFactory.print20(zk.inMemory.nodeCount + "");
        watchCount += ZookeepersBackendFactory.print20(zk.inMemory.watchCount+ "");
        aliveConnections += ZookeepersBackendFactory.print20(zk.commonZK.numAliveConnections + "");
        maxRequestLatency += ZookeepersBackendFactory.print20(zk.commonZK.maxRequestLatency + "");
        clientPort += ZookeepersBackendFactory.print20(zk.commonZK.clientPort +"");
        packetsReceived += ZookeepersBackendFactory.print20(zk.commonZK.packetsReceived+"");
        tickTime += ZookeepersBackendFactory.print20(zk.commonZK.tickTime+"");
      });
      $scope.htmlCode = "" +
        "<pre>Zookeeper Process CPU : " + processCPU + "</pre>" +
        "<pre>System CPU usage      : " + systemCPU + "</pre>" +
        "<pre>Available Processors  : " + availableProcessors + "</pre>" +
        "<pre>Architecture          : " + architecture + "</pre>" +
        "<pre>Open File Descriptors : " + openFileDescriptors + "</pre>" +
        "<pre>Max File Descriptors  : " + maxFileDescriptors + "</pre>" +
        "<pre>Version               : " + version + "</pre>" +
        "<pre>Uptime                : " + uptime + "</pre>" +
        "<br>" +
        "<pre>Last Zxid             : " + lastZxid +"</pre>" +
        "<pre>Node Count            : " + nodeCount+"</pre>" +
        "<pre>Watch Count           : " + watchCount+"</pre>" +
        "<pre>Alive Connections     : " + aliveConnections+"</pre>" +
        "<pre>Max Request Latency   : " + maxRequestLatency+"</pre>" +
        "<pre>Client Port           : " + clientPort+"</pre>" +
        "<br>"+
        "<pre>Packets sent          : " + packetsSent+ "</pre>" +
        "<pre>Packets received      : " + packetsReceived +"</pre>" +
        "<pre>Tick time             : " + tickTime +"</pre>";
    },
    function failure() {
      $scope.connectionFailure = true;
    });
});