(function() {
    'use strict';

    angular.module('app')
        .controller('gpsController', gpsController);

    gpsController.$inject = ['$http', '$scope'];
    function gpsController($http, $scope) {
        let vm = this;
        vm.numPoints = 1;
        vm.fetchDataInterval = 1000; //In milliseconds

        vm.centerMap = function () {
            vm.map.setCenter(vm.location);
            vm.map.setZoom(19);
        };

        let initialize = function() {

            let success = function(response) {

                if (response.data.length !== 0) {
                    //Get the position
                    vm.location = {
                        lat: parseFloat(response.data[0].latitude),
                        lng: parseFloat(response.data[0].longitude)
                    };
                }
                else {
                    //Default location is Rogers building
                    vm.location = {
                        lat: 31.550370,
                        lng: -97.117091
                    };
                }
                vm.map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 19,
                    center: vm.location
                });

                // Add a marker at the center of the map.
                addMarker(vm.location, vm.map);


                //Start the data update interval
                vm.startDataInterval();
            };

            let error = function(response) {
                console.log(response);
            };

            $http.get('/api/gps/' + vm.numPoints).then(success, error);
        };

        // Adds a marker to the map.
        let addMarker = function(location, map) {
            // Add the marker at the clicked location, and add the next-available label
            // from the array of alphabetical characters.
            vm.marker = new google.maps.Marker({
                position: location,
                map: map
            });
        };

        //What happens when the chart updates
        vm.updateMap = function() {
            if (vm.map != null) {
                let success = function(response) {

                    //Update Map
                    //Get the position if there is data
                    if (response.data.length !== 0) {
                        vm.location = {
                            lat: parseFloat(response.data[0].latitude),
                            lng: parseFloat(response.data[0].longitude)
                        };
                        vm.marker.setPosition(vm.location);
                    }
                };

                let error = function(response) {
                    console.log(response);
                };
                $http.get('/api/gps/' + vm.numPoints).then(success, error);
            }
        };

        vm.stopDataInterval = function() {
            clearInterval(vm.interval);
            vm.timerIsOn = false;
            console.log('Stop GPS Real Time Data');
        };

        vm.startDataInterval = function () {
            if (!vm.timerIsOn) {
                //Update graph every 2 seconds
                vm.interval = setInterval(vm.updateMap, vm.fetchDataInterval);
                vm.timerIsOn = true;
                console.log('Start GPS Real Time Data');
            }
        };

        initialize();

        //What to do when you move out of scope
        $scope.$on('$destroy', function () {
            vm.stopDataInterval();
        });

    }

})();