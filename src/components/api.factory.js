angular.module('angular-entity-system')
    .provider('EntityAPI', function () {
        var apiUrl = '';
        var entityIdentity = 'id';
        var onError = function (error) {
            console.error(error);
        };

        this.setApiUrl = function (value) {
            this.apiUrl = value;
        };

        this.setEntityIdentity = function (value) {
            this.entityIdentity = value;
        };

        this.setOnError = function (value) {
            this.onError = value;
        };

        this.$get = ["$http", "$q", function ($http, $q) {

            function API() {

            }

            API.prototype.get = function (uri) {
                this.http = $http.get(apiUrl + uri);
                return this;
            };

            API.prototype.singular = function () {
                this.singularEntity = true;
                return this;
            };

            API.prototype.post = function (uri, data) {
                this.http = $http.post(apiUrl + uri, this.sanitize(data));
                return this;
            };


            API.prototype.put = function (uri, data) {
                this.http = $http.put(apiUrl + uri, this.sanitize(data));
                return this;
            };

            API.prototype.delete = function (uri) {
                return $http.delete(apiUrl + uri);
            };

            API.prototype.sanitize = function (data) {
                if (typeof(data) === 'string' || data instanceof String) {
                    return;
                }
                return JSON.stringify(data);
            };

            API.prototype.as = function (entity) {
                var deferred = $q.defer();
                var self = this;
                this.http.then(function (data) {
                    var arr = [];
                    addEntityMethods(arr);
                    if (data.data instanceof Array) {
                        data.data.forEach(function (object) {
                            arr.push(entity.build(object));
                        });
                        deferred.resolve(arr);
                        return;
                    }
                    if (self.singularEntity) {
                        deferred.resolve(entity.build(data.data));
                        return;
                    }
                    arr.push(entity.build(data.data));
                    deferred.resolve(arr);
                }, function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };

            function addEntityMethods(array) {
                if (!entityIdentity) {
                    return;
                }
                array.getEntity = function (id) {
                    return this[this.getEntityIndex(id)];
                };

                /*jshint unused:true, eqnull:true */
                array.getEntityIndex = function (id) {
                    var entity = null;
                    this.some(function (element, index) {
                        if (element[entityIdentity] === id) {
                            entity = index;
                            return true;
                        }
                        return false;
                    });
                    if (entity == null) {
                        console.groupCollapsed('Couldn\'t find the correct index for entity: ' + id + ' in array for identifier: ' + entityIdentity);
                        console.log(this);
                        console.groupEnd();
                    }
                    return entity;
                };

                array.removeEntity = function (id) {
                    var index = this.getEntityIndex(id);
                    if (index != null)
                        this.splice(index, 1);
                };
            }

            return new API();
        }];
    });
