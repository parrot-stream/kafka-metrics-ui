'use strict';

/**
 * Pulling in css libs
 */
require('font-awesome/css/font-awesome.min.css');
require('angular-material/angular-material.min.css');
require('angular-material-data-table/dist/md-data-table.min.css');
require('angular-json-tree/dist/angular-json-tree.css');
require('./assets/css/styles.css');

require('ace-builds/src-min-noconflict/ace');
require('ace-builds/src-min-noconflict/mode-json');
require('ace-builds/src-min-noconflict/mode-batchfile');
require('ace-builds/src-min-noconflict/theme-chrome');
require('spin.js');

require('angular');
require('angular-utils-pagination/dirPagination');
require('angular-ui-ace');
require('angular-spinner');
require('angular-route');
require('angular-sanitize');
require('angular-material');
require('angular-animate');
require('angular-aria');
require('angular-material-data-table');
require('angular-json-tree');

require('../env');

var angularAPP = angular.module('angularAPP', [
  'ui.ace',
  'angularSpinner',
  'angularUtils.directives.dirPagination',
  'ngRoute',
  'ngMaterial',
  'ngAnimate',
  'ngAria',
  'angular-json-tree',
  'ngSanitize'

  // ,'HttpFactory'
  // 'topicsList',
  // 'totalTopics',
  // 'flatView',
  // 'treeView',
  // 'rawView',
  // 'totalBrokers',
  // 'totalZookeepers',
  // 'totalConnect',
  // 'totalSchemas',
  // 'angular-humanize-duration'
]);

/**
 *
 */
require('./kafka-topics');
require('./factories');

/**
 * Templates
 */
var homeTemplate = require('./kafka-topics/home/home.html');
var healthCheckPage = require('./kafka-topics/healthcheck/healthcheck.html');
var zkDashboard = require('./kafka-topics/dashboard-components/zookeepers-dashboard/zookeepers-dashboard.html');
var brokerDashboard = require('./kafka-topics/dashboard-components/brokers/brokers-dashboard.html');
var schemasDashboard = require('./kafka-topics/dashboard-components/schemas-dashboard/schemas-dashboard.html');
var connectDashboard = require('./kafka-topics/dashboard-components/connect-dashboard/connect-dashboard.html');
var dirPaginationControlsTemplate = require('./kafka-topics/pagination/dirPaginationControlsTemplate.html');
var selectCluster = require('./kafka-topics/dashboard-components/select-cluster/select-cluster.html');
var missingEnv = require('./kafka-topics/dashboard-components/missing-env/missing-env.html');

// ng-show="x | isEmpty"
angularAPP.filter('isEmpty', function () {
  var bar;
  return function (obj) {
    for (bar in obj) {
      if (obj.hasOwnProperty(bar)) {
        return false;
      }
    }
    return true;
  };
});

angularAPP.filter("sanitize", ['$sce', function ($sce) {
  return function (htmlCode) {
    return $sce.trustAsHtml(htmlCode);
  }
}]);

angularAPP.filter('humanize', function () {
  return function humanize(number) {
    if (number < 1000) {
      return number;
    }
    var si = [' K', ' M', ' G', ' Tera', ' Peta', ' Hexa'];
    var exp = Math.floor(Math.log(number) / Math.log(1000));
    var result = number / Math.pow(1000, exp);
    result = (result % 1 > (1 / Math.pow(1000, exp - 1))) ? result.toFixed(2) : result.toFixed(0);
    return result + si[exp - 1];
  };
});

angularAPP.filter('humanizeBytes', function () {
  return function humanize(number) {
    if (number < 1000) {
      return Math.floor(number * 10) / 10 + ' Bytes';
    }
    var si = [' KBytes', ' MBytes', ' GBytes', ' TBytes', ' PetaBytes', ' HexaBytes'];
    var exp = Math.floor(Math.log(number) / Math.log(1000));
    var result = number / Math.pow(1000, exp);
    result = (result % 1 > (1 / Math.pow(1000, exp - 1))) ? result.toFixed(2) : result.toFixed(0);
    return result + si[exp - 1];
  };
});

angularAPP.config(['$compileProvider', '$routeProvider', '$locationProvider', '$mdThemingProvider', '$logProvider', '$log',
  function ($compileProvider, $routeProvider, $locationProvider, $mdThemingProvider, $logProvider, $log) {
    $log.info("Config");
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);

    $logProvider.debugEnabled(true); //todo get from env
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .accentPalette('blue')
      .warnPalette('grey');

    $locationProvider.html5Mode();
    $locationProvider.hashPrefix('');
    $routeProvider
      .when('/', {
        templateUrl: homeTemplate,
        controller: 'HomeCtrl'
      })
      .when('/cluster/:cluster', {
        templateUrl: homeTemplate,
        controller: 'HomeCtrl'
      })
      .when('/healthcheck', {
        templateUrl: healthCheckPage,
        controller: 'HealthcheckCtrl'
      })
      .when('/cluster/:cluster/zookeepers', {
        templateUrl: zkDashboard,
        controller: 'TotalZookeepersCtrl'
      })
      .when('/cluster/:cluster/zookeepers/:menuItem', {
        templateUrl: zkDashboard,
        controller: 'TotalZookeepersCtrl'
      })
      .when('/cluster/:cluster/brokers', {
        templateUrl: brokerDashboard,
        controller: 'TotalBrokersCtrl'
      })
      .when('/cluster/:cluster/schemas', {
        templateUrl: schemasDashboard,
        controller: 'TotalSchemasCtrl'
      })
      .when('/cluster/:cluster/connect', {
        templateUrl: connectDashboard,
        controller: 'TotalConnectCtrl'
      }).otherwise({
      redirectTo: '/'
    });
    // $locationProvider.html5Mode(true);
  }
]);

console.log("3");

angularAPP.run(['$route', '$routeParams', '$rootScope', '$location', '$templateCache', 'env',
  function loadRoute($route, $routeParams, $rootScope, $location, $templateCache, env) {
    console.log("registered");
    $templateCache.put('select-cluster.html', selectCluster);
    $templateCache.put('missing.html', missingEnv);

    $rootScope.$on('$routeChangeSuccess', function () {
      //When the app starts set the envs
      if (!env.isMissingEnvJS()) {
        env.setSelectedCluster($routeParams.cluster);
        $rootScope.clusters = env.getAllClusters();
        $rootScope.cluster = env.getSelectedCluster();
      } else {
        $rootScope.missingEnvJS = env.isMissingEnvJS();
      }
    });


    $rootScope.selectCluster = function (cluster) {
      $rootScope.connectionFailure = false;
      $location.path("/cluster/" + cluster);
      $rootScope.cluster = cluster;
    };

    //TODO Where to check connectivity and make it public for all components ?

    var original = $location.path;
    $location.path = function (path, reload) {
      if (reload === false) {
        var lastRoute = $route.current;
        var un = $rootScope.$on('$locationChangeSuccess', function () {
          $route.current = lastRoute;
          un();
        });
      }
      return original.apply($location, [path]);
    }

  }
]);

console.log("4");

//angularAPP.run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
//}]);
