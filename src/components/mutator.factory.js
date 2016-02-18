angular.module('angular-entity-system').factory('Mutator', function () {
    function Mutator(mutation, arrayMutator) {
        this.mutation = mutation;
        this.arrayMutator = arrayMutator;
    }

    Mutator.prototype.transform = function (field) {
        if (!this.arrayMutator) //If arrayMutator is not true, it will loop through each entity individually
            if (Array.isArray(field)) {
                var arr = [];
                field.forEach(function (item) {
                    arr.push(this.mutation(item));
                }.bind(this));
                return arr;
            }
        return this.mutation(field);
    };

    return Mutator;
});
