/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    module.exports = {
        templateUrl: 'app/components/tableShellComponent/table-shell-component.html',
        controllerAs: 'vm',
        bindings: {
            options: '=',
            items: '='
        },
        controller: function ($scope) {

            console.log('Init table shell');

            var vm = this;


            this.$onInit = function () {

                console.log('$scope.options', $scope.options);

                //$scope.options = $scope.$parent.vm.options;
                //$scope.items = $scope.$parent.vm.items;
            };

            $scope.findSelectedFeature = function () {
                var selected = {isOpened: false, templateUrl: ''};
                //console.log('additionsStatus', $scope.additionsStatus);
                $scope.options.additionsStatus.extraFeatures.forEach(function (item) {
                    if (item.isOpened == true) {
                        selected = item;
                    }
                });
                //console.log(selected);

                return selected;
            };

            $scope.triggerResize = function () {

            };
        }
    }

}());