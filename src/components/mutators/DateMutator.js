angular.module('angular-entity-system')
    .factory('DateMutator', ["Mutator", function (Mutator) {
        return function () {
            return new Mutator(function (field) {
                if (!field) {
                    return null;
                }
                function convert(data) {
                    data = new Date(data);
                    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    data.getMonthName = function () {
                        return months[this.getMonth()];
                    };
                    data.getDayName = function () {
                        return days[this.getDay()];
                    };
                    data.humanDatetime = function () {
                        return this.toString("MMMM dd, hh:mm tt");
                    };
                    data.humanTime = function () {
                        return this.toString("hh:mm tt");
                    };
                    data.humanDate = function () {
                        return this.toString("MMMM dd yyyy");
                    };
                    data.dayOfYear = function () {
                        var j1 = new Date(this);
                        j1.setMonth(0, 0);
                        return Math.round((this - j1) / 8.64e7);
                    };
                    return data;
                }
                return convert(field);

            });
        };
    }]);