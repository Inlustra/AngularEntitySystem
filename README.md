# Angular Entity System

An entity system wrapper used to turn raw JSON objects into useful entities!

## Installation

//TODO - VIA BOWER

## Example

Take the following json:
```json
{
   "id" : 1,
   "startTime":"2016-02-18T15:21:52.000+0000",
   "endtime":"2016-02-19T15:21:52.000+0000",
   "version":0,
   "name":"Example Json"
}
```

The dates are considered Strings and any extra methods such as duration would have to be added manually. with the following code,
we can assign meaning to the JSON object.

First, we create our DurationObject and add any extra methods we'd like to that.

```javascript
angular.module('my-module').factory('DurationObject', ["Entity", "DateMutator", function (Entity, DateMutator) {

    function DurationObject() {
    }

    DurationObject.prototype.id = -1;
    DurationObject.prototype.name = "";
    DurationObject.prototype.startTime = new DateMutator();
    DurationObject.prototype.endTime = new DateMutator();

    DurationObject.prototype.isNewer = function (object) {
        return this.version > object.version;
    };

    DurationObject.prototype.status = function () {
        var now = new Date();
        if (this.endTime <= now) {
            return 'Completed';
        }
        if (this.startTime <= now) {
            return 'Active';
        }
        return 'Upcoming';
    };

    DurationObject.prototype.getTimeUntilEnd = function (humanize) {
        var date = moment(new Date()).twix(this.endTime);
        return humanize ? date.humanizeLength() : date;
    };

    DurationObject.prototype.getTimeSinceEnd = function (humanize) {
        var date = moment(this.endTime).twix(new Date());
        return humanize ? date.humanizeLength() : date;
    };

    DurationObject.prototype.getTimeUntilStart = function (humanize) {
        var date = moment(new Date()).twix(this.startTime);
        return humanize ? date.humanizeLength() : date;
    };

    DurationObject.prototype.getStatusText = function () {
        switch (this.status()) {
            case "Active":
                return "will close in " + this.getTimeUntilEnd(true);
            case "Completed":
                return "ended " + this.getTimeSinceEnd(true) + " ago.";
            case "":
                return "will start in " + event.getTimeUntilStart(true);
            default:
                return "Unknown";
        }
    };

    return angular.extend(DurationObject, Entity);
}]);
```

And then we allow the API to gather the JSON and transform it:
```javascript
    API.get('http://whereeverasingleobject.json').singluar().as(DurationObject); // Returns a single DurationObject
    API.get('http://whereeveranarrayobject.json').as(DurationObject); // Returns an array of DurationObjects
```

## Components

### Entities

//TODO Docs

### Mutators

//TODO Docs

### API

//TODO Docs

## License

MIT License

Copyright (c) Thomas Nairn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.