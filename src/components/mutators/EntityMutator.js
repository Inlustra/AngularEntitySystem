angular.module('angular-entity-system')
    .factory('EntityMutator', ["Mutator", function (Mutator) {
        return function (EntityType) {
            return new Mutator(function (field) {
                if (!field) {
                    return null;
                }
                if (field instanceof Array) {
                    var arr = [];
                    field.forEach(function (object) {
                        arr.push(EntityType.build(object));
                    });
                    return arr;
                }
                return EntityType.build(field);
            });
        };
    }]);