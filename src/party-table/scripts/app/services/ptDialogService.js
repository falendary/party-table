/**
 * Created by szhitenev on 14.03.2017.
 */
(function () {

    'use strict';

    module.exports = function ($rootScope, $controller, $compile, $templateCache) {

        var dialogTemplate;
        var templateScope;
        var templateCtrl;
        var dialogElement;

        var create = function (options) {

            if (dialogElement) {
                dialogElement.html('');
            }

            dialogTemplate = $templateCache.get(options.templateUrl);

            templateScope = $rootScope.$new(true);
            templateCtrl = $controller(options.controller, {$scope: templateScope, data: options.locals.data});

            dialogElement = angular.element(dialogTemplate);

            dialogElement.children().data('$ngControllerController', templateCtrl);

            var compiled = $compile(dialogElement)(templateScope);

            $('body').append(compiled);

        };

        var hide = function (options) {

            dialogElement.html('');

            return new Promise(function (resolve, reject) {
                resolve(options);
            })
        };

        var cancel = function () {
            dialogElement.html('');
        };


        return {
            create: create,
            hide: hide,
            cancel: cancel
        };


    };
}());