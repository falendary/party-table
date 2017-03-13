/**
 * Created by szhitenev on 13.03.2017.
 */
(function () {

    'use strict';

    var entities = [];

    var setEntities = function (_entities) {
        entities = _entities;
    };

    var getEntities = function (entity) {
        if (entity) {
            if (typeof entity == 'string') {
                return entities[entity];
            }
        }

        return entities

    };

    module.exports = {
        setEntities: setEntities,
        getEntities: getEntities
    }

}());