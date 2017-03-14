/**
 * Created by szhitenev on 14.03.2017.
 */
(function () {

    'use strict';

    module.exports = function ($rootScope, $controller, $compile, $templateCache) {

        var create = function (options) {

            var dialogTemplate = $templateCache.get(options.templateUrl);

            var templateScope = $rootScope.$new(true);
            var templateCtrl = $controller(options.controller, {$scope: templateScope, data: options.locals.data});

            var dialogElement = angular.element(dialogTemplate);

            dialogElement.children().data('$ngControllerController', templateCtrl);

            var compiled = $compile(dialogElement)(templateScope);

            $('body').append(compiled);

        };

        return {
            create: create
        };


    };
}());