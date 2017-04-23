/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    //var fieldResolverService = require('../../services/fieldResolverService');

    module.exports = {
        bindings: {
            options: '=',
            reportOptions: '='
        },
        templateUrl: 'app/components/sidebarAreaComponent/sidebar-area-component.html',
        controllerAs: 'vm',
        controller: function ($scope) {

            //vm.options = vm.$parent.options;

            var vm = this;

            this.$onInit = function () {

                vm.filters = vm.options.filters;
                vm.isReport = vm.options.isReport;
                vm.entityType = vm.options.entityType;
                vm.externalCallback = vm.options.externalCallback;

                vm.fields = {};
                //vm.reportOptions = {};

                vm.filters.forEach(function (item) {
                    if (!item.options) {
                        //item.options = {enabled: false};
                    }
                    //item.options.enabled = false;
                });
            };



            vm.openReportSettings = function ($event) {

                //console.log('vm.reportOptions', vm.reportOptions);

                $mdDialog.show({
                    controller: 'GReportSettingsDialogController as vm',
                    templateUrl: 'views/dialogs/g-report-settings-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    locals: {
                        reportOptions: vm.reportOptions
                    }
                }).then(function (res) {

                    //console.log('res', res);

                    if (res.status == 'agree') {
                        vm.reportOptions = res.data;
                    }

                });


            };

            vm.calculateReport = function () {
                //console.log('calculate report');
                vm.reportOptions["task_id"] = undefined;
                vm.externalCallback({silent: false, options: {filters: vm.filters}});
            };

            vm.resizeFilterSideNav = function (actionType) {
                if (actionType === 'collapse') {
                    $('body').addClass('filter-side-nav-collapsed');
                    vm.sideNavCollapsed = true;
                } else {
                    $('body').removeClass('filter-side-nav-collapsed');
                    vm.sideNavCollapsed = false;
                }
                var interval = setInterval(function () {
                    $(window).trigger('resize');
                }, 50);

                setTimeout(function () {
                    clearInterval(interval)
                }, 300);
            };

            $scope.$watchCollection('filters', function () {

                //vm.externalCallback();

                var promises = [];

                vm.filters.forEach(function (item) {
                    //console.log("filter's item ", item);
                    if (!vm.fields.hasOwnProperty(item.key)) {
                        //if (item['value_type'] == "mc_field" || item['value_type'] == "field") {
                        //    if (item.key == 'tags') {
                        //        promises.push(fieldResolverService.getFields(item.key, {entityType: vm.entityType}));
                        //    } else {
                        //        promises.push(fieldResolverService.getFields(item.key));
                        //    }
                        //}

                        //console.log("filter's promises ", promises);
                    }
                });

                Promise.all(promises).then(function (data) {
                    //console.log("filter's data ", data);
                    data.forEach(function (item) {
                        vm.fields[item.key] = item.data;
                    });
                    $scope.$apply(
                        function () {
                            //setTimeout(function () {
                            //    $(elem).find('.md-select-search-pattern').on('keydown', function (ev) {
                            //        ev.stopPropagation();
                            //    });
                            //}, 100);
                        }
                    )
                    ;
                });
            });

            vm.openFilterSettings = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            vm.toggleFilterState = function () {
                if (vm.isReport == true) {
                    vm.externalCallback({silent: true, options: {filters: vm.filters}});
                } else {
                    vm.externalCallback({silent: false, options: {filters: vm.filters}});
                }
            };

            vm.filterChange = function (filter) {
                if (vm.isReport == true) {
                    vm.externalCallback({silent: true, options: {filters: vm.filters}});
                } else {
                    vm.externalCallback({silent: false, options: {filters: vm.filters}});
                }
            };

            vm.selectAll = function () {
                vm.filters.forEach(function (item) {
                    item.options.enabled = true;
                });
                if (vm.isReport == true) {
                    vm.externalCallback({silent: true, options: {filters: vm.filters}});
                } else {
                    vm.externalCallback({silent: false, options: {filters: vm.filters}});
                }
            };

            vm.clearAll = function () {
                vm.filters.forEach(function (item) {
                    item.options.query = '';
                });
                if (vm.isReport == true) {
                    vm.externalCallback({silent: true, options: {filters: vm.filters}});
                } else {
                    vm.externalCallback({silent: false, options: {filters: vm.filters}});
                }
            };

            vm.deselectAll = function () {
                vm.filters.forEach(function (item) {
                    item.options.enabled = false;
                });
                if (vm.isReport == true) {
                    vm.externalCallback({silent: true, options: {filters: vm.filters}});
                } else {
                    vm.externalCallback({silent: false, options: {filters: vm.filters}});
                }
            };

            vm.removeFilter = function (filter) {
                //console.log('filter to remove is ', filter);
                vm.filters = vm.filters.map(function (item) {
                    // if (item.id === filter.id || item.name === filter.name) {
                    if (item.name === filter.name) {
                        // return undefined;
                        item = undefined;
                    }
                    //console.log('filter in filters list', item);
                    return item;
                }).filter(function (item) {
                    return !!item;
                });

                vm.externalCallback({silent: true, options: {filters: vm.filters}});
            };


            vm.getFilterType = function (filterType) {
                switch (filterType) {
                    case 'field':
                    case 'mc_field':
                        return true;
                        break;
                    default:
                        return false;
                        break;
                }
            };
            //console.log('filter fields', vm.filters);
        }
    }

}());