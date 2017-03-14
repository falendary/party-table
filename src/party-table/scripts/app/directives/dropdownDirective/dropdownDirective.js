/**
 * Created by szhitenev on 14.03.2017.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'A',
            link: function ($scope, $elem, $attrs) {

                $elem.find('a.pt-icon-button').on('click', function () {
                    $elem.find('.pt-dropdown-content').addClass('active');

                    $(document).bind('click touchstart', function (e) {

                        if (!$elem.find('.pt-dropdown-content').is(e.target) &&
                            (!$elem.find('.pt-dropdown-content').find(e.target).length) && !$elem.find('a.pt-icon-button').is(e.target) &&
                            (!$elem.find('a.pt-icon-button').find(e.target).length)
                        ) {
                            hideDropdown();
                            $(document).unbind('click touchstart');
                        }
                    });

                });

                function hideDropdown() {
                    $elem.find('.pt-dropdown-content').removeClass('active');
                }


            }
        }
    }

}())