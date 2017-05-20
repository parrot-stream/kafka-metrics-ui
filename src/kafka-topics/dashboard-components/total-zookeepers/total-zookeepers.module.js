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

  $scope.selectedMenuItem = (topicMenuItem !== undefined) ? topicMenuItem : 'infrastructure';

  $scope.setMenuSelection = function (currentMenuItem, cluster) {
    $scope.selectedMenuItem = currentMenuItem;
    $location.path("cluster/" + cluster.NAME + "/zookeepers/" + currentMenuItem, false);
  };

  $scope.onTabChanges = function (currentTabIndex, cluster) {
    $location.path("cluster/" + cluster.NAME + "/topic/" + topicCategoryUrl + "/" + topicName + "/" + $scope.selectedMenuItem + "/" + currentTabIndex, false);
  };

  function humanizeBytes(number) {
    if (number < 1000) {
      return Math.floor(number * 10) / 10 + ' Bytes';
    }
    var si = [' KBytes', ' MBytes', ' GBytes', ' TBytes', ' PetaBytes', ' HexaBytes'];
    var exp = Math.floor(Math.log(number) / Math.log(1000));
    var result = number / Math.pow(1000, exp);
    result = (result % 1 > (1 / Math.pow(1000, exp - 1))) ? result.toFixed(2) : result.toFixed(0);
    return result + si[exp - 1];
  }

  ZookeepersBackendFactory.getZookeepersJMX($scope.cluster.KAFKA_LENSES_URL).then(
    function success(allZookeeperJMX) {
      $scope.allZookeeperJMX = allZookeeperJMX;

      // commonZK
      var avgRequestLatency = "";
      var clientPort = "";
      var maxClientCnxnsPerHost = "";
      var maxRequestLatency = "";
      var maxSessionTimeout = "";
      var minRequestLatency = "";
      var minSessionTimeout = "";
      var numAliveConnections = "";
      var outstandingRequests = "";
      var packetsReceived = "";
      var packetsSent = "";
      var startTime = "";
      var tickTime = "";
      var version = "";

      // in-memory
      var lastZxid = "";
      var nodeCount = "";
      var watchCount = "";

      // os-metrics
      var architecture = "";
      var availableProcessors = "";
      var committedVirtualMemorySize = "";
      var freePhysicalMemorySize = "";
      var freeSwapSpaceSize = "";
      var maxFileDescriptorCount = "";
      var os_name = "";
      var openFileDescriptors = "";
      var processCpuLoad = "";
      var processCpuTime = "";
      var systemCpuLoad = "";
      var systemLoadAverage = "";
      var totalPhysicalMemorySize = "";
      var totalSwapSpaceSize = "";
      var osVersion = "";

      // runtime-metrics
      var runtimeStartTime = "";
      var uptime = "";

      // replica
      var r_electionType = "";
      var r_initLimit = "";
      var r_maxClientCnxnsPerHost = "";
      var r_maxSessionTimeout = "";
      var r_minSessionTimeout = "";
      var r_name = "";
      var r_quorumAddress = "";
      var r_startTime = "";
      var r_state = "";
      var r_syncLimit = "";
      var r_tick = "";
      var r_tickTime = "";

      // follower-extra
      var f_lastQueuedZxid = "";
      var f_quorumAddress = "";
      var f_pendingRevalidationCount = "";

      // leader-extra
      var l_currentZxid = "";

      var role = "";

      allZookeeperJMX.data.forEach(function (zk) {
        // common
        avgRequestLatency += ZookeepersBackendFactory.print20(zk.commonZK.avgRequestLatency + "");
        clientPort += ZookeepersBackendFactory.print20(zk.commonZK.clientPort + "");
        maxClientCnxnsPerHost += ZookeepersBackendFactory.print20(zk.commonZK.maxClientCnxnsPerHost + "");
        maxRequestLatency += ZookeepersBackendFactory.print20(zk.commonZK.maxRequestLatency + "");
        maxSessionTimeout += ZookeepersBackendFactory.print20(zk.commonZK.maxSessionTimeout + "");
        minRequestLatency += ZookeepersBackendFactory.print20(zk.commonZK.minRequestLatency + "");
        minSessionTimeout += ZookeepersBackendFactory.print20(zk.commonZK.minSessionTimeout + "");
        numAliveConnections += ZookeepersBackendFactory.print20(zk.commonZK.numAliveConnections + "");
        outstandingRequests += ZookeepersBackendFactory.print20(zk.commonZK.outstandingRequests + "");
        packetsReceived += ZookeepersBackendFactory.print20(zk.commonZK.packetsReceived + "");
        packetsSent += ZookeepersBackendFactory.print20(zk.commonZK.packetsSent + "");
        startTime += ZookeepersBackendFactory.print20(zk.commonZK.startTime + "");
        tickTime += ZookeepersBackendFactory.print20(zk.commonZK.tickTime + "");
        version += ZookeepersBackendFactory.print20(zk.commonZK.version.substring(0, 18));

        // in-memory
        lastZxid += ZookeepersBackendFactory.print20(zk.inMemory.lastZxid);
        nodeCount += ZookeepersBackendFactory.print20(zk.inMemory.nodeCount + "");
        watchCount += ZookeepersBackendFactory.print20(zk.inMemory.watchCount + "");

        // os-metrics
        architecture += ZookeepersBackendFactory.print20(zk.osMetrics.architecture + " - " + zk.osMetrics.name);
        availableProcessors += ZookeepersBackendFactory.print20(zk.osMetrics.availableProcessors + "");
        committedVirtualMemorySize += ZookeepersBackendFactory.print20(humanizeBytes(zk.osMetrics.committedVirtualMemorySize));
        freePhysicalMemorySize += ZookeepersBackendFactory.print20(humanizeBytes(zk.osMetrics.freePhysicalMemorySize));
        freeSwapSpaceSize += ZookeepersBackendFactory.print20(zk.osMetrics.freeSwapSpaceSize + "");
        maxFileDescriptorCount += ZookeepersBackendFactory.print20(zk.osMetrics.maxFileDescriptorCount + "");
        os_name += ZookeepersBackendFactory.print20(zk.osMetrics.name);
        openFileDescriptors += ZookeepersBackendFactory.print20(zk.osMetrics.openFileDescriptorCount + "");
        processCpuLoad += ZookeepersBackendFactory.print20(parseFloat(Math.round(zk.osMetrics.processCpuLoad * 100 * 100) / 100).toFixed(2) + " %");
        processCpuTime += ZookeepersBackendFactory.print20(zk.osMetrics.processCpuTime + "");
        systemCpuLoad += ZookeepersBackendFactory.print20(parseFloat(Math.round(zk.osMetrics.systemCpuLoad * 100 * 100) / 100).toFixed(2) + " %");
        systemLoadAverage += ZookeepersBackendFactory.print20(parseFloat(Math.round(zk.osMetrics.systemLoadAverage * 100 * 100) / 100).toFixed(2) + " %");
        totalPhysicalMemorySize += ZookeepersBackendFactory.print20(humanizeBytes(zk.osMetrics.totalPhysicalMemorySize) + "");
        totalSwapSpaceSize += ZookeepersBackendFactory.print20(humanizeBytes(zk.osMetrics.totalSwapSpaceSize));
        osVersion = ZookeepersBackendFactory.print20(zk.osMetrics.version);

        // runtime-metrics
        uptime += ZookeepersBackendFactory.print20(humanizeDuration(zk.runtimeMetrics.uptime, {
          largest: 2,
          units: ['d', 'h'],
          round: true
        })); //  | humanizeDuration:{ largest: 2,  units: ['d', 'h'], round : true } }}</pre>

        // replica - metrics
        r_electionType += ZookeepersBackendFactory.print20(zk.replicaZK.electionType + "");
        r_initLimit += ZookeepersBackendFactory.print20(zk.replicaZK.initLimit + "");
        r_maxClientCnxnsPerHost += ZookeepersBackendFactory.print20(zk.replicaZK.maxClientCnxnsPerHost + "");
        r_maxSessionTimeout += ZookeepersBackendFactory.print20(zk.replicaZK.maxSessionTimeout + "");
        r_minSessionTimeout += ZookeepersBackendFactory.print20(zk.replicaZK.minSessionTimeout + "");
        r_name += ZookeepersBackendFactory.print20(zk.replicaZK.name + "");
        r_quorumAddress += ZookeepersBackendFactory.print20(zk.replicaZK.quorumAddress + "");
        r_startTime += ZookeepersBackendFactory.print20(zk.replicaZK.startTime + "");
        r_state += ZookeepersBackendFactory.print20(zk.replicaZK.state + "");
        r_syncLimit += ZookeepersBackendFactory.print20(zk.replicaZK.syncLimit + "");
        r_tick += ZookeepersBackendFactory.print20(zk.replicaZK.tick + "");
        r_tickTime += ZookeepersBackendFactory.print20(zk.replicaZK.tickTime + "");

        // follower-extra
        if (typeof zk.followerExtra !== "undefined") {
          f_lastQueuedZxid += ZookeepersBackendFactory.print20(zk.followerExtra.lastQueuedZxid + "");
          f_quorumAddress += ZookeepersBackendFactory.print20(zk.followerExtra.quorumAddress + "");
          f_pendingRevalidationCount += ZookeepersBackendFactory.print20(zk.followerExtra.pendingRevalidationCount + "");
          role += '<i>' + ZookeepersBackendFactory.print20('Follower') + '</i>';
        }

        // leader-extra
        if (typeof zk.leaderExtra !== "undefined") {
          role += '<b>' + ZookeepersBackendFactory.print20('Leader') + '</b>';
          l_currentZxid += ZookeepersBackendFactory.print20(zk.leaderExtra.currentZxid + "");
        }

      });
      $scope.htmlCode = "" +
        "<pre style='padding-bottom:7px;'>                          <b>" + r_name + "</b></pre>" +
        "<pre style='padding-bottom:7px;'>                          " + role + "</pre>" +
        "<pre>State                   : " + r_state + "</pre>" +
        "<pre>Zookeeper Process CPU   : " + processCpuLoad + "</pre>" +
        "<pre>System CPU usage        : " + systemCpuLoad + "</pre>" +
        "<pre>System Load Average     : " + systemLoadAverage + "</pre>" +
        "<pre>Available Processors    : " + availableProcessors + "</pre>" +
        "<pre>Architecture            : " + architecture + "</pre>" +
        "<pre>Open File Descriptors   : " + openFileDescriptors + "</pre>" +
        "<pre>Max File Descriptors    : " + maxFileDescriptorCount + "</pre>" +
        "<pre>Version                 : " + version + "</pre>" +
        "<pre>Uptime                  : " + uptime + "</pre>" +
        "<br>" +
        "<pre>Committed VM Size       : " + committedVirtualMemorySize + "</pre>" +
        "<pre>Free Physical Memory    : " + freePhysicalMemorySize + "</pre>" +
        "<pre>Total Physical Memory   : " + totalPhysicalMemorySize + "</pre>" +
        "<br>" +
        "<pre>Alive Connections       : " + numAliveConnections + "</pre>" +
        "<pre>Max connections / host  : " + maxClientCnxnsPerHost + "</pre>" +
        "<pre>Max Request Latency     : " + maxRequestLatency + "</pre>" +
        "<pre>Node Count              : " + nodeCount + "</pre>" +
        "<pre>Watch Count             : " + watchCount + "</pre>" +
        "<pre>Last Zxid               : " + lastZxid + "</pre>" +
        "<pre>Client Port             : " + clientPort + "</pre>" +
        "<br>" +
        "<pre>Packets sent            : " + packetsSent + "</pre>" +
        "<pre>Packets received        : " + packetsReceived + "</pre>" +
        "<pre>Tick time               : " + tickTime + "</pre>" +
        "<br>" +
        "<pre>Outstanding Requests    : " + outstandingRequests + "</pre>" +
        "<pre>Average Request Latency : " + avgRequestLatency + "</pre>" +
        "<pre>Max session timeout     : " + maxSessionTimeout + "</pre>" +
        "<pre>Free Swap Space         : " + freeSwapSpaceSize + "</pre>" +
        "<pre>Min Request Latency     : " + minRequestLatency + "</pre>" +
        "<pre>Min Session Timeout     : " + minSessionTimeout + "</pre>" +
        "<pre>Total Swap Space        : " + totalSwapSpaceSize + "</pre>" +
        "<pre>Process CPU Time        : " + processCpuTime + "</pre>" +
        "<br>" +
        "<pre>Election Type           : " + r_electionType + "</pre>" +
        "<pre>Init Limit              : " + r_initLimit + "</pre>" +
        "<pre>Max connections / host  : " + r_maxClientCnxnsPerHost + "</pre>" +
        "<pre>Max session Timeout     : " + r_maxSessionTimeout + "</pre>" +
        "<pre>Min session Timeout     : " + r_minSessionTimeout + "</pre>" +
        "<pre>Quorum Address          : " + r_quorumAddress + "</pre>" +
        "<pre>Start Time              : " + r_startTime + "</pre>" +
        "<pre>Sync Limit              : " + r_syncLimit + "</pre>" +
        "<pre>Tick                    : " + r_tick + "</pre>" +
        "<pre>Tick Time               : " + r_tickTime + "</pre>" +
        "<br>" +
        "<pre>Last Queued Zxid        : " + f_lastQueuedZxid + "</pre>" +
        "<pre>Quorum Address          : " + f_quorumAddress + "</pre>" +
        "<pre>Pending Revalidations   : " + f_pendingRevalidationCount + "</pre>";

    },
    function failure() {
      $scope.connectionFailure = true;
    });
});