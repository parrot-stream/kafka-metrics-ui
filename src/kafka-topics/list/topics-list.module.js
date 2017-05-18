/**

 This module gives a list of topics with some metadata.

 Example of usage:
     <topics-list mode="normal" cluster="{{cluster}}"></topics-list>

     mode can be `normal`, `system` or `compact`
     cluster is a scope var in module's controller and expects the selected cluster to pick up topics from.

**/
var topicsListModule = angular.module('topicsList', ["HttpFactory"]);

topicsListModule.directive('topicsList', function(templates) {
  return {
    restrict: 'E',
    templateUrl: function($elem, $attr){
      return templates[$attr.mode];
    },
    controller: 'KafkaTopicsListCtrl'
  };
});

topicsListModule.factory('templates', function() {
  return {
    compact: 'src/kafka-topics/list/compact-topics-list.html',
    home:  'src/kafka-topics/list/topics-list.html',
  };
});

topicsListModule.factory('TopicsListFactory', function (HttpFactory) {
    return {
        getTopics: function (endpoint) {
        },
        getTopicDetails: function(topicName, endpoint){
        },
        sortByKey: function (array, key, reverse) {
          return sortByKey(array, key, reverse);
        }
    }
    function sortByKey(array, key, reverse) {
        return array.sort(function (a, b) {
          var x = a[key];
          var y = b[key];
          return ((x < y) ? -1 * reverse : ((x > y) ? 1 * reverse : 0));
        });
    }
});

topicsListModule.factory('shortList', function (HttpFactory) {
  return {
    sortByKey: function (array, key, reverse) {
    return sortByKey(array, key, reverse);
    }
  }
  function sortByKey(array, key, reverse) {
    return array.sort(function (a, b) {
      var x = a[key];
      var y = b[key];
      return ((x < y) ? -1 * reverse : ((x > y) ? 1 * reverse : 0));
    });
  }
})

topicsListModule.controller('KafkaTopicsListCtrl', function ($scope, $location, $rootScope, $routeParams, $cookies, $filter, $log, $q, $http, TopicsListFactory, shortList) {
  $rootScope.showList = true;

  $scope.topic = $routeParams.topicName


  var schemas;
  $scope.displayingControlTopics = false;
  $scope.$watch(
    function () { return $routeParams.topicName },
    function () { if(angular.isDefined($routeParams.topicName)) {
      $scope.topicName = $routeParams.topicName
      $scope.displayingControlTopics = checkIsControlTopic($scope.topicName);
    }
 },
   true);

  $scope.$watch(
    function () { return $scope.cluster; },
    function () { if(typeof $scope.cluster == 'object'){
      getLeftListTopics();
      loadSchemas()
    } },
   true);

  $scope.query = { order: '-totalMessages', limit: 100, page: 1 };

  // This one is called each time - the user clicks on an md-table header (applies sorting)
  $scope.logOrder = function (a) {
      sortTopics(a);
  };

  $scope.totalMessages = function (topic) {
    if(topic.totalMessages == 0) return '0';
    var sizes = ['', 'K', 'M', 'B', 'T', 'Quan', 'Quin'];
    var i = +Math.floor(Math.log(topic.totalMessages) / Math.log(1000));
    return (topic.totalMessages / Math.pow(1000, i)).toFixed(i ? 1 : 0) + sizes[i];
  }

  $scope.selectTopicList = function (displayingControlTopics) {
    $scope.selectedTopics = $scope.topics.filter(function(el) {return el.isControlTopic == $scope.displayingControlTopics})
  }


  var itemsPerPage = (window.innerHeight - 280) / 48;
  Math.floor(itemsPerPage) < 3 ? $scope.topicsPerPage =3 : $scope.topicsPerPage = Math.floor(itemsPerPage);

  $scope.listClick = function (topicName, isControlTopic) {
    var urlType = (isControlTopic == true) ? 'c' : 'n';
    $location.path("cluster/" + $scope.cluster.NAME + "/topic/" + urlType + "/" + topicName, true);
  }

  function getLeftListTopics() {
    $scope.selectedTopics = [];
    $scope.topics = [];
    // TopicsListFactory.getTopics($scope.cluster.KAFKA_REST.trim()).then(function (allData){
    //     var topics = [];
    //     angular.forEach(allData.data, function(topic, key) {
    //         TopicsListFactory.getTopicDetails(topic, $scope.cluster.KAFKA_REST.trim()).then(function(res){
    //             var configsCounter = 0;
    //             angular.forEach(res.data.configs, function(value, key) { configsCounter++;});
    //             var topicImproved = {
    //                 topicName : res.data.name,
    //                 partitions : res.data.partitions.length,
    //                 replication : res.data.partitions[0].replicas.length,
    //                 customConfig : configsCounter,
    //                 isControlTopic : checkIsControlTopic(res.data.name)
    //             }
    //
    //             topics.push(topicImproved);
    //            if (topics.length == allData.data.length) {
    //               $scope.topics = topics;
    //               $scope.selectedTopics = topics.filter(function(el) {return el.isControlTopic == $scope.displayingControlTopics});
    //               console.log('Total topics fetched:', allData.data.length)
    //               console.log('Length of improved topic array:', topics.length)
    //               console.log('Selected topics(listed):', $scope.selectedTopics.length)
    //
    //               $scope.topicsIndex = arrayObjectIndexOf($scope.selectedTopics, $routeParams.topicName, 'topicName' ) + 1;
    //               $scope.topicsPage = Math.ceil($scope.topicsIndex / $scope.topicsPerPage);
    //
    //               if ($scope.topicsPage < 1) {
    //                 $scope.topicsPage = 1
    //               }
    //            }
    //         })
    //
    //     })
    //
    //     //$scope.selectTopicList(true);
    //
    // })
  }

  function sortTopics(type) {
      var reverse = 1;
      if (type.indexOf('-') == 0) {
        // remove the - symbol
        type = type.substring(1, type.length);
        reverse = -1;
      }
      $scope.selectedTopics = shortList.sortByKey($scope.selectedTopics, type, reverse);
  }


function arrayObjectIndexOf(myArray, searchTerm, property) {
    for(var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}

  function loadSchemas(){
  }


  function getDataType (topicName) {
    return "a";
  }

   $scope.getDataType = function (topicName) {
      return getDataType(topicName);
    };

    function checkIsControlTopic(topicName) {
      var isControlTopic = false;
      angular.forEach(KNOWN_TOPICS.CONTROL_TOPICS, function (controlTopicPrefix) {
        if (topicName.lastIndexOf(controlTopicPrefix, 0) === 0)
          isControlTopic = true;
      });
      return isControlTopic;
    }

});