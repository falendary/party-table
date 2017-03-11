/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    var reportSubtotalService = require('./reportSubtotalService');

    'use strict';

    function returnValue(attribute) {

        if (attribute['attribute_type_object'].value_type == 30) {
            return attribute['classifier']
        } else {
            if (attribute['attribute_type_object'].value_type == 40) {
                return attribute['value_date'];
            } else {
                if (attribute['attribute_type_object'].value_type == 20) {
                    return attribute['value_float'];
                } else {
                    if (attribute['attribute_type_object'].value_type == 10 && attribute['value_string'] !== '') {
                        return attribute['value_string'];
                    } else {
                        return null;
                    }
                }
            }
        }
    }

    function setAncestors(item, level, groupType, options) {

        if (groupType == 'boot') {

            item["boot_level_" + level].forEach(function (childItem) {

                var ancestor = JSON.parse(JSON.stringify(item));
                if (level > 0) {
                    ancestor.level = level - 1;
                } else {
                    ancestor.level = level;
                }

                delete ancestor["boot_level_" + level];

                childItem._ancestor = ancestor;

            })

        }

        if (groupType == 'breadcrumb') {

            item["breadcrumbs_level_" + level].forEach(function (childItem) {

                var ancestor = JSON.parse(JSON.stringify(item));

                delete ancestor["breadcrumbs_level_" + level];
                ancestor.level = options.bootLevel;

                childItem._ancestor = ancestor;

            })


        }

    };

    function returnValueType(attribute) {

        if (attribute['attribute_type_object'].value_type == 30) {
            return 'classifier'
        } else {
            if (attribute['attribute_type_object'].value_type == 40) {
                return 'value_date';
            } else {
                if (attribute['attribute_type_object'].value_type == 20) {
                    return 'value_float';
                } else {
                    if (attribute['attribute_type_object'].value_type == 10) {
                        return 'value_string';
                    } else {
                        return null;
                    }
                }
            }
        }
    }

    var transformToArray = function (groupedObject) {

        //console.log('groupedObject', groupedObject);
        var items = [];
        var i;
        var keys = Object.keys(groupedObject);
        for (i = 0; i < keys.length; i = i + 1) {
            items.push(groupedObject[keys[i]]);
        }
        //console.log('grooouping', items);
        return items;
    };

    var setGroups = function (items, groups, entityTypes, options) {

        //console.log('GROUPING SERVICE groups', groups);

        //console.log("items", items);

        var itemsGrouped = [];
        var itemsGroupedArray = [];
        var i, c, a, k;

        var baseAttrs = [];
        var entityAttrs = {};


        var keywords = [];
        keywords = keywords.concat(baseAttrs);

        var entityAttrsKeys = Object.keys(entityAttrs);

        entityAttrsKeys.forEach(function (entityAttrsKey) {
            keywords = keywords.concat(entityAttrs[entityAttrsKey]);
        });


        var hasGroups = true;
        var groupName = '';
        var groupsForResult = [];

        function checkIfEmptyString(item) {
            if (item == '') {
                return null
            }
            return item;
        }

        function findGroupsForResult(group, item, attribute) {

            var resGroupItem;
            if (group.hasOwnProperty('id')) {
                //console.log('group', group);
                //console.log('attribute[k]', attribute);

                if (group.hasOwnProperty('r_entityType')) {


                    //console.log('attribute1111111111111111111', attribute);
                    //console.log('group1111111111111111111', group);

                    if (group.id == attribute.attribute_type_object.id) {

                        if (returnValue(attribute) !== null) {

                            var _name = group.r_entityType + '_attribute_' + group.source_name;
                            // '&[' + checkIfEmptyString(_name) + '}-{' + checkIfEmptyString(item[_name]) + ']'


                            resGroupItem = {
                                comparePattern: '&[' + checkIfEmptyString(_name) + '}-{' + checkIfEmptyString(item[_name]) + ']',
                                key: _name,
                                value: returnValue(attribute),
                                value_type: returnValueType(attribute)
                            };

                            if (group.hasOwnProperty('report_settings')) {
                                resGroupItem.report_settings = group.report_settings;
                            }


                            groupsForResult.push(resGroupItem);
                        }

                        //console.log('groupsForResult', groupsForResult);

                    }
                } else {

                    if (group.id === attribute['attribute_type']) {

                        //console.log('group.id', group);

                        if (returnValue(attribute) !== null) {
                            resGroupItem = {
                                comparePattern: '&[' + attribute['attribute_type'] + '}-{' + returnValue(attribute) + ']',
                                key: attribute['attribute_name'].replace(' ', '_'),
                                value: returnValue(attribute),
                                value_type: returnValueType(attribute)
                            };

                            if (group.hasOwnProperty('report_settings')) {
                                resGroupItem.report_settings = group.report_settings;
                            }


                            groupsForResult.push(resGroupItem);
                        }
                    }
                }
            } else {
                //console.log('keywords', keywords);
                for (k = 0; k < keywords.length; k = k + 1) {
                    var n, nExist = false;
                    if (group.key === keywords[k].key) {

                        //console.log('groupsForResult', groupsForResult);
                        for (n = 0; n < groupsForResult.length; n = n + 1) {
                            //console.log('groupsForResult[n]', groupsForResult[n]);
                            if (groupsForResult[n].comparePattern.indexOf('&[' + keywords[k].key + '}-{' + checkIfEmptyString(item[keywords[k].key]) + ']') !== -1) {
                                nExist = true;
                            }
                        }
                        if (!nExist) {

                            resGroupItem = {
                                comparePattern: '&[' + keywords[k].key + '}-{' + checkIfEmptyString(item[keywords[k].key]) + ']',
                                key: keywords[k].key.replace(' ', '_'),
                                value: checkIfEmptyString(item[keywords[k].key]),
                                value_type: keywords[k].value_type
                            };

                            if (group.hasOwnProperty('report_settings')) {
                                resGroupItem.report_settings = group.report_settings;
                            }

                            groupsForResult.push(resGroupItem);
                        }
                    }
                }
            }
        }

        if (groups.length) {
            var group, item;
            for (i = 0; i < items.length; i = i + 1) {
                item = items[i];
                groupsForResult = [];
                groupName = ''; // create groupName of each item
                //console.log('groups111111111111111111111111', groups);
                for (c = 0; c < groups.length; c = c + 1) {
                    //console.log('items[i]', items[i]);

                    group = groups[c];
                    //console.log('group[c]', group);
                    if (group.hasOwnProperty('key')) {

                        findGroupsForResult(group, item);
                        var keys = Object.keys(items[i]);
                        for (a = 0; a < keys.length; a = a + 1) {
                            if (groupName.indexOf('&[' + checkIfEmptyString(group.key) + '}-{' + checkIfEmptyString(item[group.key]) + ']') === -1) {
                                groupName = groupName + '&[' + checkIfEmptyString(group.key) + '}-{' + checkIfEmptyString(item[group.key]) + ']';
                            }
                        }

                    }

                }
                //console.log('groupName', groupName);

                if (!itemsGrouped[groupName]) {
                    itemsGrouped[groupName] = {
                        groups: groupsForResult,
                        items: []
                    }
                }
                itemsGrouped[groupName].items.push(item);
                //console.log('itemsGrouped[groupName]', itemsGrouped[groupName]);
                //console.log('itemsGrouped', itemsGrouped);
                itemsGroupedArray = transformToArray(itemsGrouped);
            }

            //console.log('------------------------');

            //console.log('Items grouped', itemsGroupedArray);

            if (options) {

                itemsGroupedArray.forEach(function (group) {

                    //console.log('group122222', group);
                    group.subTotal = reportSubtotalService.calcColumnSubTotal(group, options.columns);
                    group.groups[0].subTotal = group.subTotal;
                });
            }

            //console.log('Items grouped', itemsGroupedArray);


            return itemsGroupedArray;
        } else {
            //console.log('items', items);
            return items;
        }
    };

    function isInt(value) {
        if (isNaN(value)) {
            return false;
        }
        var x = parseFloat(value);
        return (x | 0) === x;
    }


    // deprecated start
    function setProperty(path, obj, value) {
        var schema = obj;
        var pList = path.split('.');
        var len = pList.length;
        for (var i = 0; i < len - 1; i++) {
            var elem = pList[i];
            if (!schema[elem]) schema[elem] = {};
            schema = schema[elem];
        }

        schema[pList[len - 1]] = value;
    }

    function getProperty(object, path) {
        var o = object;
        path = path.replace(/\[(\w+)\]/g, '.$1');
        path = path.replace(/^\./, '');
        var a = path.split('.');
        while (a.length) {
            var n = a.shift();
            if (n in o) {
                o = o[n];
            } else {
                return;
            }
        }
        return o;
    }

    // deprecated end

    function recursiveFillGroups(items, groups, entityTypes, options) {

        var level = 0;
        var results = [];

        function recursiveWalker(items, groups, entityTypes, level, options) {

            //console.log('options', options);
            //console.log('level', level);

            var setGroupOptions = {
                columns: options.columns
            };

            if (options.boot == true) {

                if (groups.bootsGroup[level]) {

                    if (!results.length) {

                        var tempResults = setGroups(items, [groups.bootsGroup[level]], entityTypes, setGroupOptions);

                        tempResults.forEach(function (item) {

                            results.push(item);
                        });

                        recursiveWalker(results, groups, entityTypes, level + 1, options)

                    } else {

                        items.forEach(function (resultItem) {


                            resultItem['boot_level_' + level] = setGroups(resultItem.items, [groups.bootsGroup[level]], entityTypes, setGroupOptions);

                            setAncestors(resultItem, level, 'boot');

                            if (groups.bootsGroup[level + 1]) {
                                recursiveWalker(resultItem['boot_level_' + level], groups, entityTypes, level + 1, options)
                            }
                        });

                        // TODO refactor breadcrumbs_level


                        if (!groups.bootsGroup[level + 1]) {
                            if (options.breadcrumbs == true) {

                                if (groups.linesGroup.length) {

                                    items.forEach(function (resultItem) {

                                        resultItem['boot_level_' + level].forEach(function (bootItem) {

                                            bootItem['breadcrumbs_level_0'] = setGroups(bootItem.items, groups.linesGroup, entityTypes, setGroupOptions);

                                            setAncestors(bootItem, 0, 'breadcrumb', {bootLevel: level});

                                        });


                                    });
                                }

                            }
                        }

                    }

                } else {

                    if (options.breadcrumbs == true) {

                        if (groups.linesGroup.length) {

                            items.forEach(function (resultItem) {

                                resultItem['breadcrumbs_level_0'] = setGroups(resultItem.items, groups.linesGroup, entityTypes, setGroupOptions);

                            });
                        }

                    }
                }
            }


        }

        recursiveWalker(items, groups, entityTypes, level, options);

        //console.log('results', results);

        return results;
    }

    function isAdded(needle, stack, property) {

        var exist = false;

        stack.forEach(function (item) {
            if (item[property] == needle[property]) {
                exist = true;
            }
        });

        return exist;
    }

    function filterByID(obj) {
        if ('id' in obj.attribute_type_object && typeof(obj.attribute_type_object.id) === 'number' && !isNaN(obj.attribute_type_object.id)) {
            return true;
        } else {
            return false;
        }
    }

    var setGroupsWithColumns = function (items, groups, columns, entityTypes) {

        var preInitGroups = [];
        var bootsGroup = [];
        var linesGroup = [];

        var results = [];

        var bootsGroupStartMatching = null;

        function findBootsGroup() {

            groups.forEach(function (group, $groupIndex) {

                columns.forEach(function (column, $columnIndex) {

                    if (group.hasOwnProperty('id') && column.hasOwnProperty('id')) {
                        if (group.id == column.id) {

                            if (bootsGroupStartMatching == null) {
                                bootsGroupStartMatching = {
                                    groupIndex: $groupIndex,
                                    columnIndex: $columnIndex
                                };

                                bootsGroup.push(group);
                            } else {
                                if ($groupIndex - bootsGroupStartMatching.groupIndex == $columnIndex - bootsGroupStartMatching.columnIndex) {
                                    bootsGroup.push(group);
                                }
                            }

                        }
                    } else {
                        if (group.hasOwnProperty('key') && column.hasOwnProperty('key')) {
                            if (group.key == column.key) {

                                if (bootsGroupStartMatching == null) {
                                    bootsGroupStartMatching = {
                                        groupIndex: $groupIndex,
                                        columnIndex: $columnIndex
                                    };

                                    bootsGroup.push(group);
                                } else {

                                    if ($groupIndex - bootsGroupStartMatching.groupIndex == $columnIndex - bootsGroupStartMatching.columnIndex) {
                                        bootsGroup.push(group);
                                    }
                                }
                            }
                        }
                    }


                });

            });

            //console.log('bootsGroupStartMatching', bootsGroupStartMatching);

        }

        function findPreInitGroup() {
            groups.forEach(function (group, $groupIndex) {
                columns.forEach(function (column, $columnIndex) {

                        if ($groupIndex == $columnIndex) {
                            if ($groupIndex < bootsGroupStartMatching.groupIndex) {


                                if (group.hasOwnProperty('id') && column.hasOwnProperty('id')) {
                                    if (group.id !== column.id) {
                                        preInitGroups.push(group);
                                    }
                                } else {
                                    if (group.hasOwnProperty('key') && column.hasOwnProperty('key')) {
                                        if (group.key !== column.key) {
                                            preInitGroups.push(group);
                                        }
                                    } else {
                                        preInitGroups.push(group);
                                    }
                                }
                            }
                        }

                    }
                )
            });
        }

        function findLinesGroup() {
            groups.forEach(function (group, $groupIndex) {
                columns.forEach(function (column, $columnIndex) {
                    if (bootsGroupStartMatching.groupIndex !== null) {
                        if ($groupIndex > bootsGroupStartMatching.groupIndex + bootsGroup.length - 1) {
                            if (group.hasOwnProperty('id')) {
                                if (!isAdded(group, linesGroup, 'id')) {
                                    linesGroup.push(group);
                                }
                            } else {
                                if (!isAdded(group, linesGroup, 'key')) {
                                    linesGroup.push(group);
                                }
                            }
                        }
                    }

                })
            });
        }


        //items = extractDynamicAttributes(items);

        //console.log('TRANSFORMIN ITEMS WITH DYNAMIC ATTR PROPS', items);

        if (groups.length) {

            items.forEach(function (item, $index) {
                item._lid = $index;
            });

            findBootsGroup();
            findPreInitGroup();
            findLinesGroup();

            //console.log('preInitGroups', preInitGroups);
            //console.log('bootsGroup', bootsGroup);
            //console.log('linesGroup', linesGroup);

            var groups = {};

            if (preInitGroups.length) {

                var options = {
                    columns: columns
                };

                results = setGroups(items, preInitGroups, entityTypes, options);

                results.forEach(function (preInitGroupsItem) {

                    groups = {
                        preInitGroups: preInitGroups,
                        bootsGroup: bootsGroup,
                        linesGroup: linesGroup
                    };

                    preInitGroupsItem["boot_level_0"] = recursiveFillGroups(preInitGroupsItem.items, groups, entityTypes, {
                        boot: true,
                        breadcrumbs: true,
                        columns: columns
                    });

                });

            } else {

                groups = {
                    preInitGroups: preInitGroups,
                    bootsGroup: bootsGroup,
                    linesGroup: linesGroup
                };

                results = recursiveFillGroups(items, groups, entityTypes, {
                    boot: true,
                    breadcrumbs: true,
                    columns: columns
                });
            }

            //console.log('results', results);

            return results;


        } else {
            return items;
        }

    };

    module.exports = {
        setGroups: setGroups,
        setGroupsWithColumns: setGroupsWithColumns
    }

}());
