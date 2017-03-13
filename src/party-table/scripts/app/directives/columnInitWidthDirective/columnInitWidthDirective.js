/**
 * Created by szhitenev on 13.03.2017.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                columns: "="
            },
            link: function ($scope, elem, attr) {

                var groups = {
                    "groupOne": "400px",
                    "groupTwo": "600px",
                    "groupThree": "300px",
                    "groupFour": "450px",
                    "groupFive": "200px",
                    "newColumnAdded": false
                };

                function columnsWidthGroups(newColumn) {

                    if (typeof newColumn === "boolean") {
                        groups["newColumnAdded"] = newColumn;
                    }
                    else {
                        return groups;
                    }
                };

                var groupsWidth = columnsWidthGroups();
                var setDefaultWidth = function () {
                    if (groupsWidth['newColumnAdded']) {
                        var columns = elem.find('.g-column');
                        var lastColumn = columns.length - 1;
                        var newColumn = columns[lastColumn];
                        var columnWidth;
                        columnWidth = '300px';
                        //switch ($scope.columns[lastColumn]["value_type"]) {
                        //    case 10:
                        //        columnWidth = groupsWidth.groupThree;
                        //        break;
                        //    case 20:
                        //    case 40:
                        //        columnWidth = groupsWidth.groupFive;
                        //        break;
                        //    case 30:
                        //        columnWidth = groupsWidth.groupOne;
                        //        break;
                        //}
                        $(newColumn).width(columnWidth);
                    }
                };

                $scope.$watchCollection('columns', function () {
                    setDefaultWidth();
                });
            }
        }
    }
}());