/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    module.exports = {
        templateUrl: 'app/components/tableShellComponent/table-shell-component.html',
        controllerAs: 'vm',
        controller: function ($scope) {

            var vm = this;

            $scope.options = $scope.$parent.vm.options;
            $scope.items = $scope.$parent.vm.items;

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

            if ($scope.options.isRootEntityViewer == true) {

                $scope.$watch('options.editorEntityId', function (event, data) {

                    $scope.$broadcast('rootEditorEntityIdDown', {
                        editorEntityId: $scope.options.editorEntityId,
                        entityType: $scope.options.entityType
                    });
                });
            }

            $scope.checkAdditions = function () {
                if ($scope.options.additionsState == true && $scope.options.isRootEntityViewer == true && $scope.options.components.splitPanel == true) {
                    return true;
                }
                return false;
            }

        }
    }

}());