/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var groupTableReportService = require('../../services/groupTableReportService');
    var GroupTableService = require('../../services/groupTableService');

    module.exports = {
        bindings: {
            options: '=',
            items: '='
        },
        templateUrl: 'app/components/tableBodyComponent/table-body-component.html',
        controllerAs: 'vm',
        controller: function ($scope) {

            console.log('Init table body');

            var vm = this;

            console.log('vm.options', vm.options);

            var entityType = vm.entityType;
            var baseAttrs = [];
            var entityAttrs = [];

            var promisesEntityFieldsAlreadyAdded = [];
            var promisesAttributeTypesAlreadyAdded = {};

            var entityFieldsArray = {};

            var groupTableService = GroupTableService.getInstance();

            this.$onInit = function () {

                vm.externalCallback = vm.options.externalCallback;
                vm.grouping = vm.options.grouping;
                vm.columns = vm.options.columns;
                vm.entityType = vm.options.entityType;
                vm.reportIsReady = vm.options.reportIsReady;
                vm.grouping_type = vm.options.grouping_type;

                vm.readyStatus = {
                    cellsFirstReady: false,
                    cellsSecondReady: false,
                    attributeTypesReady: false,
                    classifiersReady: false
                }; // if groups not exist


               groupTableService = GroupTableService.getInstance();

                setTimeout(function () {

                    $scope.$watch('options.lastUpdate', function () {

                        if (vm.grouping_type == 'area') {
                            vm.reportItems = groupTableReportService.transformItems(groupTableService.projection())
                        }
                    });


                }, 0)

            };

            //vm.options = vm.$parent.options;
            //vm.items = vm.$parent.items;


            vm.itemsProjection = function () {
                return groupTableService.projection();
            };

            //
            //vm.reportItemsProjection = function () {
            //    return vm.reportItems;
            //};

            function getCellsCaptionsPatterns(item, itemIndex) {

                var result = [];

                item.cellsCaptions.forEach(function (cellCaption, $index) {
                    if ($index <= itemIndex) {
                        result.push(cellCaption.comparePattern);
                    }
                });

                return result.join('_-_');
            }

            vm.toggleGroupFold = function (item, $index) {

                if (vm.grouping_type == 'area') {

                    item.cellsCaptions[$index].isFolded = !item.cellsCaptions[$index].isFolded;

                    item.subTotal = item.cellsCaptions[$index].subTotal;

                    var itemCellCaptionsPatterns = getCellsCaptionsPatterns(item, $index);

                    var localItems = []; // to find first element, and revert isFolded;

                    vm.reportItems.forEach(function (reportItem) {

                        var reportCellCaptionsPatterns = getCellsCaptionsPatterns(reportItem, $index);

                        if (itemCellCaptionsPatterns == reportCellCaptionsPatterns) {

                            reportItem.isFirstOfFolded = false;
                            reportItem.cellsCaptions[$index].isFolded = item.cellsCaptions[$index].isFolded;

                            localItems.push(reportItem);
                        }


                    });


                    //localItems[0].isFirstOfFolded = true;
                    localItems[0].isFirstOfFolded = item.cellsCaptions[$index].isFolded;

                    localItems.forEach(function (locItem) {

                        locItem.cellsCaptions.forEach(function (cellCaption, cellCaptionIndex) {

                            if (cellCaptionIndex > $index) {
                                cellCaption.isFolded = false;
                            }

                        })


                    });

                    //console.log('localItems', localItems);

                } else {
                    item.isFolded = !item.isFolded;
                }
            };

            vm.itemIsFolded = function (item) {

                var isShowed = true;

                //console.log('item', item);
                if (item.hasOwnProperty('cellsCaptions')) {
                    if (item.isFirstOfFolded != true) {
                        item.cellsCaptions.forEach(function (cellCaption) {

                            if (cellCaption.hasOwnProperty('isFolded') && cellCaption.isFolded == true) {
                                isShowed = false;
                            }

                        });
                    }
                }


                return isShowed;

            };

            vm.openEntityMenu = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            vm.checkReportColumnCaption = function (cellsCaptions, column, $columnIndex) {

                if ($columnIndex > cellsCaptions.length - 1) { // 1 - index
                    return false;
                }

                // todo cellCaptions[columnIndex] == column

                return true;

            };

            function findGroups() {

                return new Promise(function (resolve, reject) {

                    var i, g;
                    var promisesClassifiers = [];
                    var promisesEntityFields = [];


                    var items = vm.items;
                    var classifierExist = false;
                    var entityExist = false;

                    //console.log('ITEMS', items);

                    for (i = 0; i < vm.items.length; i = i + 1) {
                        //console.log('vm.items[i].groups', vm.items[i].groups);
                        if (vm.items[i].hasOwnProperty('groups')) {
                            for (g = 0; g < vm.items[i].groups.length; g = g + 1) {

                                entityExist = false;

                                if (vm.items[i].groups[g]['value_type'] === 'field') {

                                    if (vm.items[i].groups[g].value !== null) {

                                        promisesEntityFieldsAlreadyAdded.forEach(function (entity) {
                                            if (entity == vm.items[i].groups[g].key + '_' + vm.items[i].groups[g].value) {
                                                entityExist = true;
                                            }
                                        });

                                        if (!entityExist) {
                                            promisesEntityFieldsAlreadyAdded.push(vm.items[i].groups[g].key + '_' + vm.items[i].groups[g].value);
                                            //promisesEntityFields.push(bindCellService.getByKey(vm.items[i].groups[g].key, vm.items[i].groups[g].value, {entityType: vm.entityType}))
                                        }
                                    }
                                }
                            }
                        }
                    }


                    Promise.all(promisesEntityFields).then(function (data) {

                        if (data.length) {
                            var i;

                            //console.log('data', data);

                            for (i = 0; i < data.length; i = i + 1) {

                                if (entityFieldsArray[data[i].key] == undefined) {
                                    entityFieldsArray[data[i].key] = [];
                                }
                                entityFieldsArray[data[i].key].push(data[i].data);
                            }
                        }

                        vm.readyStatus.cellsFirstReady = true;
                        //console.log('cells first ready');
                        resolve({status: "groups ready"});


                    }).then(function () {
                        $scope.$apply();
                    })

                })
            }

            vm.isSubtotalHided = function (column) {
                if (column.hasOwnProperty('report_settings') && column.report_settings) {

                    //console.log('colum222222222222222n', column);
                    if (column.report_settings.subtotal_formula_id) {
                        if (column.report_settings.hide_subtotal == true) {
                            return false;
                        }
                        return true;
                    } else {
                        return false;
                    }
                }

                return true;
            };

            vm.checkRowSelection = function (item) {
                //console.log('checkRowSelection', item);

                if (item) {
                    if (item.selectedRow || item.simpleSelect) {
                        return true;
                    }
                }
                return false;
            };

            vm.toggleSelectRow = function ($event, item) {

                if (item.simpleSelect == true) {
                    item.simpleSelect = false;
                }
                item.selectedRow = !item.selectedRow;
                if (vm.isAllSelected === true && item.selectedRow === false) {
                    vm.isAllSelected = false;
                }

                var allSelected = true;
                vm.items.forEach(function (item) {
                    if (item.hasOwnProperty('groups')) {
                        if (!!item.selectedRow === false) {
                            allSelected = false;
                        }
                        item.items.forEach(function (row) {
                            if (!!row.selectedRow === false) {
                                allSelected = false;
                            }
                        })
                    } else {
                        if (!!item.selectedRow === false) {
                            allSelected = false;
                        }
                    }
                });

                if (allSelected) {
                    vm.isAllSelected = true;
                }
                $event.stopPropagation();
            };

            //vm.checkReady = function () {
            //
            //    //console.log('vm.options.reportIsReady', vm.options.reportIsReady);
            //
            //    return true;
            //
            //    if (vm.readyStatus.cellsFirstReady == true &&
            //        vm.readyStatus.cellsSecondReady == true &&
            //        vm.readyStatus.classifiersReady == true &&
            //            //vm.reportIsReady == true &&
            //        vm.options.reportIsReady == true &&
            //        vm.readyStatus.attributeTypesReady == true) {
            //
            //        vm.$parent.triggerResize();
            //
            //        return true;
            //    }
            //    return false;
            //};

            vm.bindGroupValue = function (group) {

                //console.log('group', group);

                var result = '';

                if (group.value_type == 'integer'
                    || group.value_type == 'float'
                    || group.value_type == 'string'
                    || group.value_type == 'date'
                    || group.value_type == 'value_string'
                    || group.value_type == 'value_float'
                    || group.value_type == 'value_date'
                ) {
                    result = group.value;
                }

                //console.log('result string', result);

                return result;
            };

            vm.bindCellSubTotal = function (values, column) {

                //console.log(column);

                var result = '';

                if (column.hasOwnProperty('key')) {
                    result = values[column.key];
                }

                if (result !== undefined) {

                    if (column.value_type == 20 || column.value_type == 'float') {
                        return result.toFixed(2) + '';
                    } else {
                        return result;
                    }
                }

            };

            vm.bindCell = function (groupedItem, column, options) {

                if (column.hasOwnProperty('r_entityType')) {

                    return groupedItem[column.r_entityType + '_attribute_' + column.source_name];

                }

                function findNodeInChildren(item) {
                    if (groupedItem[column.name] == item.id) {
                        classifierNode = item;
                    } else {
                        if (item.children.length) {
                            item.children.forEach(findNodeInChildren);
                        }
                    }
                }

                //console.log('column', column);

                if (column.hasOwnProperty('id')) {
                    if (column['value_type'] === 30) {
                        var classifierNode;
                        if (entityFieldsArray && entityFieldsArray['classifier_' + column.id]) {
                            entityFieldsArray['classifier_' + column.id].classifiers.forEach(findNodeInChildren);
                            if (classifierNode) {
                                if (classifierNode['display_name']) {
                                    return classifierNode['display_name'];
                                }
                                return classifierNode['name'];
                            }
                        }
                        return '';
                    } else {

                        //console.log('groupedItem', groupedItem);

                        if (column.hasOwnProperty('columnType') && column.columnType == 'custom-field') {

                            result = '';

                            //console.log('groupedItem', groupedItem);

                            groupedItem.custom_fields.forEach(function (customField) {

                                if (customField.custom_field == column.id) {
                                    result = customField.value;
                                }

                            });

                            return result

                        } else {

                            if (groupedItem.hasOwnProperty(column.name)) {
                                return groupedItem[column.name];
                            } else {
                                //return groupTableBodyHelper.findGroupedItemAttribute(groupedItem, column.id);
                            }
                        }
                    }
                } else {

                    var i, e, c;
                    for (i = 0; i < baseAttrs.length; i = i + 1) {
                        if (baseAttrs[i].key === column.key) {
                            return groupedItem[baseAttrs[i].key];
                        }
                    }

                    for (e = 0; e < entityAttrs.length; e = e + 1) {

                        if (entityAttrs[e].key === column.key) {
                            if (column['value_type'] === 'field') {
                                var _groupedItemVal = groupedItem[entityAttrs[e].key];
                                //if (vm.readyStatus.cellsFirstReady) {
                                //console.log('entityFieldsArray', entityFieldsArray);
                                if (entityFieldsArray[column.key]) {
                                    var result = entityFieldsArray[column.key].filter(function (item) {
                                        return item.id === _groupedItemVal;
                                    })[0];

                                }
                                if (result) {
                                    if (column['key'] === 'instrument' && result['user_code']) {
                                        return result['user_code'];
                                    } else if (column['key'] === 'price_download_scheme') {
                                        return result['scheme_name'];
                                    }
                                    else if (result['display_name']) {
                                        return result['display_name'];
                                    }
                                    return result['name'];
                                }
                                return '';
                            } else {
                                if (column['value_type'] === 'mc_field') {

                                    if (column.key == 'object_permissions_user') {

                                        if (groupedItem[entityAttrs[e].key].length) {

                                            //console.log('vm.options.permission_selected_entity', vm.options.permission_selected_entity);

                                            if (vm.options.permission_selected_entity == 'user') {

                                                var resultPermission = [];

                                                groupedItem[entityAttrs[e].key].forEach(function (permission) {

                                                    if (permission.member == vm.options.permission_selected_id) {
                                                        if (permission.permission.indexOf('change') == 0) {
                                                            resultPermission.push('Change');
                                                        }
                                                        if (permission.permission.indexOf('manage') == 0) {
                                                            resultPermission.push('Manage');
                                                        }
                                                    }
                                                });

                                                return resultPermission.join(', ');

                                            }
                                        }
                                    }

                                    if (column.key == 'object_permissions_group') {

                                        if (vm.options.permission_selected_entity == 'group') {

                                            var resultPermission = [];

                                            groupedItem[entityAttrs[e].key].forEach(function (permission) {
                                                if (permission.group == vm.options.permission_selected_id) {
                                                    if (permission.permission.indexOf('change') == 0) {
                                                        resultPermission.push('Change');
                                                    }
                                                    if (permission.permission.indexOf('manage') == 0) {
                                                        resultPermission.push('Manage');
                                                    }
                                                }
                                            });

                                            return resultPermission.join(', ');
                                        }
                                    }

                                    if (groupedItem[entityAttrs[e].key] && groupedItem[entityAttrs[e].key].length >= 1) {
                                        return '[' + groupedItem[entityAttrs[e].key].length + ']'
                                    }
                                } else {

                                    if (groupedItem[entityAttrs[e].key] !== null && groupedItem[entityAttrs[e].key] !== undefined) {

                                        if (column.value_type == 20 || column.value_type == 'float') {


                                            if (options && options.hasOwnProperty('reportItem')) {
                                                if (options.reportItem.isFirstOfFolded && options.reportItem.isFirstOfFolded == true) {
                                                    //console.log(options);
                                                    return options.reportItem.subTotal[entityAttrs[e].key].toFixed(2) + '';
                                                } else {
                                                    return groupedItem[entityAttrs[e].key].toFixed(2) + '';
                                                }
                                            } else {
                                                return groupedItem[entityAttrs[e].key].toFixed(2) + '';
                                            }
                                        } else {

                                            if (entityType == 'complex-transaction') {
                                                if (entityAttrs[e].key == 'status') {
                                                    if (groupedItem[entityAttrs[e].key] == 1) {
                                                        return 'Production';
                                                    }
                                                    if (groupedItem[entityAttrs[e].key] == 2) {
                                                        return 'Pending';
                                                    }
                                                }
                                            }


                                            return groupedItem[entityAttrs[e].key];
                                        }
                                    }
                                }
                            }
                        }
                    }


                    for (c = 0; c < vm.columns.length; c = c + 1) {

                        var column_source = vm.columns[c];

                        if (column_source.hasOwnProperty('key')) {

                            if (column_source.key == column.key) {
                                return groupedItem[column_source.key];
                            }
                        }

                    }
                }
            };

            vm.bindCellTitle = function (item, column) {

                var result = '';

                if (item && item.hasOwnProperty(column.key)) {
                    if (column['value_type'] === 'mc_field') {
                        result = '[' + item[column.key].length + ']';
                    }
                    else {
                        result = item[column.key];
                    }
                }

                return result;
            };

            vm.getAlign = function (column) {

                switch (column['value_type']) {
                    case 20:
                        return 'cell-right-align';
                        break;
                    case 'float':
                        return 'cell-right-align';
                        break;
                    case 40:
                        return 'cell-center-align';
                        break;
                    default:
                        return '';
                        break;
                }
            };

            vm.changePage = function (page) {
                vm.externalCallback({options: {paginationPageCurrent: page}});
            };


        }
    }

}());