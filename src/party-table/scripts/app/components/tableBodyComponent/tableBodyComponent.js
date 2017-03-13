/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    //var bindCellService = require('../../services/bindCellService');
    //var groupTableReportService = require('../../services/groupTable/groupTableReportService');
    //var groupTableBodyHelper = require('../../helpers/groupTableBodyHelper');

    var GroupTableService = require('../../services/groupTableService');

    module.exports = {
        bindings: {
            options: '=',
            items: '='
        },
        templateUrl: 'app/components/tableBodyComponent/table-body-component.html',
        controllerAs: 'vm',
        controller: function ($scope) {

            $scope.options = $scope.$parent.options;
            $scope.items = $scope.$parent.items;

            $scope.externalCallback = $scope.options.externalCallback;
            $scope.grouping = $scope.options.grouping;
            $scope.columns = $scope.options.columns;
            $scope.entityType = $scope.options.entityType;
            $scope.reportIsReady = $scope.options.reportIsReady;
            $scope.isReport = $scope.options.isReport;

            $scope.readyStatus = {
                cellsFirstReady: false,
                cellsSecondReady: false,
                attributeTypesReady: false,
                classifiersReady: false
            }; // if groups not exist

            var entityType = $scope.entityType;
            var baseAttrs = [];
            var entityAttrs = [];

            var promisesEntityFieldsAlreadyAdded = [];
            var promisesAttributeTypesAlreadyAdded = {};

            var entityFieldsArray = {};

            var groupTableService = GroupTableService.getInstance();

            $scope.itemsProjection = function () {
                return groupTableService.projection();
            };


            //baseAttrs = metaService.getBaseAttrs();
            //
            //
            //entityAttrs = metaService.getEntityAttrs(entityType);

            //setInterval(function () {
            //    $('.g-table-section .custom-scrollbar')[0].dispatchEvent(new Event('scroll'));
            //}, 1000);

            function getCellsCaptionsPatterns(item, itemIndex) {

                var result = [];

                item.cellsCaptions.forEach(function (cellCaption, $index) {
                    if ($index <= itemIndex) {
                        result.push(cellCaption.comparePattern);
                    }
                });

                return result.join('_-_');
            }

            $scope.toggleGroupFold = function (item, $index) {

                if ($scope.isReport) {

                    item.cellsCaptions[$index].isFolded = !item.cellsCaptions[$index].isFolded;

                    item.subTotal = item.cellsCaptions[$index].subTotal;

                    var itemCellCaptionsPatterns = getCellsCaptionsPatterns(item, $index);

                    var localItems = []; // to find first element, and revert isFolded;

                    $scope.reportItems.forEach(function (reportItem) {

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

            $scope.itemIsFolded = function (item) {

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

            $scope.openEntityMenu = function ($mdOpenMenu, ev) {
                $mdOpenMenu(ev);
            };

            $scope.checkReportColumnCaption = function (cellsCaptions, column, $columnIndex) {

                if ($columnIndex > cellsCaptions.length - 1) { // 1 - index
                    return false;
                }

                // todo cellCaptions[columnIndex] == column

                return true;

            };

            var getFieldDisplayNamesArray = function () {
                return new Promise(function (resolve, reject) {
                    var i;
                    var promises = [];

                    if ($scope.isReport == true) {

                        //console.log('entityFieldsArray', entityFieldsArray);
                        //console.log('$scope.columns[i]', $scope.columns);

                    } else {

                        for (i = 0; i < $scope.columns.length; i = i + 1) {
                            var attributeExist = false;
                            //console.log('12312312312312312', $scope.columns[i]);
                            if ($scope.columns[i]['value_type'] == 'field') {
                                //promises.push(bindCellService.findEntities($scope.columns[i].key, {entityType: entityType}));
                            }
                            if ($scope.columns[i]['value_type'] == 30) {
                                //console.log('$scope.columns[i]', $scope.columns[i]);

                                if (!promisesAttributeTypesAlreadyAdded[entityType]) {
                                    promisesAttributeTypesAlreadyAdded[entityType] = [];
                                }

                                promisesAttributeTypesAlreadyAdded[entityType].forEach(function (attribute) {
                                    if (attribute == $scope.columns[i].id) {
                                        attributeExist = true;
                                    }
                                });


                            }
                        }
                    }

                    findEntityFields();

                    Promise.all(promises).then(function (results) {
                        //console.log('results11111111111111111', results);
                        results.forEach(function (item) {
                            if (item.key) {

                                entityFieldsArray[item.key] = item.data;
                            } else {
                                entityFieldsArray['classifier_' + item.id] = item;
                            }
                        });

                        $scope.readyStatus.attributeTypesReady = true;

                    }).then(function () {
                        $scope.$apply();
                    })

                });

            };

            if ($scope.grouping && $scope.grouping.length) {
                syncGroupsAndColumns();
            }

            function findGroups() {

                return new Promise(function (resolve, reject) {

                    var i, g;
                    var promisesClassifiers = [];
                    var promisesEntityFields = [];


                    var items = $scope.items;
                    var classifierExist = false;
                    var entityExist = false;

                    //console.log('ITEMS', items);

                    for (i = 0; i < $scope.items.length; i = i + 1) {
                        //console.log('$scope.items[i].groups', $scope.items[i].groups);
                        if ($scope.items[i].hasOwnProperty('groups')) {
                            for (g = 0; g < $scope.items[i].groups.length; g = g + 1) {

                                entityExist = false;

                                if ($scope.items[i].groups[g]['value_type'] === 'field') {

                                    if ($scope.items[i].groups[g].value !== null) {

                                        promisesEntityFieldsAlreadyAdded.forEach(function (entity) {
                                            if (entity == $scope.items[i].groups[g].key + '_' + $scope.items[i].groups[g].value) {
                                                entityExist = true;
                                            }
                                        });

                                        if (!entityExist) {
                                            promisesEntityFieldsAlreadyAdded.push($scope.items[i].groups[g].key + '_' + $scope.items[i].groups[g].value);
                                            //promisesEntityFields.push(bindCellService.getByKey($scope.items[i].groups[g].key, $scope.items[i].groups[g].value, {entityType: $scope.entityType}))
                                        }
                                    }
                                }
                            }
                        }
                    }


                    Promise.all(promisesEntityFields).then(function (data) {

                        if (data.length) {
                            var i;

                            console.log('data', data);

                            for (i = 0; i < data.length; i = i + 1) {

                                if (entityFieldsArray[data[i].key] == undefined) {
                                    entityFieldsArray[data[i].key] = [];
                                }
                                entityFieldsArray[data[i].key].push(data[i].data);
                            }
                        }

                        $scope.readyStatus.cellsFirstReady = true;
                        //console.log('cells first ready');
                        resolve({status: "groups ready"});


                    }).then(function () {
                        $scope.$apply();
                    })

                })
            }

            $scope.reportItemsProjection = function () {
                //console.log('$scope.reportItems', $scope.reportItems);
                return $scope.reportItems;
            };

            $scope.isSubtotalHided = function (column) {
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

            $scope.resolveReportCellItemBackground = function (rowType, item, column, $index) {
                var result = '';

                //console.log('item', item);

                if (item.hasOwnProperty('value_options')) {

                    if (item.value_options.type == 'area') {
                        result = 'cell-area-bg-' + item.value_options.level;
                    }

                    if (rowType == 'subtotal-line') {

                        if (item.value_options.type == 'line') {
                            result = 'cell-line-bg-' + item.value_options.level;
                        }
                    }

                }

                return result;
            };

            $scope.resolveReportCellBackground = function (rowType, item, column, $index) {

                if ($index == 1) {
                    //console.log(rowType, item, column, $index);
                }

                var result = '';


                if (item.hasOwnProperty('cellsCaptions')) {

                    var cellCaption = item.cellsCaptions[$index];

                    if (cellCaption && cellCaption.hasOwnProperty('level') && cellCaption.hasOwnProperty('type')) {

                        if (cellCaption.type !== 'empty') {
                            if (cellCaption.type == 'area') {
                                result = 'cell-area-bg-' + cellCaption.level;
                            }

                            if (rowType == 'subtotal-line') {

                                //console.log('item', item);

                                if (cellCaption.type == 'line') {
                                    result = 'cell-line-bg-' + cellCaption.level;
                                }
                            }
                        }
                    }
                }

                return result;

            };

            $scope.resolveReportCellBorder = function (rowType, item, column, $index) {

                var result = '';

                //console.log('item', item);

                if (rowType == 'subtotal') {

                    if ($index < item.cellsCaptions.length) {
                        if (item.cellsCaptions[$index] == 'Subtotal') {
                            result = 'r-c-border-left-border-bottom';
                        }

                        if (item.cellsCaptions[$index + 1] == 'Subtotal') {
                            result = 'r-c-border-left-border-right'
                        }

                        if (item.cellsCaptions[$index - 1] == 'Subtotal') {
                            result = 'r-c-border-right-border-bottom-border-top';
                        }

                        if ($index == 0) {
                            result = 'r-c-border-left-border-right'
                        }

                    } else {
                        result = 'r-c-border-right-border-bottom-border-top';
                    }

                }

                if (rowType == 'normal') {

                    result = 'r-c-border-right-border-bottom-border-top';

                    if ($index < item.cellsCaptions.length) {
                        result = 'r-c-border-left-border-right'
                    }

                    if ($index == 0) {
                        result = 'r-c-border-left-border-right'
                    }


                }

                if (rowType == 'header') {

                    result = 'r-c-border-right-border-bottom-border-top';

                    if ($index < item.cellsCaptions.length) {
                        result = 'r-c-border-left-border-right'
                    }
                    if ($index == 0) {
                        result = 'r-c-border-left-border-right'
                    }

                }

                return result;

            };

            function syncGroupsAndColumns() {

                //console.log("$scope.grouping!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", $scope.grouping);

                var promises = [];

                promises.push(getFieldDisplayNamesArray());
                promises.push(findGroups());

                //console.log('??????????????????', promises);

                Promise.all(promises).then(function () {
                    $scope.$apply();
                })
            }

            function findEntityFields() {

                return new Promise(function (resolve, reject) {
                    var i, g, e;
                    var promises = [];

                    for (i = 0; i < $scope.items.length; i = i + 1) {

                        if ($scope.items[i].hasOwnProperty('groups')) {
                            for (g = 0; g < $scope.items[i].groups.length; g = g + 1) {

                                if ($scope.items[i].groups[g]['value_type'] === 'field' && $scope.items[i].groups[g].value !== null) {
                                    var entityExist = false;

                                    promisesEntityFieldsAlreadyAdded.forEach(function (entity) {
                                        if (entity == $scope.items[i].groups[g].key + '_' + $scope.items[i].groups[g].value) {
                                            entityExist = true;
                                        }
                                    });

                                    if (!entityExist) {
                                        promisesEntityFieldsAlreadyAdded.push($scope.items[i].groups[g].key + '_' + $scope.items[i].groups[g].value);
                                        //promises.push(bindCellService.getByKey($scope.items[i].groups[g].key, $scope.items[i].groups[g].value))
                                    }

                                }
                            }
                        }
                    }

                    Promise.all(promises).then(function (results) {
                        //console.log('RESULTS', results);
                        results.forEach(function (item) {
                            //console.log('-------------------------------', item);
                            if (item.key) {
                                if (entityFieldsArray[item.key] == undefined) {
                                    entityFieldsArray[item.key] = [];
                                }
                                if (item.data !== undefined) {
                                    entityFieldsArray[item.key].push(item.data);
                                }
                            }
                        });

                        $scope.readyStatus.cellsSecondReady = true;

                        resolve({status: "entity field ready"});

                    }).then(function () {
                        $scope.$apply();
                    })
                })

            }

            $scope.checkRowSelection = function (item) {
                //console.log('checkRowSelection', item);

                if (item) {
                    if (item.selectedRow || item.simpleSelect) {
                        return true;
                    }
                }
                return false;
            };

            $scope.toggleSelectRow = function ($event, item) {

                if (item.simpleSelect == true) {
                    item.simpleSelect = false;
                }
                item.selectedRow = !item.selectedRow;
                if ($scope.isAllSelected === true && item.selectedRow === false) {
                    $scope.isAllSelected = false;
                }

                var allSelected = true;
                $scope.items.forEach(function (item) {
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
                    $scope.isAllSelected = true;
                }
                $event.stopPropagation();
            };

            $scope.checkReady = function () {

                //console.log('$scope.options.reportIsReady', $scope.options.reportIsReady);

                return true;

                if ($scope.readyStatus.cellsFirstReady == true &&
                    $scope.readyStatus.cellsSecondReady == true &&
                    $scope.readyStatus.classifiersReady == true &&
                        //$scope.reportIsReady == true &&
                    $scope.options.reportIsReady == true &&
                    $scope.readyStatus.attributeTypesReady == true) {

                    $scope.$parent.triggerResize();

                    return true;
                }
                return false;
            };

            $scope.bindGroupValue = function (group) {

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

            $scope.bindCellSubTotal = function (values, column) {

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

            $scope.bindCell = function (groupedItem, column, options) {

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
                                //if ($scope.readyStatus.cellsFirstReady) {
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

                                            //console.log('$scope.options.permission_selected_entity', $scope.options.permission_selected_entity);

                                            if ($scope.options.permission_selected_entity == 'user') {

                                                var resultPermission = [];

                                                groupedItem[entityAttrs[e].key].forEach(function (permission) {

                                                    if (permission.member == $scope.options.permission_selected_id) {
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

                                        if ($scope.options.permission_selected_entity == 'group') {

                                            var resultPermission = [];

                                            groupedItem[entityAttrs[e].key].forEach(function (permission) {
                                                if (permission.group == $scope.options.permission_selected_id) {
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


                    for (c = 0; c < $scope.columns.length; c = c + 1) {

                        var column_source = $scope.columns[c];

                        if (column_source.hasOwnProperty('key')) {

                            if (column_source.key == column.key) {
                                return groupedItem[column_source.key];
                            }
                        }

                    }
                }
            };

            $scope.bindCellTitle = function (item, column) {

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

            $scope.rowCallback = function (item, ev) {
                //console.log('open additions!', item);
                $scope.options.editorEntityId = item.id;
                var itemHasSimpleSelect = false;
                if (item.simpleSelect) {
                    itemHasSimpleSelect = JSON.parse(JSON.stringify(item.simpleSelect));
                }

                //console.log('$scope.itemAdditionsEditorEntityId', itemHasSimpleSelect);

                $scope.items.forEach(function (item) {
                    if (item.hasOwnProperty('groups')) {
                        item.simpleSelect = false;
                        item.items.forEach(function (row) {
                            row.simpleSelect = false;
                        })
                    } else {
                        item.simpleSelect = false;
                    }
                });

                item.simpleSelect = !item.simpleSelect;

                if (itemHasSimpleSelect == true) {
                    item.simpleSelect = false;
                    $scope.options.editorEntityId = undefined;
                }

                $scope.externalCallback({
                    silent: true,
                    redraw: false,
                    options: {editorEntityId: $scope.options.editorEntityId}
                });

                //if (localStorage.getItem('entityIsChanged') === "true") { // wow such shitcode
                //    $mdDialog.show({
                //        controller: 'WarningDialogController as vm',
                //        templateUrl: 'views/warning-dialog-view.html',
                //        parent: angular.element(document.body),
                //        targetEvent: ev,
                //        clickOutsideToClose: true,
                //        locals: {
                //            warning: {
                //                title: 'Warning',
                //                description: 'Unsaved data will be lost'
                //            }
                //        }
                //    }).then(function (res) {
                //        if (res.status === 'agree') {
                //            $scope.itemAdditionsEditorEntityId = item.id;
                //            localStorage.setItem('entityIsChanged', false);
                //        }
                //    });
                //} else {
                //    $scope.itemAdditionsEditorEntityId = item.id;
                //    //localStorage.setItem('entityIsChanged', false);
                //}
            };

            $scope.getAlign = function (column) {

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

            $scope.deleteEntity = function (ev, entity) {

                $mdDialog.show({
                    controller: 'EntityViewerDeleteDialogController as vm',
                    templateUrl: 'views/entity-viewer/entity-viewer-entity-delete-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    //clickOutsideToClose: true,
                    locals: {
                        entity: entity,
                        entityType: $scope.entityType
                    }
                }).then(function (res) {
                    if (res.status === 'agree') {
                        $scope.externalCallback();
                    }
                })
            };

            $scope.editEntity = function (ev, entity) {
                $mdDialog.show({
                    controller: 'EntityViewerEditDialogController as vm',
                    templateUrl: 'views/entity-viewer/entity-viewer-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    //clickOutsideToClose: true,
                    locals: {
                        parent$scope: $scope,
                        entityId: entity.id
                    }
                }).then(function (res) {
                    if (res && res.res === 'agree') {
                        $scope.externalCallback();
                    }
                });
            };

            $scope.changePage = function (page) {
                $scope.externalCallback({options: {paginationPageCurrent: page}});
            };

            //$scope.$watchCollection('options.columns', function () {
            //    syncGroupsAndColumns();
            //
            //    if ($scope.isReport == true) {
            //        $scope.reportItems = groupTableReportService.transformItems($scope.items);
            //    }
            //});
            //
            //$scope.$watchCollection('grouping', function () {
            //    syncGroupsAndColumns();
            //
            //    if ($scope.isReport == true) {
            //        $scope.reportItems = groupTableReportService.transformItems($scope.items);
            //    }
            //});
            //
            //if ($scope.isReport == true) {
            //
            //    $scope.$watch('items', function () {
            //        $scope.reportItems = groupTableReportService.transformItems($scope.items);
            //    });
            //}

        }
    }

}());