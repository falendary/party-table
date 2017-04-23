/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    module.exports = {
        bindings: {
            options: '='
        },
        templateUrl: 'app/components/groupingAreaComponent/grouping-area-component.html',
        controllerAs: 'vm',
        controller: function ($scope, ptDialog) {

            //vm.options = vm.$parent.options;

            var vm = this;

            console.log('grouping', vm);

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

            vm.sortHandler = function (group, sort) {
                var i;
                for (i = 0; i < vm.grouping.length; i = i + 1) {
                    if (!vm.grouping[i].options) {
                        vm.grouping[i].options = {};
                    }
                    vm.grouping[i].options.sort = null;
                }
                group.options.sort = sort;
                if (group.hasOwnProperty('id')) {
                    vm.sorting.group = {};
                    vm.sorting.group.id = group.id;
                    vm.sorting.group.key = null;
                    vm.sorting.group.sort = sort;
                } else {
                    vm.sorting.group = {};
                    vm.sorting.group.id = null;
                    vm.sorting.group.key = group.key;
                    vm.sorting.group.sort = sort;
                }
                vm.externalCallback({silent: true, options: {grouping: vm.grouping}});
            };

            vm.openGroupSettings = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            $scope.$watchCollection('grouping', function () {


                if (vm.isReport == true) {
                    vm.grouping.forEach(function (group) {

                        if (!group.hasOwnProperty('report_settings') && !group.report_settings) {
                            group.report_settings = {subtotal_type: 'area'};
                        } else {
                            if (group.report_settings.subtotal_type == undefined) {
                                group.report_settings.subtotal_type = 'area';
                            }

                        }

                    })
                }

                setTimeout(function () {
                    vm.externalCallback({silent: true, options: {grouping: vm.grouping}});
                    $scope.$apply();
                }, 0)
            });

            vm.toggleGroupFold = function () {
                vm.folding = !vm.folding;
                setTimeout(function () {
                    vm.externalCallback({silent: true, options: {grouping: vm.grouping}});
                    $scope.$apply();
                }, 0)
            };

            vm.removeGroup = function (group) {
                //console.log('grouping', vm.grouping);
                //console.log('remove', group);
                if (group.id) {
                    vm.grouping = vm.grouping.map(function (item) {
                        if (item.id === group.id) {
                            item = undefined
                        }
                        return item
                    }).filter(function (item) {
                        return !!item;
                    });
                }
                if (group.name) {
                    vm.grouping = vm.grouping.map(function (item) {
                        if (item.name === group.name) {
                            item = undefined
                        }
                        return item
                    }).filter(function (item) {
                        return !!item;
                    });
                }
                //console.log('grouping after', vm.grouping);
                setTimeout(function () {
                    vm.externalCallback({silent: true, options: {grouping: vm.grouping}});
                }, 0)
            };

            vm.reportSetSubtotalType = function (group, type, $index) {

                if (!group.hasOwnProperty('report_settings') || group.report_settings == undefined) {
                    group.report_settings = {};
                }

                if (type == 'area') {

                    vm.grouping.forEach(function (groupItem, $itemIndex) {

                        if ($itemIndex > $index) {
                            groupItem.disableLineSubtotal = true;

                            //console.log('group', groupItem);

                            if (groupItem.hasOwnProperty('report_settings')) {

                                if (groupItem.report_settings.subtotal_type == 'line') {
                                    groupItem.report_settings.subtotal_type = false;
                                }
                            }
                        } else {
                            if ($itemIndex < $index) {
                                groupItem.disableLineSubtotal = false;
                            }
                        }


                    });
                }

                if (type == 'line') {

                    vm.grouping.forEach(function (groupItem, $itemIndex) {

                        if ($itemIndex > $index) {
                            groupItem.disableLineSubtotal = false;
                        }

                    });
                }

                if (group.report_settings.subtotal_type == type) {
                    group.report_settings.subtotal_type = false;
                } else {
                    group.report_settings.subtotal_type = type;
                }


                vm.externalCallback({silent: true, options: {grouping: vm.grouping}});
            };

            vm.isReportGroupHaveExtSettings = function (group, $index, subtotalType) {

                var haveAccess = false;
                var preInitOffset = 0;
                var initIndex = 0;

                vm.grouping.forEach(function (groupItem, $groupItemIndex) {

                    if (vm.columns.length > $groupItemIndex) {
                        if (groupItem.hasOwnProperty('id')) {
                            if (groupItem.id == vm.columns[$groupItemIndex - preInitOffset].id) {
                                initIndex = preInitOffset;
                            } else {
                                preInitOffset = preInitOffset + 1;
                            }
                        } else {
                            if (groupItem.hasOwnProperty('key') && vm.columns[$groupItemIndex] && vm.columns[$groupItemIndex].hasOwnProperty('key')) {

                                if (groupItem.key == vm.columns[$groupItemIndex - preInitOffset].key) {
                                    initIndex = preInitOffset;
                                } else {
                                    preInitOffset = preInitOffset + 1;
                                }
                            } else {
                                preInitOffset = preInitOffset + 1;
                            }
                        }
                    }

                });

                if (vm.columns.length > $index) {
                    if (group.hasOwnProperty('id') && vm.columns[$index - initIndex] && vm.columns[$index - initIndex].hasOwnProperty('id')) {
                        if (group.id == vm.columns[$index - initIndex].id) {
                            haveAccess = true;
                        }
                    } else {
                        if (group.hasOwnProperty('key') && vm.columns[$index - initIndex] && vm.columns[$index - initIndex].hasOwnProperty('key')) {
                            if (group.key == vm.columns[$index - initIndex].key) {
                                haveAccess = true;
                            }
                        }

                    }
                }

                if (group.hasOwnProperty('disableLineSubtotal') && group.disableLineSubtotal == true && subtotalType == 'line') {
                    haveAccess = false;
                }

                return haveAccess;

            };

            vm.openModalSettings = function (ev) {

                console.log('ptDialog', ptDialog);

                ptDialog.create({
                    controller: 'DialogController as vm', // ../directives/gTable/gModalComponents
                    templateUrl: 'app/controllers/dialogController/dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    locals: {
                        data: {
                            callback: vm.externalCallback,
                            parent$scope: $scope
                        }
                    }
                });

            }
        }
    }

}());