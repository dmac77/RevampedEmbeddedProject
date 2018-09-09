(function() {
    'use strict';

    angular.module('app')
        .controller('accelerometerController', accelerometerController);

    accelerometerController.$inject = ['$http', '$scope'];
    function accelerometerController($http, $scope) {
        let vm = this;

        //Hide or show the filter options
        vm.filter = $("#filter");
        vm.filter.on('hide.bs.collapse', function () {
            $("#showFilterBtn").text("Show Filters");
        });
        vm.filter.on('show.bs.collapse', function () {
            $("#showFilterBtn").text("Hide Filters");
        });

        //Set default filters
        vm.typeOfData = 'realtime';

        vm.numPoints = 100;
        vm.pointOptions = [100, 200, 500];

        vm.startDate = new Date();

        vm.startTime = new Date();
        vm.startTime.setHours(0, 0, 0, 0);

        vm.endDate = new Date();

        vm.endTime = new Date();
        vm.endTime.setHours(23, 59, 0, 0);

        //Determine what happens when "Apply Filters" is clicked
        vm.applyFilters = function () {
            //TODO: Data decimation
            if (vm.typeOfData === 'realtime') {
                vm.accelerationX = [];
                vm.accelerationY = [];
                vm.accelerationZ = [];
                vm.labels = [];
                vm.timestamps = [];
                vm.accelChart.options.tooltips.enabled = false;
                vm.updateAccelChart(vm.numPoints);
                vm.startDataInterval();
            }
            else {
                //Stop interval
                vm.stopDataInterval();

                //Set start time and end time
                let startTime = new Date();
                startTime.setFullYear(vm.startDate.getFullYear(), vm.startDate.getMonth(), vm.startDate.getDate());
                startTime.setHours(vm.startTime.getHours(), vm.startTime.getMinutes(), vm.startTime.getSeconds());

                let endTime = new Date();
                endTime.setFullYear(vm.endDate.getFullYear(), vm.endDate.getMonth(), vm.endDate.getDate());
                endTime.setHours(vm.endTime.getHours(), vm.endTime.getMinutes(), vm.endTime.getSeconds());

                if (vm.accelChart != null) {

                    let success = function (response) {
                        console.log(response);

                        //Update chart
                        vm.accelerationX = [];
                        vm.accelerationY = [];
                        vm.accelerationZ = [];
                        vm.labels = [];
                        vm.timestamps = [];
                        for (let i = 0; i < response.data.length; i++) {
                            vm.accelerationX.push(response.data[i].x);
                            vm.accelerationY.push(response.data[i].y);
                            vm.accelerationZ.push(response.data[i].z);
                            vm.labels.push(new Date(response.data[i].timestamp));
                            vm.timestamps.push(new Date(response.data[i].timestamp).getTime());
                        }
                        vm.accelChart.data.labels = vm.labels;
                        vm.accelChart.data.datasets[0].data = vm.accelerationX;
                        vm.accelChart.data.datasets[1].data = vm.accelerationY;
                        vm.accelChart.data.datasets[2].data = vm.accelerationZ;
                        vm.accelChart.options.tooltips.enabled = true;
                        vm.accelChart.update();
                    };

                    let error = function (response) {
                        console.log(response);
                    };

                    $http.get('/api/historicalAcceleration?startTime='
                        + startTime.getTime() + '&endTime=' + endTime.getTime()).then(success, error);
                }
            }
        };

        //Show or hide based on whether realtime or historical data is chosen
        let typeOfDataSelect = $("#typeOfData");
        $("#startDateRow").hide();
        $("#startTimeRow").hide();
        $("#endDateRow").hide();
        $("#endTimeRow").hide();
        $("#pointsRow").show();
        typeOfDataSelect.change(function () {
            vm.typeOfData = typeOfDataSelect.val();
            if (vm.typeOfData === 'realtime') {
                $("#startDateRow").hide();
                $("#startTimeRow").hide();
                $("#endDateRow").hide();
                $("#endTimeRow").hide();
                $("#pointsRow").show();
            }
            else {
                $("#startDateRow").show();
                $("#startTimeRow").show();
                $("#endDateRow").show();
                $("#endTimeRow").show();
                $("#pointsRow").hide();
            }
        });

        //Set data variables
        vm.accelerationX = [];
        vm.accelerationY = [];
        vm.accelerationZ = [];
        vm.labels = [];
        vm.timestamps = [];
        vm.accelChart = null;
        vm.fetchDataInterval = 1000; //In milliseconds

        //What happens when real time data is initially gotten
        vm.getInitialRealTimeData = function (points) {

            let success = function (response) {
                response.data.forEach(function(row) {
                    vm.accelerationX.splice(0, 0, row.x);
                    vm.accelerationY.splice(0, 0, row.y);
                    vm.accelerationZ.splice(0, 0, row.z);
                    vm.labels.splice(0, 0, new Date(row.timestamp));
                    vm.timestamps.splice(0, 0, new Date(row.timestamp).getTime());
                });

                let chartDiv = document.getElementById('accelChart').getContext('2d');
                let config = {
                    type: 'line',
                    data: {
                        labels: vm.labels,
                        datasets: [{
                            label: "X Axis",
                            data: vm.accelerationX,
                            backgroundColor: '#ff0012',
                            borderColor: '#ff0012',
                            fill: false
                        },
                        {
                            label: "Y Axis",
                            data: vm.accelerationY,
                            backgroundColor: '#000dff',
                            borderColor: '#000dff',
                            fill: false
                        },
                        {
                            label: "Z Axis",
                            data: vm.accelerationZ,
                            backgroundColor: '#005d18',
                            borderColor: '#005d18',
                            fill: false
                        }]
                    },
                    options: {
                        responsive: true,
                        responsiveAnimationDuration: 0, // animation duration after a resize
                        animation: {
                            duration: 0, // general animation time
                        },
                        hover: {
                            animationDuration: 0, // duration of animations when hovering an item
                        },
                        title: {
                            display: true,
                            fontSize: 20,
                            fontColor: '#1a1a1a',
                            text: 'Vehicle Acceleration'
                        },
                        tooltips: {
                            enabled: false,
                            position: 'nearest',
                            mode: 'index',
                            intersect: false,
                        },
                        elements: {
                            line: {
                                tension: 0, // disables bezier curves
                            }
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                time: {
                                    tooltipFormat: 'll HH:mm:ss',
                                    minUnit: 'second',
                                    stepSize: 5
                                },
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Time'
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'meters per second squared'
                                }
                            }]
                        }
                    }
                };
                vm.accelChart = new Chart(chartDiv, config);

                vm.startDataInterval();
            };

            let error = function (response) {
                console.log(response);
            };

            $http.get('/api/acceleration/' + points).then(success, error);
        };

        //What happens when the chart updates
        vm.updateAccelChart = function (points) {
            if (points === undefined) {
                points = 10;
            }
            if (vm.accelChart != null) {
                let success = function(response) {

                    //Update chart
                    for (let i = response.data.length - 1; i >= 0; i--) {
                        if (vm.timestamps.indexOf(new Date(response.data[i].timestamp).getTime()) === -1) {
                            vm.accelerationX.push(response.data[i].x);
                            vm.accelerationY.push(response.data[i].y);
                            vm.accelerationZ.push(response.data[i].z);
                            vm.labels.push(new Date(response.data[i].timestamp));
                            vm.timestamps.push(new Date(response.data[i].timestamp).getTime());
                        }

                        //Ensure there are not too many points on the graph
                        if (vm.accelerationX.length > vm.numPoints) {
                            vm.accelerationX.splice(0, 1);
                            vm.accelerationY.splice(0, 1);
                            vm.accelerationZ.splice(0, 1);
                            vm.labels.splice(0, 1);
                            vm.timestamps.splice(0, 1);
                        }
                    }
                    vm.accelChart.data.labels = vm.labels;
                    vm.accelChart.data.datasets[0].data = vm.accelerationX;
                    vm.accelChart.data.datasets[1].data = vm.accelerationY;
                    vm.accelChart.data.datasets[2].data = vm.accelerationZ;
                    vm.accelChart.update();
                };

                let error = function(response) {
                    console.log(response);
                };
                $http.get('/api/acceleration/' + points).then(success, error);
            }
        };

        vm.stopDataInterval = function() {
            clearInterval(vm.interval);
            vm.timerIsOn = false;
            console.log('Stop Acceleration Real Time Data');
        };

        vm.startDataInterval = function () {
            if (!vm.timerIsOn) {
                //Update graph every 2 seconds
                vm.interval = setInterval(vm.updateAccelChart, vm.fetchDataInterval);
                vm.timerIsOn = true;
                console.log('Start Acceleration Real Time Data');
            }
        };

        //Get the initial data
        vm.getInitialRealTimeData(vm.numPoints);

        //What to do when you move out of scope
        $scope.$on('$destroy', function () {
            vm.stopDataInterval();
        });
    }

})();