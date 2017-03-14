/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var entityService = require('../../services/entityService');

    module.exports = function ($scope, ptDialog, data) {

        var vm = this;
        vm.readyStatus = {content: false};

        vm.tabs = [];

        console.log('data', data);

        vm.entityAttrs = [];

        vm.tabAttrsReady = false;

        // end refactore

        var parentScope = data.parent$scope;
        var callback = data.callback;

        var columns = parentScope.columns;
        var currentColumnsWidth = parentScope.columns.length;
        var filters = parentScope.filters;
        var grouping = parentScope.grouping;

        var attrsList = [];

        $('body').addClass('drag-dialog'); // hide backdrop
        vm.getAttributes = function () {

            vm.entities = entityService.getEntities();

            console.log('vm.entities', vm.entities);

            vm.readyStatus.content = true;

            syncAttrs();

        };


        parentScope.$watch('options.columns', function () {
            if (vm.tabAttrsReady) {
                columns = parentScope.options.columns;
                syncAttrs();
                callback({silent: true});
            }
        });
        parentScope.$watch('options.filters', function () {
            if (vm.tabAttrsReady) {
                filters = parentScope.options.filters;
                syncAttrs();
                callback({silent: true});
            }
        });
        parentScope.$watch('options.grouping', function () {
            if (vm.tabAttrsReady) {
                grouping = parentScope.options.grouping;
                syncAttrs();
                callback({silent: true});
            }
        });

        var syncAttrs = function () {
            syncTypeAttrs();
        };

        var updateAttrs = function () {

            updateTypeAttrs();

            addColumn();

        };

        function syncTypeAttrs() {

            vm.entities.forEach(function (entity) {
                var i;

                var attrs = entity.attributes;

                for (i = 0; i < attrs.length; i = i + 1) {
                    attrs[i].columns = false;
                    attrs[i].filters = false;
                    attrs[i].groups = false;
                    columns.map(function (item) {
                        //console.log('item', item);
                        //console.log('attrs[i]', attrs[i]);
                        if (attrs[i].name === item.name) {
                            attrs[i].columns = true;
                        }
                        return item;
                    });
                    filters.map(function (item) {
                        if (attrs[i].name === item.name) {
                            attrs[i].filters = true;
                        }
                        return item;
                    });
                    grouping.map(function (item) {
                        if (item.hasOwnProperty('key')) {
                            if (attrs[i].key === item.key) {
                                attrs[i].groups = true;
                            }
                        } else {
                            if (attrs[i].name === item.name) {
                                attrs[i].groups = true;
                            }
                        }
                        return item;
                    });
                }
            })
        }

        function updateTypeAttrs() {
            var i, c, g, f;
            var columnExist, groupExist, filterExist;

            vm.entities.forEach(function (entity) {
                var i;

                var typeAttrs = entity.attributes;


                for (i = 0; i < typeAttrs.length; i = i + 1) {
                    columnExist = false;
                    groupExist = false;
                    filterExist = false;
                    for (c = 0; c < columns.length; c = c + 1) {
                        if (typeAttrs[i].hasOwnProperty('key')) {
                            if (typeAttrs[i].key === columns[c].key) {
                                columnExist = true;
                                if (typeAttrs[i].columns === false) {
                                    columns.splice(c, 1);
                                    c = c - 1;
                                }
                            }
                        } else {
                            if (typeAttrs[i].name === columns[c].name) {
                                columnExist = true;
                                if (typeAttrs[i].columns === false) {
                                    columns.splice(c, 1);
                                    c = c - 1;
                                }
                            }
                        }
                    }
                    if (!columnExist) {
                        if (typeAttrs[i].columns === true) {
                            columns.push(typeAttrs[i]);
                        }
                    }

                    /////// GROUPING

                    for (g = 0; g < grouping.length; g = g + 1) {
                        if (typeAttrs[i].hasOwnProperty('key')) {
                            if (typeAttrs[i].key === grouping[g].key) {
                                groupExist = true;
                                if (typeAttrs[i].groups === false) {
                                    grouping.splice(g, 1);
                                    g = g - 1;
                                }
                            }
                        } else {
                            if (typeAttrs[i].id === grouping[g].id) {
                                groupExist = true;
                                if (typeAttrs[i].groups === false) {
                                    grouping.splice(g, 1);
                                    g = g - 1;
                                }
                            }
                        }
                    }
                    if (!groupExist) {
                        if (typeAttrs[i].groups === true) {
                            grouping.push(typeAttrs[i]);
                        }
                    }

                    /////// FILTERING

                    for (f = 0; f < filters.length; f = f + 1) {
                        if (typeAttrs[i].hasOwnProperty('key')) {
                            if (typeAttrs[i].key === filters[f].key) {
                                filterExist = true;
                                if (typeAttrs[i].filters === false) {
                                    filters.splice(f, 1);
                                    f = f - 1;
                                }
                            }
                        } else {
                            if (typeAttrs[i].name === filters[f].name) {
                                filterExist = true;
                                if (typeAttrs[i].filters === false) {
                                    filters.splice(f, 1);
                                    f = f - 1;
                                }
                            }
                        }
                    }
                    if (!filterExist) {
                        if (typeAttrs[i].filters === true) {
                            filters.push(typeAttrs[i]);
                        }
                    }

                }
            });

            // console.log('attributes in modal ', vm.attrs, vm.baseAttrs, vm.entityAttrs, parentScope);
        }

        vm.updateAttrs = function () {
            updateAttrs();
            callback({silent: true});
        };

        vm.cancel = function () {
            $('body').removeClass('drag-dialog');
            ptDialog.cancel();
        };

        var dragAndDrop = {

            init: function () {
                this.dragula();
                this.eventListeners();
            },

            eventListeners: function () {
                var that = this;
                var exist = false;
                this.dragula.on('over', function (elem, container, source) {
                    $(container).addClass('active');
                    $(container).on('mouseleave', function () {
                        $(this).removeClass('active');
                    })

                });
                this.dragula.on('drop', function (elem, target) {
                    //console.log('here?', target); //TODO fallback to ids instead of name/key
                    $(target).removeClass('active');
                    var name = $(elem).html();
                    var i;

                    //console.log('elem111111111111111111111111111111', elem);
                    //console.log('columns111111111111111111111111111111', columns);
                    //console.log('grouping111111111111111111111111111111', grouping);
                    //console.log('filters111111111111111111111111111111', filters);

                    exist = false;
                    if (target === document.querySelector('#columnsbag')) {
                        for (i = 0; i < columns.length; i = i + 1) {
                            if (columns[i].name === name) {
                                exist = true;
                            }
                        }
                    }
                    if (target === document.querySelector('#groupsbag')) {
                        for (i = 0; i < grouping.length; i = i + 1) {
                            if (grouping[i].name === name) {
                                exist = true;
                            }
                        }
                    }
                    if (target === document.querySelector('#filtersbag .drop-new-filter')) {
                        for (i = 0; i < filters.length; i = i + 1) {
                            if (filters[i].name === name) {
                                exist = true;
                            }
                        }
                    }
                    if (!exist) {
                        var a;
                        if (target === document.querySelector('#columnsbag')) {
                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === name) {
                                    columns.push(attrsList[a]);
                                }
                            }
                            syncAttrs();
                            callback({silent: true});
                        }
                        if (target === document.querySelector('#groupsbag')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === name) {
                                    grouping.push(attrsList[a]);
                                }
                            }
                            syncAttrs();
                            callback({silent: true});
                        }
                        if (target === document.querySelector('#filtersbag .drop-new-filter')) {

                            for (a = 0; a < attrsList.length; a = a + 1) {
                                if (attrsList[a].name === name) {
                                    filters.push(attrsList[a]);
                                }
                            }
                            syncAttrs();
                            callback({silent: true});
                        }
                        $scope.$apply();
                    }
                    $scope.$apply();
                });

                this.dragula.on('dragend', function (el) {
                    $scope.$apply();
                    $(el).remove();
                })
            },

            dragula: function () {
                var items = [document.querySelector('#columnsbag'), document.querySelector('#groupsbag'), document.querySelector('#filtersbag .drop-new-filter')];
                var i;
                var itemsElem = document.querySelectorAll('#dialogbag .g-modal-draggable-card');
                for (i = 0; i < itemsElem.length; i = i + 1) {
                    items.push(itemsElem[i]);
                }

                this.dragula = dragula(items,
                    {
                        copy: true
                    });
            }
        };

        var addColumn = function () {
            //if (currentColumnsWidth < columns.length) {
            //    metaService.columnsWidthGroups(true);
            //}
            //else {
            //    metaService.columnsWidthGroups(false);
            //}
        };

        vm.getAttributes();

        //setTimeout(function () {
        //    //dragAndDrop.init()
        //}, 500);
    }

}());