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

            $scope.options = $scope.$parent.options;

            $scope.filters = $scope.options.filters;
            $scope.isReport = $scope.options.isReport;
            $scope.entityType = $scope.options.entityType;
            $scope.externalCallback = $scope.options.externalCallback;

            $scope.fields = {};
            //$scope.reportOptions = {};

            $scope.filters.forEach(function (item) {
                if (!item.options) {
                    //item.options = {enabled: false};
                }
                //item.options.enabled = false;
            });

            $scope.openReportSettings = function ($event) {

                //console.log('$scope.reportOptions', $scope.reportOptions);

                $mdDialog.show({
                    controller: 'GReportSettingsDialogController as vm',
                    templateUrl: 'views/dialogs/g-report-settings-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: $event,
                    locals: {
                        reportOptions: $scope.reportOptions
                    }
                }).then(function (res) {

                    //console.log('res', res);

                    if (res.status == 'agree') {
                        $scope.reportOptions = res.data;
                    }

                });


            };

            $scope.calculateReport = function () {
                //console.log('calculate report');
                $scope.reportOptions["task_id"] = undefined;
                $scope.externalCallback({silent: false, options: {filters: $scope.filters}});
            };

            $scope.resizeFilterSideNav = function (actionType) {
                if (actionType === 'collapse') {
                    $('body').addClass('filter-side-nav-collapsed');
                    $scope.sideNavCollapsed = true;
                } else {
                    $('body').removeClass('filter-side-nav-collapsed');
                    $scope.sideNavCollapsed = false;
                }
                var interval = setInterval(function () {
                    $(window).trigger('resize');
                }, 50);

                setTimeout(function () {
                    clearInterval(interval)
                }, 300);
            };

            $scope.$watchCollection('filters', function () {

                //$scope.externalCallback();

                var promises = [];

                $scope.filters.forEach(function (item) {
                    //console.log("filter's item ", item);
                    if (!$scope.fields.hasOwnProperty(item.key)) {
                        //if (item['value_type'] == "mc_field" || item['value_type'] == "field") {
                        //    if (item.key == 'tags') {
                        //        promises.push(fieldResolverService.getFields(item.key, {entityType: $scope.entityType}));
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
                        $scope.fields[item.key] = item.data;
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

            $scope.openFilterSettings = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            $scope.toggleFilterState = function () {
                if ($scope.isReport == true) {
                    $scope.externalCallback({silent: true, options: {filters: $scope.filters}});
                } else {
                    $scope.externalCallback({silent: false, options: {filters: $scope.filters}});
                }
            };

            $scope.filterChange = function (filter) {
                if ($scope.isReport == true) {
                    $scope.externalCallback({silent: true, options: {filters: $scope.filters}});
                } else {
                    $scope.externalCallback({silent: false, options: {filters: $scope.filters}});
                }
            };

            $scope.selectAll = function () {
                $scope.filters.forEach(function (item) {
                    item.options.enabled = true;
                });
                if ($scope.isReport == true) {
                    $scope.externalCallback({silent: true, options: {filters: $scope.filters}});
                } else {
                    $scope.externalCallback({silent: false, options: {filters: $scope.filters}});
                }
            };

            $scope.clearAll = function () {
                $scope.filters.forEach(function (item) {
                    item.options.query = '';
                });
                if ($scope.isReport == true) {
                    $scope.externalCallback({silent: true, options: {filters: $scope.filters}});
                } else {
                    $scope.externalCallback({silent: false, options: {filters: $scope.filters}});
                }
            };

            $scope.deselectAll = function () {
                $scope.filters.forEach(function (item) {
                    item.options.enabled = false;
                });
                if ($scope.isReport == true) {
                    $scope.externalCallback({silent: true, options: {filters: $scope.filters}});
                } else {
                    $scope.externalCallback({silent: false, options: {filters: $scope.filters}});
                }
            };


            if ($scope.options.isRootEntityViewer == false) {

                $scope.$on('rootEditorEntityIdDown', function (event, data) {

                    $scope.filters.forEach(function (item) {
                        //console.log('item', item);
                        if (item.hasOwnProperty('options') && item.options.useFromAbove == true) {

                            if (item.key == data.entityType) {
                                item.options.query = [data.editorEntityId]
                            }

                        }

                    });

                    $scope.externalCallback({silent: true, options: {filters: $scope.filters}});

                });
            }

            $scope.useFromAbove = function (filter) {

                if (!filter.hasOwnProperty('options')) {
                    filter.options = {};
                }

                filter.options.useFromAbove = !filter.options.useFromAbove;

                $scope.externalCallback({silent: true, options: {filters: $scope.filters}});
            };

            $scope.removeFilter = function (filter) {
                //console.log('filter to remove is ', filter);
                $scope.filters = $scope.filters.map(function (item) {
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

                $scope.externalCallback({silent: true, options: {filters: $scope.filters}});
            };


            $scope.getFilterType = function (filterType) {
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
            //console.log('filter fields', $scope.filters);
        }
    }

}());