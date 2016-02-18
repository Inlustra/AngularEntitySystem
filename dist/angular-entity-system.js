!function() {
    "use strict";
    angular.module("angular-entity-system", []);
}(), angular.module("angular-entity-system").provider("EntityAPI", function() {
    var apiUrl = "", entityIdentity = "id";
    this.setApiUrl = function(value) {
        this.apiUrl = value;
    }, this.setEntityIdentity = function(value) {
        this.entityIdentity = value;
    }, this.setOnError = function(value) {
        this.onError = value;
    }, this.$get = [ "$http", "$q", function($http, $q) {
        function API() {}
        function addEntityMethods(array) {
            entityIdentity && (array.getEntity = function(id) {
                return this[this.getEntityIndex(id)];
            }, array.getEntityIndex = function(id) {
                var entity = null;
                return this.some(function(element, index) {
                    return element[entityIdentity] === id ? (entity = index, !0) : !1;
                }), null == entity && (console.groupCollapsed("Couldn't find the correct index for entity: " + id + " in array for identifier: " + entityIdentity), 
                console.log(this), console.groupEnd()), entity;
            }, array.removeEntity = function(id) {
                var index = this.getEntityIndex(id);
                null != index && this.splice(index, 1);
            });
        }
        return API.prototype.get = function(uri) {
            return this.http = $http.get(apiUrl + uri), this;
        }, API.prototype.singular = function() {
            return this.singularEntity = !0, this;
        }, API.prototype.post = function(uri, data) {
            return this.http = $http.post(apiUrl + uri, this.sanitize(data)), this;
        }, API.prototype.put = function(uri, data) {
            return this.http = $http.put(apiUrl + uri, this.sanitize(data)), this;
        }, API.prototype["delete"] = function(uri) {
            return $http["delete"](apiUrl + uri);
        }, API.prototype.sanitize = function(data) {
            return "string" == typeof data || data instanceof String ? void 0 : JSON.stringify(data);
        }, API.prototype.as = function(entity) {
            var deferred = $q.defer(), self = this;
            return this.http.then(function(data) {
                var arr = [];
                return addEntityMethods(arr), data.data instanceof Array ? (data.data.forEach(function(object) {
                    arr.push(entity.build(object));
                }), void deferred.resolve(arr)) : self.singularEntity ? void deferred.resolve(entity.build(data.data)) : (arr.push(entity.build(data.data)), 
                void deferred.resolve(arr));
            }, function(error) {
                deferred.reject(error);
            }), deferred.promise;
        }, new API();
    } ];
}), angular.module("angular-entity-system").factory("Entity", [ "Mutator", function(Mutator) {
    function Entity() {}
    return Entity.prototype.clone = function(data) {}, Entity.build = function(data) {
        var entity = new this();
        for (var dataVar in data) data.hasOwnProperty(dataVar) && (entity[dataVar] instanceof Mutator ? entity[dataVar] = entity[dataVar].transform(data[dataVar]) : entity[dataVar] = data[dataVar]);
        for (var entityVar in entity) entity[entityVar] instanceof Mutator && (entity[entityVar] = entity[entityVar].transform(null));
        return entity.clone && entity.clone(entity), entity;
    }, Entity;
} ]), angular.module("angular-entity-system").factory("Mutator", function() {
    function Mutator(mutation, arrayMutator) {
        this.mutation = mutation, this.arrayMutator = arrayMutator;
    }
    return Mutator.prototype.transform = function(field) {
        if (!this.arrayMutator && Array.isArray(field)) {
            var arr = [];
            return field.forEach(function(item) {
                arr.push(this.mutation(item));
            }.bind(this)), arr;
        }
        return this.mutation(field);
    }, Mutator;
}), angular.module("angular-entity-system").factory("DateMutator", [ "Mutator", function(Mutator) {
    return function() {
        return new Mutator(function(field) {
            function convert(data) {
                data = new Date(data);
                var days = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ], months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
                return data.getMonthName = function() {
                    return months[this.getMonth()];
                }, data.getDayName = function() {
                    return days[this.getDay()];
                }, data.humanDatetime = function() {
                    return this.toString("MMMM dd, hh:mm tt");
                }, data.humanTime = function() {
                    return this.toString("hh:mm tt");
                }, data.humanDate = function() {
                    return this.toString("MMMM dd yyyy");
                }, data.dayOfYear = function() {
                    var j1 = new Date(this);
                    return j1.setMonth(0, 0), Math.round((this - j1) / 864e5);
                }, data;
            }
            return field ? convert(field) : null;
        });
    };
} ]), angular.module("angular-entity-system").factory("EntityMutator", [ "Mutator", function(Mutator) {
    return function(EntityType) {
        return new Mutator(function(field) {
            if (!field) return null;
            if (field instanceof Array) {
                var arr = [];
                return field.forEach(function(object) {
                    arr.push(EntityType.build(object));
                }), arr;
            }
            return EntityType.build(field);
        });
    };
} ]);