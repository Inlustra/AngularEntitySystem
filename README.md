# Angular Entity System v0.0.2

An entity system wrapper used to turn raw JSON objects into useful entities!

## Installation

Via Bower: 
```bash
bower install angular-entity-system
```

Add module to AngularJS:
```javascript
angular.module('<Your Module Here>', [
   'angular-entity-system'
   ...
]);
```

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
we can assign meaning to the JSON object. Using Mutators, we can also assign meaning to sub objects. See below for current Mutator types.

First, we create our DurationObject and add any extra methods we'd like to that.

```javascript
angular.module('my-module').factory('DurationObject', ["Entity", "DateMutator", function (Entity, DateMutator) {

    function DurationObject() {
    }

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

   ... Extra methods

    return angular.extend(DurationObject, Entity);
}]);
```

And then we allow the API to gather the JSON and transform it:
```javascript
    EntityAPI.get('http://whereeverasingleobject.json').singluar().as(DurationObject); // Returns a single DurationObject
    EntityAPI.get('http://whereeveranarrayobject.json').as(DurationObject); // Returns an array of DurationObjects
```

## Components

### Entities

An Entity is a simple AngularJS object extending the AngularJS Entity Factory.
```javascript
return angular.extend(DurationObject, Entity);
```
These entities have the Entity.Build function allowing the API to call the build function for your particular entity type, scanning it for Mutators.

### Mutators

Currently, only 2 Mutators have been written. (More to be added with feedback?).

A Date Mutator and an EntityMutator, allowing inner Objects to also be converted to entities

```json
{"innerEntity": {"sampleDate": "2016-02-19T15:21:52.000+0000"}}
```
We need an entity per nested object.
```javascript
.factory('OuterObject', ["Entity", "EntityMutator", "InnerObject", function (Entity, EntityMutator, InnerObject) {

    function OuterObject() {
    }
    
    OuterObject.prototype.innerEntity = new EntityMutator(InnerObject);
    
   ... Extra methods
    return angular.extend(OuterObject, Entity);
}]).factory('InnerObject', ["Entity", "DateMutator", "InnerObject", function (Entity, DateMutator, InnerObject) {

    function InnerObject() {
    }
    
    InnerObject.prototype.sampleDate = new DateMutator(); //Doesn't need a 'new' unless the mutator has a state
    
   ... Extra methods
    return angular.extend(InnerObject, Entity);
}]);
```
Mutators have been written in such a way that the Builder will accept both an Array and an Object.
```json
{"innerEntity": {"sampleDate": "2016-02-19T15:21:52.000+0000"}}
{"innerEntity": {"sampleDate": ["2016-02-19T15:21:52.000+0000","2016-02-19T15:21:52.000+0000"]}}
```
#### Creating Mutators

```javascript
    .factory('DoNothingMutator', ["Mutator", function (Mutator) {
        return function () { //I'd like to point out that I'm 70% sure that I have too many functions here
            return new Mutator(function (field) {
               //This mutator does nothing.
               return field;
            }, false); //By Changing false to true, you can modify Arrays, rather than the objects in the array itself (If you want to add methods to the arrays)
        };
    }]);
```

If anyone would like to add a common Mutator type, please do so with a pull-request and I'll merge them into the main branch


### EntityAPI

   Most methods in EntityAPI either return EntityAPI or a promise with the exception of delete. 
   (Need ideas here, the api can certainly be improved)
   
#### Config
   
   `EntityAPIProvider.setApiUrl("http://baseurl.com");` 
   This adds a base url to all EntityApi methods.

   `EntityAPIProvider.setEntityIdentity("MyDatabaseIdentifier");` 
   Defaults to "id", With entity identity being defined, arrays gathered by `EntityAPI.get("/MyUrl").as(EntityType);` 
   To have 3 added methods. 
   ```javascript
   EntityAPI.get("/MyUrl").as(EntityType).then(function(entityTypeArray) {
      var singleEntity = entityTypeArray.getEntity(5); //Returns EntityType where (entityTypeArray[index].<entityIdentity> == 5)
      var singleEntityIndex = entityTypeArray.getEntityIndex(5); //Returns index where (entityTypeArray[index].<entityIdentity> == 5)
      entityTypeArray.removeEntity(5); //Removes (Splices) the entity where entityIdentity == 5 
   });
   ```
   `EntityAPIProvider.setEntityIdentity(null);` Stops the methods from being added to the arrays.
   
   `EntityAPIProvider.setOnError(function(error){});`
   Adds a function to be called when $http returns an error
   
## License

MIT License

Copyright (c) Thomas Nairn

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
