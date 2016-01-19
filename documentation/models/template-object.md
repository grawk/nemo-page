# Template Object Model
This model is used when you have objects on a page where you want to use a dynamic locator based on underscore templates. An example is if you have a list of accounts with the account id as the id of the item, you can have a locator "#<%= accountId %>".

`_model` - "templateObject"

Extends - [Base Model](base.md)

## Additional locator fields
Like Object, the Template Object model is not a standard locator. The fields associated with an object are determined by the model specified by the `_itemModel` field.

* `_itemModel` - {String} The model to use to process the individual items inside an Array object. This follows the same specifications as `_model`. Additional locator fields will be added to the Array model locator to adhere to the `_itemModel` chosen as well.
* `_locatorTemplate` - {Locator} The locator template to use to find the items. Follows the [underscore template](http://underscorejs.org/#template) format.

## Methods

### collectItem(data, baseOverride)
Collects the data based on the `_itemModel` for the element that matches based on the data passed in.

`@argument data {Object}` - The data to be used by the locator template.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to an the collected data. The format of the resolved data is determined by `_itemModel`

### item(data, baseOverride)
Retrieves the element which matches based on the data passed in.

`@argument data {Object}` - The data to be used by the locator template.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to find the items.

`@returns {Model}` - Resolves to a page Model object based on the `_itemModel` field representing the item that matches the data passed in.

### waitForPresent(data, baseElement)
Waits for an element which matches based on the data passed in to become present on the page. **NOTE** waitForPresent does *not* use the `_base` when checking for presence. This will be fixed later, but it is done this way now to avoid unexpected errors. If you want it to use the `_base`, pass in the result of `_getBase()` to the call.

`@argument data {Object}` - The data to be used by the locator template.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes present within the wait timeout and unsuccessfully if it does not.

### waitForNotPresent(data, baseElement)
Waits for the element which matches based on the data passed in to no longer be present on the page. **NOTE** waitForNotPresent does *not* use the `_base` when checking for presence. This will be fixed later, but it is done this way now to avoid unexpected errors. If you want it to use the `_base`, pass in the result of `_getBase()` to the call.

`@argument data {Object}` - The data to be used by the locator template.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes not present within the wait timeout and unsuccessfully if it does not.

### waitForDisplayed(baseElement)
Waits for an element which matches based on the data passed in to become displayed on the page. **NOTE** waitForDisplayed calls waitForPresent first. While waitForDisplayed uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument data {Object}` - The data to be used by the locator template.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes displayed within the wait timeout and unsuccessfully if it does not.

### waitForNotDisplayed(baseElement)
Waits for the element which matches based on the data passed in to no be displayed on the page. It still, however, expects the element to be present. If you expect the element to no longer be present, use `waitForNotPresent` instead. **NOTE** waitForNotDisplayed calls waitForPresent first. While waitForNotDisplayed uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument data {Object}` - The data to be used by the locator template.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes no longer displayed within the wait timeout and unsuccessfully if it does not.