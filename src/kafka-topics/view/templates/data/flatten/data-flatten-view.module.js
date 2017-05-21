
var dataFlatTableModule = angular.module('flatView', []);

dataFlatTableModule.directive('flatView', function() {
  return {
    restrict: 'E',
    scope: {
      data: '=',
      partitions: '=',
      search: '=',
      topic: '='
    },
    templateUrl: 'src/kafka-topics/view/templates/data/flatten/data-flatten-view.html',
    controller: 'dataFlatTableCtrl',
   link: function(scope, element, attrs){
//         scope.$watch(function() {
//            console.log('test', scope.data)
//            scope.mrows = scope.data
//          });
    }
  };
});

topicsListModule.factory('FlatTableFactory', function (HttpFactory) {

    return {
        flattenObject: function (ob) {
           return flattenObject(ob);
        },
        sortByKey: function (array, key, reverse) {
            return sortByKey(array, key, reverse);
          },
        getTopicSummary: function (topicName, endpoint) {
           return HttpFactory.req('GET', endpoint  + '/topics/summary/' + topicName);
        }
    };

    function flattenObject(ob) {
        var toReturn = {};

        for (var i in ob) {
            if (!ob.hasOwnProperty(i)) continue;

            if ((typeof ob[i]) === 'object') {
                var flatObject = flattenObject(ob[i]);

                for (var x in flatObject) {
                    if (!flatObject.hasOwnProperty(x)) continue;
                    toReturn[i + '.' + x] = flatObject[x];
                }

            } else {
                toReturn[i] = ob[i];
            }
        }
        return toReturn;
    }

     // Sort arrays by key
     function sortByKey(array, key, reverse) {
          return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 * reverse : ((x > y) ? 1 * reverse : 0));
          });
     }
});

//TODO Clean me up! ALL shit happens here
dataFlatTableModule.controller('dataFlatTableCtrl', function ($scope, $log, $routeParams, $filter, FlatTableFactory, hotRegisterer) {

});
