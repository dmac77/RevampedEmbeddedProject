(function() {
    'use strict';

    angular.module('app')
        .controller('rpmController', rpmController);

    rpmController.$inject = ['$http', '$scope'];
    function rpmController($http, $scope) {
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

        vm.numPoints = 20;
        vm.pointOptions = [20, 50, 100, 200, 500];

        vm.startDate = new Date();

        vm.startTime = new Date();
        vm.startTime.setHours(0, 0, 0, 0);

        vm.endDate = new Date();

        vm.endTime = new Date();
        vm.endTime.setHours(23, 59, 0, 0);

        //Determine what happens when "Apply Filters" is clicked
        vm.applyFilters = function () {
            if (vm.typeOfData === 'realtime') {
                vm.rpm = [];
                vm.labels = [];
                vm.timestamps = [];
                vm.updateRPMChart(vm.numPoints);
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

                if (vm.rpmChart != null) {

                    let success = function (response) {

                        //Update chart
                        vm.rpm = [];
                        vm.labels = [];
                        vm.timestamps = [];
                        for (let i = 0; i < response.data.length; i++) {
                            vm.rpm.push(response.data[i].rpm);
                            vm.labels.push(new Date(response.data[i].timestamp));
                            vm.timestamps.push(new Date(response.data[i].timestamp).getTime());
                        }
                        vm.rpmChart.data.labels = vm.labels;
                        vm.rpmChart.data.datasets[0].data = vm.rpm;
                        vm.rpmChart.update();
                    };

                    let error = function (response) {
                        console.log(response);
                    };

                    $http.get('/api/historicalRPM?startTime='
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
        vm.rpm = [];
        vm.labels = [];
        vm.timestamps = [];
        vm.rpmChart = null;
        vm.fetchDataInterval = 2000; //In milliseconds

        //What happens when real time data is initially gotten
        vm.getInitialRealTimeData = function (points) {

            let success = function (response) {

                response.data.forEach(function(row) {
                    vm.rpm.splice(0, 0, row.rpm);
                    vm.labels.splice(0, 0, new Date(row.timestamp));
                    vm.timestamps.splice(0, 0, new Date(row.timestamp).getTime());
                });

                let chartDiv = document.getElementById('rpmChart').getContext('2d');
                let config = {
                    type: 'line',
                    data: {
                        labels: vm.labels,
                        datasets: [{
                            label: "RPM",
                            data: vm.rpm,
                            backgroundColor: '#000000',
                            borderColor: '#878787',
                            fill: false
                        }],
                    },
                    options: {
                        responsive: true,
                        title: {
                            display: true,
                            fontSize: 20,
                            fontColor: '#1a1a1a',
                            text: 'Engine RPM'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        scales: {
                            xAxes: [{
                                type: 'time',
                                time: {
                                    tooltipFormat: 'll HH:mm:ss',
                                    minUnit: 'second'
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
                                    labelString: 'RPM'
                                }
                            }]
                        }
                    }
                };
                vm.rpmChart = new Chart(chartDiv, config);

                vm.startDataInterval();
            };

            let error = function (response) {
                console.log(response);
            };

            $http.get('/api/rpm/' + points).then(success, error);
        };

        //What happens when the chart updates
        vm.updateRPMChart = function (points) {
            if (points === undefined) {
                points = 1;
            }
            if (vm.rpmChart != null) {
                let success = function(response) {

                    //Update chart
                    for (let i = response.data.length - 1; i >= 0; i--) {
                        if (vm.timestamps.indexOf(new Date(response.data[i].timestamp).getTime()) === -1) {
                            vm.rpm.push(response.data[i].rpm);
                            vm.labels.push(new Date(response.data[i].timestamp));
                            vm.timestamps.push(new Date(response.data[i].timestamp).getTime());
                        }

                        //Ensure there are not too many points on the graph
                        if (vm.rpm.length > vm.numPoints) {
                            vm.rpm.splice(0, 1);
                            vm.labels.splice(0, 1);
                            vm.timestamps.splice(0, 1);
                        }
                    }
                    vm.rpmChart.data.labels = vm.labels;
                    vm.rpmChart.data.datasets[0].data = vm.rpm;
                    vm.rpmChart.update();
                };

                let error = function(response) {
                    console.log(response);
                };
                $http.get('/api/rpm/' + points).then(success, error);
            }
        };

        vm.stopDataInterval = function() {
            clearInterval(vm.interval);
            vm.timerIsOn = false;
            console.log('Stop RPM Real Time Data');
        };

        vm.startDataInterval = function () {
            if (!vm.timerIsOn) {
                //Update graph every 2 seconds
                vm.interval = setInterval(vm.updateRPMChart, vm.fetchDataInterval);
                vm.timerIsOn = true;
                console.log('Start RPM Real Time Data');
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