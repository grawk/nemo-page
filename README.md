# nemo-page

## Overview
Page is a plugin for the nemo test framework which brings a more page-structured approach to testing your data. The intention behind Page is that you would structure your locator file how it is laid out in your app (more or less).

## Installation

1. Add dependencies to package.json and install.

```javascript
	...
    "nemo": "^1.0.0",
    "nemo-page": "^0.0.1",
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
      "arguments": ["path:locator"]
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

### Page extra locator fields
The following extra fields can be added to a locator definition to change how Page handles that locator.

* `_model` - {String} This field can be any of the Page defined model types and will make that locator be used with that model definition. This field will default to "text" if not specified.
* `_base` - {Locator} The root element from which all nested elements will be found. Typically used with "object" models, this field says "all locators nested within are located **inside** of this element.

## Model Types
The major functionality of Page comes from using different "models" in the locators (see `_model` above). Each model has its own set of functions as well as some common functions across all models (or types of model).

### Base Model
This model serves as the root for all models, providing some of the basic functionality needed across the board.

`_model` - Abstract... cannot be instantiated from `_model`

#### Methods

##### _getBase(cache)
Gets the base element for the object. Will walk up its parent objects to find the closest one.

`@argument cache {Boolean}` - True to cache the base element; false or undedined to not cache it.

`@returns {Promise}` resolves to a WebElement of the appropriate base element to the object. If the object does not have a `_base` of its own, it walks up the parent objects until it finds one (or returns undefined).

##### _clearBase(isRecursive)
Clears the cached base element of the object.

`@argument isRecursive {Boolean}` - Whether to keep clearing the cached bases of the parent objects.

### Object Model
This model is mostly for organization of commonly located elements. Often, Object models will have a `_base` which all the nested elements fall within.

`_model` - "object"

Extends - [Base Model](#base-model)

#### Additional locator fields
The Object model is not a standard locator. It does not contain the `locator` or `type` fields. Instead, It will have other locators nested inside of it.

```javascript
    {
        "_model": "object",

        "loc1": {
            "locator": "...",
            "type": "css"
        },
        "loc2": {
            "locator": "...",
            "type": "css"
        }
    }
```

#### Methods

##### collect(baseOverride)
Collects the values of all nested objects. If any of the objects yield an empty string or undefined, they will be ignored.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to an object containing the collected data. The keys of the object correspond to the keys of the nested locators.

##### setValue(data)
Sets the data for any specified nested objects which also have a setValue method. The behavior on Object model just passes the right data to the other nested objects within. Actual handling of the data depends on what `_model` those nested objects are.

`@argument data {Object}` - The data to be set.

### Array Model
This model serves to identify sets of elements on a page (eg, a list or navigation items).

`_model` - "array"

Extends - [Base Model](#base-model)

#### Additional locator fields
Like Object, the Array model is not a standard locator. The fields associated with an Array object are determined by the model specified by the `_itemModel` field.

* `_itemModel` - {String} The model to use to process the individual items inside an Array object. This follows the same specifications as `_model`. Additional locator fields will be added to the Array model locator to adhere to the `_itemModel` chosen as well.
* `_itemsLocator` - {Locator} The locator to use to find the items.

#### Methods

##### collect(baseOverride)
Collects the values of all items found for the array. If any of the objects yield an empty string or undefined, they will be ignored.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to an array containing the collected data. If the array is empty, returns undefined instead.

##### item(itemIndex, baseOverride)
Retrieves the item of the array at the specified index.

`@argument itemIndex {Number}` - The index of the item to retrieve.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to find the items.

`@returns {Promise}` - Resolves to the item at the specific index. **NOTE** The promise directly returned is *not* an WebElement, but the item in the `promise.then` function is.

### Element Model
The Element model is the interface model used for anything that resolves to an element on the page.

`_model` - Abstract... cannot be instantiated from `_model`

Extends - [Base Model](#base-model)

#### Methods

##### locator()
Gets the locator for the object.

`@returns {String}` - Returns the string locator for the object. This string can be used with `selenium-drivex`.

##### get(baseOverride)
Gets the element on the page.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {WebElement}` - Returns the WebElement from the objects locator.

##### click(baseOverride)
Clicks the element on the page.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - Returns the promise from clicking the element.

##### isPresent(baseOverride)
Checks if the element is present on the page or not.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - Resolves to true if the element is present and false otherwise.

##### isDisplayed(baseOverride)
Checks if the element is displayed on the page or not.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - Resolves to true if the element is displayed and false otherwise.

