/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');

    module.exports = {
        bindings: {
            items: '=',
            options: '='
        },
        templateUrl: 'app/components/columnAreaComponent/column-area-component.html',
        controllerAs: 'vm',
        controller: function ($scope) {

            $scope.options = $scope.$parent.options;

            $scope.grouping = $scope.options.grouping;
            $scope.filters = $scope.options.filters;
            $scope.sorting = $scope.options.sorting;
            $scope.columns = $scope.options.columns;
            $scope.entityType = $scope.options.entityType;
            $scope.externalCallback = $scope.options.externalCallback;
            $scope.isReport = $scope.options.isReport;

            var baseAttrs = [];
            var entityAttrs = [];
            if (metaService.getEntitiesWithoutBaseAttrsList().indexOf($scope.entityType) === -1) {
                baseAttrs = metaService.getBaseAttrs();
            }
            entityAttrs = metaService.getEntityAttrs($scope.entityType);

            $scope.isAllSelected = false;

            $scope.selectAllRows = function () {
                $scope.isAllSelected = !$scope.isAllSelected;
                $scope.items.forEach(function (item) {
                    if (item.hasOwnProperty('groups')) {
                        item.selectedRow = $scope.isAllSelected;
                        item.items.forEach(function (row) {
                            row.selectedRow = $scope.isAllSelected;
                        })
                    } else {
                        item.selectedRow = $scope.isAllSelected;
                    }
                })
            };

            $scope.isColumnFloat = function (column) {

                if (column.value_type == 'float' || column.value_type == 20) {
                    return true
                }

                return false;
            };

            $scope.sortHandler = function (column, sort) {
                var i;
                for (i = 0; i < $scope.columns.length; i = i + 1) {
                    if (!$scope.columns[i].options) {
                        $scope.columns[i].options = {};
                    }
                    $scope.columns[i].options.sort = null;
                }
                column.options.sort = sort;

                if (column.hasOwnProperty('id')) {
                    $scope.sorting.column.id = column.id;
                    $scope.sorting.column.key = null;
                    $scope.sorting.column.sort = sort;
                } else {
                    $scope.sorting.column.id = null;
                    $scope.sorting.column.key = column.key;
                    $scope.sorting.column.sort = sort;
                }
                $scope.externalCallback({silent: true, options: {columns: $scope.columns}});
            };

            $scope.selectSubtotalType = function (column, type) {

                if (!column.hasOwnProperty('report_settings')) {
                    column.report_settings = {};
                }

                if (column.report_settings.subtotal_formula_id == type) {
                    column.report_settings.subtotal_formula_id = null;
                } else {
                    column.report_settings.subtotal_formula_id = type;
                }

                //console.log('$scope.column11111s JSON', JSON.parse(JSON.stringify(column)));
                //console.log('$scope.column11111s JSON', JSON.parse(JSON.stringify($scope.columns)));

                $scope.externalCallback({silent: true, options: {columns: $scope.columns}});
            };

            $scope.checkSubtotalFormula = function (column, type) {

                if (column.hasOwnProperty('report_settings') && column.report_settings) {
                    if (column.report_settings.subtotal_formula_id == type) {
                        return true;
                    }

                }

                return false

            };

            $scope.$watchCollection('columns', function () {


                setTimeout(function () {

                    $scope.externalCallback({silent: true, options: {columns: $scope.columns}});
                    $scope.$apply();

                }, 0)
            });

            $scope.removeColumn = function (column) {
                if (column.id) {
                    $scope.columns = $scope.columns.map(function (item) {
                        if (item.id === column.id || item.key === column.key) {
                            item = undefined
                        }
                        return item
                    }).filter(function (item) {
                        return !!item;
                    });
                }
                if (column.key) {
                    $scope.columns = $scope.columns.map(function (item) {
                        if (item.key === column.key) {
                            return undefined
                        }
                        return item
                    }).filter(function (item) {
                        return !!item;
                    });
                }
                //console.log('remove', $scope.columns);

                //console.log('$scope.columns', $scope.columns)

                setTimeout(function () {
                    $scope.externalCallback({silent: true, options: {columns: $scope.columns}});
                }, 0)
            };

            $scope.reportHideSubtotal = function (column) {

                if (!column.hasOwnProperty('report_settings')) {
                    column.report_settings = {};
                }

                column.report_settings.hide_subtotal = !column.report_settings.hide_subtotal;

            }
        }
    }

}());