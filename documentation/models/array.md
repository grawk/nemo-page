# Array Model
This model serves to identify sets of elements on a page (eg, a list or navigation items).

`_model` - "array"

Extends - [Base Model](base.md)

## Additional locator fields
Like Object, the Array model is not a standard locator. The fields associated with an Array object are determined by the model specified by the `_itemModel` field.

* `_itemModel` - {String} The model to use to process the individual items inside an Array object. This follows the same specifications as `_model`. Additional locator fields will be added to the Array model locator to adhere to the `_itemModel` chosen as well.
* `_itemsLocator` - {Locator} The locator to use to find the items.

## Methods

### collect(baseOverride)
Collects the values of all items found for the array. If any of the objects yield an empty string or undefined, they will be ignored.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to an array containing the collected data. If the array is empty, returns undefined instead.

### item(itemIndex, baseOverride)
Retrieves the item of the array at the specified index.

`@argument itemIndex {Number}` - The index of the item to retrieve.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to find the items.

`@returns {Model}` - Resolves to a page Model object based on the `_itemModel` field representing the item at that specific index.

### isPresent(baseOverride)
Checks if an element of the array is present on the page or not.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - Resolves to true if an element of the array is present and false otherwise.

### waitForPresent(baseElement)
Waits for an element of the array to become present on the page.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes present within the wait timeout and unsuccessfully if it does not.

### waitForNotPresent(baseElement)
Waits for no elements of the array to be present on the page.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes not present within the wait timeout and unsuccessfully if it does not.

### waitForDisplayed(baseElement)
Waits for an element of the array to become displayed on the page.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes displayed within the wait timeout and unsuccessfully if it does not.

### waitForNotDisplayed(baseElement)
Waits for no elements of the array to be displayed on the page. It still, however, expects at least one element to be present. If you expect the elements to no longer be present, use `waitForNotPresent` instead.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes no longer displayed within the wait timeout and unsuccessfully if it does not.