/**
 * Created by szhitenev on 10.03.2017.
 */
(function () {

    'use strict';

    module.exports = {
        bindings: {
            items: '=',
            options: '='
        },
        controllerAs: 'vm',
        templateUrl: 'app/components/partyTableComponent/party-table-component.html',
        controller: function ($scope) {

            var vm = this;

            console.log('party table', vm);

            var defaultOptions = {
                columns: [],
                filters: [],
                grouping: [],
                sorting: [],
                folding: [],
                externalCallback: function () {
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
                vm.options = extendDefaults(vm.options, defaultOptions);

                console.log('vm.options', vm.options);
            };


        }
    }

}());