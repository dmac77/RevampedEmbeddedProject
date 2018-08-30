(function() {
    'use strict';

    angular.module('app')
        .controller('homeController', homeController);

    homeController.$inject = ['$http'];
    function homeController($http) {
        let vm = this;
    }

})();