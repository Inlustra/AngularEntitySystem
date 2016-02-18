angular.module('angular-entity-system').factory('Entity', ["Mutator", function (Mutator) {
    function Entity() {

    }

    Entity.prototype.clone = function (data) {
    };


    Entity.build = function (data) {
        var entity = new this();
        for (var dataVar in data) {
            if (!data.hasOwnProperty(dataVar)) continue;
            if (entity[dataVar] instanceof Mutator) {
                entity[dataVar] = entity[dataVar].transform(data[dataVar]);
                continue;
            }
            entity[dataVar] = data[dataVar];
        }
        for (var entityVar in entity) {
            if (entity[entityVar] instanceof Mutator) {
                entity[entityVar] = entity[entityVar].transform(null);
            }
        }
        if (entity.clone)
            entity.clone(entity);
        return entity;
    };

    return Entity;
}]);