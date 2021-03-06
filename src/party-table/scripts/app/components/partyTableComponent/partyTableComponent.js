/**
 * Created by szhitenev on 10.03.2017.
 */
(function () {

    'use strict';

    var GroupTableService = require('../../services/groupTableService');
    var entityService = require('../../services/entityService');

    module.exports = {
        bindings: {
            options: '='
        },
        controllerAs: 'vm',
        templateUrl: 'app/components/partyTableComponent/party-table-component.html',
        controller: function ($scope) {

            var vm = this;

            console.log('party table', vm);

            vm.groupTableService = GroupTableService.getInstance(true);

            vm.entityType = 'entity';

            var updateOptions = function (params) {
                if (params.hasOwnProperty('grouping')) {
                    vm.options.grouping = params.grouping;
                }
                if (params.hasOwnProperty('columns')) {
                    vm.options.columns = params.columns;
                }
                if (params.hasOwnProperty('filters')) {
                    vm.options.filters = params.filters;
                }
            };

            var defaultOptions = {
                columns: [],
                filters: [],
                grouping: [],
                sorting: {
                    group: {},
                    column: {}
                },
                folding: [],
                entity_models: [],
                grouping_type: 'area',
                interface: {
                    dragging: false
                },
                externalCallback: function (params) {

                    console.log('params', params);

                    if (params.hasOwnProperty('options')) {
                        updateOptions(params.options);
                    }

                    console.log('vm.options', vm.options);

                    vm.options.lastUpdate = new Date().getTime();

                    vm.originalItems = JSON.parse(JSON.stringify(vm.items));

                    vm.groupTableService.setItems(vm.originalItems);

                    vm.groupTableService.columns.setColumns(vm.options.columns);
                    vm.groupTableService.filtering.setFilters(vm.options.filters);

                    //console.log('vm.options.grouping_type', vm.options.grouping_type);

                    if (vm.options.grouping_type == 'area') {
                        vm.groupTableService.grouping.setGroupsWithColumns(vm.options.grouping, vm.options.columns, vm.options.entity_models);
                        vm.groupTableService.sorting.group.sort(vm.options.sorting.group);
                    }
                    if (vm.options.grouping_type == 'breadcrumbs') {
                        vm.groupTableService.grouping.setGroups(vm.options.grouping, vm.options.entity_models);
                        vm.groupTableService.sorting.group.sort(vm.options.sorting.group);
                        vm.groupTableService.sorting.column.sort(vm.options.sorting.column);
                    }
                    //console.log("EXTERNAL CALLBACK ", vm.folding);
                    //vm.groupTableService.folding.setFolds(vm.options.folding);
                    //console.log('UPDATE TABLE scope.sorting.group', vm.sorting.group);

                    //console.log('vm.options', vm.options);

                    //console.log('vm.options.sorting.group', vm.options.sorting.group);


                    //console.log('projection', vm.groupTableService.projection());
                },

                pagination: {
                    itemsPerPage: 20,
                    currentPage: 1,
                    paginationItemsTotal: 0
                }
            };

            function extendDefaults(options, defaults) {

                var optionsKeys = Object.keys(options);
                var defaultKeys = Object.keys(defaults);

                defaultKeys.forEach(function (defaultKey) {

                    var exist = false;

                    optionsKeys.forEach(function (key) {
                        if (key == defaultKey) {
                            exist = true;
                        }
                    });

                    if (!exist) {
                        options[defaultKey] = defaults[defaultKey];
                    }

                });

                return options;

            }

            this.$onInit = function () {

                console.log('Init party table');

                vm.items = vm.options.items;
                vm.options = extendDefaults(vm.options, defaultOptions);

                console.log('$scope.options', vm.options);

                entityService.setEntities(vm.options.entity_models);

                //console.log('vm.options', vm.options);
            };


        }
    }

}());