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

            console.log('Init groping');

            var vm = this;

            console.log('$scope', vm.options);
            console.log('$scope', $scope);

            //vm.options = vm.$parent.options;

            this.$onInit = function () {

                vm.grouping = vm.options.grouping;
                vm.filters = vm.options.filters;
                vm.columns = vm.options.columns;
                vm.sorting = vm.options.sorting;
                vm.folding = vm.options.folding;
                vm.entityType = vm.options.entityType;
                vm.externalCallback = vm.options.externalCallback;
                vm.isReport = vm.options.isReport;

            };

            var baseAttrs = [];
            var entityAttrs = [];
            if (metaService.getEntitiesWithoutBaseAttrsList().indexOf(vm.entityType) === -1) {
                baseAttrs = metaService.getBaseAttrs();
            }
            entityAttrs = metaService.getEntityAttrs(vm.entityType);

            vm.isAllSelected = false;

            vm.selectAllRows = function () {
                vm.isAllSelected = !vm.isAllSelected;
                vm.items.forEach(function (item) {
                    if (item.hasOwnProperty('groups')) {
                        item.selectedRow = vm.isAllSelected;
                        item.items.forEach(function (row) {
                            row.selectedRow = vm.isAllSelected;
                        })
                    } else {
                        item.selectedRow = vm.isAllSelected;
                    }
                })
            };

            vm.isColumnFloat = function (column) {

                if (column.value_type == 'float' || column.value_type == 20) {
                    return true
                }

                return false;
            };

            vm.sortHandler = function (column, sort) {
                var i;
                for (i = 0; i < vm.columns.length; i = i + 1) {
                    if (!vm.columns[i].options) {
                        vm.columns[i].options = {};
                    }
                    vm.columns[i].options.sort = null;
                }
                column.options.sort = sort;

                if (column.hasOwnProperty('id')) {
                    vm.sorting.column.id = column.id;
                    vm.sorting.column.key = null;
                    vm.sorting.column.sort = sort;
                } else {
                    vm.sorting.column.id = null;
                    vm.sorting.column.key = column.key;
                    vm.sorting.column.sort = sort;
                }
                vm.externalCallback({silent: true, options: {columns: vm.columns}});
            };

            vm.selectSubtotalType = function (column, type) {

                if (!column.hasOwnProperty('report_settings')) {
                    column.report_settings = {};
                }

                if (column.report_settings.subtotal_formula_id == type) {
                    column.report_settings.subtotal_formula_id = null;
                } else {
                    column.report_settings.subtotal_formula_id = type;
                }

                //console.log('vm.column11111s JSON', JSON.parse(JSON.stringify(column)));
                //console.log('vm.column11111s JSON', JSON.parse(JSON.stringify(vm.columns)));

                vm.externalCallback({silent: true, options: {columns: vm.columns}});
            };

            vm.checkSubtotalFormula = function (column, type) {

                if (column.hasOwnProperty('report_settings') && column.report_settings) {
                    if (column.report_settings.subtotal_formula_id == type) {
                        return true;
                    }

                }

                return false

            };

            vm.removeColumn = function (column) {

                vm.columns = vm.columns.map(function (item) {
                    if (item.key === column.key) {
                        return undefined
                    }
                    return item;
                }).filter(function (item) {
                    return !!item;
                });

                vm.externalCallback({silent: true, options: {columns: vm.columns}});

            };

            vm.reportHideSubtotal = function (column) {

                if (!column.hasOwnProperty('report_settings')) {
                    column.report_settings = {};
                }

                column.report_settings.hide_subtotal = !column.report_settings.hide_subtotal;

            }
        }
    }

}());