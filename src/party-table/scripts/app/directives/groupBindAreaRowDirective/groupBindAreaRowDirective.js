/**
 * Created by szhitenev on 02.11.2016.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'AE',
            transclude: true,
            templateUrl: 'app/directives/groupBindAreaRowDirective/group-bind-area-row-directive.html',
            link: function (scope, elem, attrs) {

                //console.log('scope.item', scope.item);


            }
        }
    }

}());