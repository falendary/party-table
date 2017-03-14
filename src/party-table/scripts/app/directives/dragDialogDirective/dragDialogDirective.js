/**
 * Created by szhitenev on 14.03.2017.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                var dragger = $(elem).find('.pt-drag-target');

                var parent = $(elem);

                var posY = 0, posX = 0;
                var elemLeft = 0, elemTop = 0;
                var initMouseX = 0, initMouseY = 0;

                function mousemove(e) {

                    posX = e.pageX;
                    posY = e.pageY;

                    parent[0].style.left = (posX + elemLeft - initMouseX) + 'px';
                    parent[0].style.top = (posY + elemTop - initMouseY) + 'px';
                }

                dragger.bind('mousedown', function (e) {

                    e.preventDefault();
                    e.stopPropagation();

                    initMouseX = e.clientX;
                    initMouseY = e.clientY;

                    elemLeft = parent[0].offsetLeft;
                    elemTop = parent[0].offsetTop;

                    $(window).bind('mousemove', mousemove);

                    $(window).bind('mouseup', function (e) {
                        //console.log('unbind');
                        $(window).unbind('mousemove');
                    });

                    return false;
                })
            }
        }
    }

}());