##### waitForPresent(baseElement)
Waits for the element to become present on the page. **NOTE** waitForPresent does *not* use the `_base` when checking for presence. This will be fixed later, but it is done this way now to avoid unexpected errors. If you want it to use the `_base`, pass in the result of `_getBase()` to the call.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes present within the wait timeout and unsuccessfully if it does not.

##### waitForNotPresent(baseElement)
Waits for the element to become no longer present on the page. **NOTE** waitForNotPresent does *not* use the `_base` when checking for presence. This will be fixed later, but it is done this way now to avoid unexpected errors. If you want it to use the `_base`, pass in the result of `_getBase()` to the call.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes not present within the wait timeout and unsuccessfully if it does not.

##### waitForDisplayed(baseElement)
Waits for the element to become displayed on the page. **NOTE** waitForDisplayed calls waitForPresent first. While waitForDisplayed uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes displayed within the wait timeout and unsuccessfully if it does not.

##### waitForNotPresent(baseElement)
Waits for the element to become no longer displayed on the page. It still, however, expects the element to be present. If you expect the element to no longer be present, use `waitForNotPresent` instead. **NOTE** waitForNotDisplayed calls waitForPresent first. While waitForNotDisplayed uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes not displayed within the wait timeout and unsuccessfully if it does not.

##### waitForTextExists(baseElement)
Waits for the element on the page to contain text. **NOTE** waitForTextExists calls waitForPresent first. While waitForTextExists uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element contains some text within the wait timeout and unsuccessfully if it does not.

##### waitForTextEqual(text, baseElement)
Waits for the element on the page to contain the specified text. **NOTE** waitForTextEqual calls waitForPresent first. While waitForTextEqual uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element contains the specified text within the wait timeout and unsuccessfully if it does not.

##### waitForTextNotEqual(text, baseElement)
Waits for the element on the page to not contain the specified text. **NOTE** waitForTextNotEqual calls waitForPresent first. While waitForTextNotEqual uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element contains text other than the specified text within the wait timeout and unsuccessfully if it does not.

##### waitForAttributeEqual(attribute, text, baseElement)
Waits for the specified attribute on the element on the page to contain the specified text value. **NOTE** waitForAttributeEqual calls waitForPresent first. While waitForAttributeEqual uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument attribute {String}` - The attribute to look at.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the specified attribute on the element contains the specified text value within the wait timeout and unsuccessfully if it does not.

##### waitForAttributeNotEqual(attribute, text, baseElement)
Waits for the specified attribute on the element on the page to contain text other than the specified text value. **NOTE** waitForAttributeNotEqual calls waitForPresent first. While waitForAttributeNotEqual uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument attribute {String}` - The attribute to look at.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the specified attribute on the element contains the text other than the specified text value within the wait timeout and unsuccessfully if it does not.

### Text Model
The Text model is an extension of the Element model where data collection is based on the text of the element.

`_model` - "text"

Extends - [Element Model](#element-model)

#### Methods

##### collect(baseOverride)
Collects the text value of the element.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to a string containing the text of the element. If the element is not present, resolves to undefined instead.

### HTML Model
The HTML model is an extension of the Element model where data collection is based on the inner html of the element.

`_model` - "html"

Extends - [Element Model](#element-model)

#### Methods

##### collect(baseOverride)
Collects the inner html of the element.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to a string containing the inner html of the element. If the element is not present, resolves to undefined instead.

### Present Model
The Text model is an extension of the Element model where data collection is based on the presence of the element.

`_model` - "present"

Extends - [Element Model](#element-model)

#### Methods

##### collect(baseOverride)
Collects the value indicating the presenece of the element.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to true if the element is present and false otherwise.

### Attribute Model
The Attribute model is an extension of the Element model where data collection is based on the value of the specified attribute of the element.

`_model` - "attribute"

Extends - [Element Model](#element-model)

#### Additional locator fields

* `_attribute` - The attribute to look for when collecting.

#### Methods

##### collect(baseOverride)
Collects the value of the specified attribute of the element.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to a string containing the text of the specified attribute of the element. If the element is not present, resolves to undefined instead.

### Input Model
The Input model is an extension of the Element model where data collection is based on the input value of the element.

`_model` - "input"

Extends - [Element Model](#element-model)

#### Methods

##### collect(baseOverride)
Collects the input value of the element.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to a string containing the input value of the element. If the element is not present, resolves to undefined instead.

##### setValue(data)
Sets the input value for the element.

`@argument data {String}` - The data to be set.