# nemo-page

## Overview
Page is a plugin for the nemo test framework which brings a more page-structured approach to testing your data. The intention behind Page is that you would structure your locator file how it is laid out in your app (more or less).

## Installation

1. Add dependencies to package.json and install.

```javascript
	...
    "nemo": "^1.0.0",
    "nemo-page": "^1.0.0",
	...
```

2. Add plugins to your nemo config JSON object

```javascript
{
  "driver": {
    ...
  },
  "plugins": {
    "page": {
      "module": "nemo-page",
      "arguments": [
          "path:locator",
          "path:models"
      ]
    }
  },
  "data": {
    ...
  }
}
```

## locatorDefinition

The `locatorDefinition` can either be a JSON object like this:

```
{
  "locator": ".myClass",
  "type": "css"
}
```

The `type` field is any of the locator strategies here: http://seleniumhq.github.io/selenium/docs/api/javascript/namespace.

## General Use
When you initialize nemo-page, it will attach itself in your app to the `nemo.page` object. It will then create an Object model as the base for each locator json in your locators folder. For example, if you have `myLocators.json`, you can access it as `nemo.page.myLocators`.

The base object from a locator is an *actual* Object model and as such has all the same functions and uses. Any nested locators (for example, if you define a locator `loc1` on the root level of your locator file) can be accessed by `nemo.page.myLocators.loc1`.

### Page extra locator fields
The following extra fields can be added to a locator definition to change how Page handles that locator.

* `_model` - {String} This field can be any of the Page defined model types and will make that locator be used with that model definition. This field will default to "text" if not specified.
* `_base` - {Locator} The root element from which all nested elements will be found. Typically used with "object" models, this field says "all locators nested within are located **inside** of this element.

## Page Common
There are a few things that can be accessed direction from `nemo.page` which help facilitate some of the `nemo-page` operations.

### Fields

* **WAIT_TIMEOUT** - `{Number}` How long wait operations will wait before failing (in ms). Default 8000
* **NUM_RETRIES** - `{Number}` How many times to retry an operation that has retry enabled. Operations with retry enabled are marked with `Auto-Retry Enabled` in the documentation.

### Methods

#### doOperationWithRetry(operation, numRetries)
Given a function which resolves to a promise, will catch any errors that the promise throws and retry again for the specified number of retries.

`@argument operation {Function}` - A function which resolves to a promise.

`@argument numRetries {Number}` - How many times to retry the operation.

`@return {Promise}` - Returns a promise which will resolve to the successful value should the operation succeed within the number of attempts or the last error thrown should it fail.

## Model Types
The major functionality of Page comes from using different "models" in the locators (see `_model` above). Each model has its own set of functions as well as some common functions across all models (or types of model).

### Base Model
This model serves as the root for all models, providing some of the basic functionality needed across the board.

See: [Base Model](documentation/models/base.md)

### Object Model
This model is mostly for organization of commonly located elements. Object models can't be looked up on their own, but contain 1 or more nested fields which can be looked up.

See: [Object Model](documentation/models/object.md)

### Template Object Model
This model is used when you have objects on a page where you want to use a dynamic locator based on underscore templates. An example is if you have a list of accounts with the account id as the id of the item, you can have a locator "#<%= accountId %>".

See: [Template Object Model](documentation/models/template-object.md)

### Array Model
This model serves to identify sets of elements on a page (eg, a list or navigation items). It is similar to the object model in that it contains nested fields for lookup. Fields can be looked up either individually by index or collected as a group.

See: [Array Model](documentation/models/array.md)

### Element Model
The Element model is the model used for anything that resolves to an element on the page. Most other models will extend this model.

See: [Element Model](documentation/models/element.md)

### Input Model
The Input model is an extension of the Element model where data collection is based on the input value of the element.

See: [Input Model](documentation/models/input.md)

### Select Model
The Select model is an extension of the Element model where data collection is based on the input value of a select element as well as handling set operations specifically for select elements.

See: [Select Model](documentation/models/select.md)

### Select Model
The Radio model is an extension of the Element model where data collection is based on the input value of the matching checked radio option as well as handling set operations specifically for radio input elements.

See: [Radio Model](documentation/models/radio.md)

## Creating Custom Models

Custom models can be used by specifying a models folder as the second argument. It will assume that each js file is a unique model where the `_model` key is the name of the file. Models do not directly enforce any kind of structure, but it is a good idea to at least extend the functionality of Base (for non-element models) or Element (for element-level models). You can access any of the existing models on `require('nemo-page').typeMappings`.