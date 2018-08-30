(function() {
    'use strict';

    angular.module('app')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home/home.html',
                controller: 'homeController',
                controllerAs: 'home'
            })
            .state('temperature', {
                url: '/temperature',
                templateUrl: 'temperature/temperature.html',
                controller: 'temperatureController',
                controllerAs: 'temperature'
            })
            .state('accelerometer', {
                url: '/accelerometer',
                templateUrl: 'accelerometer/accelerometer.html',
                controller: 'accelerometerController',
                controllerAs: 'accelerometer'
            })
            .state('gps', {
                url: '/gps',
                templateUrl: 'gps/gps.html',
                controller: 'gpsController',
                controllerAs: 'gps',
            })
            .state('rpm', {
                url: '/rpm',
                templateUrl: 'rpm/rpm.html',
                controller: 'rpmController',
                controllerAs: 'rpm',
            })
            .state('speed', {
                url: '/speed',
                templateUrl: 'speed/speed.html',
                controller: 'speedController',
                controllerAs: 'speed',
            });
    }

})();
