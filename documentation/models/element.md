# Element Model
The Element model is the interface model used for anything that resolves to an element on the page.

`_model` - Abstract... cannot be instantiated from `_model`

Extends - [Base Model](base.md)

## Methods

### locator()
Gets the locator for the object.

`@returns {String}` - Returns the string locator for the object. This string can be used with `selenium-drivex`.

### get(baseOverride)
Gets the element on the page.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {WebElement}` - Returns the WebElement from the objects locator.

### click(baseOverride)
Clicks the element on the page.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - Returns the promise from clicking the element.

### dragAndDropTo(dropItem)
Drags the element and drops it inside the item specified by dropItem.

`@argument dropItem {Element Model}` - The nemo-page item to use for where to drop. This item *should* extend from the Element Model, but will work with custom models as long as they contain the `get` method.

`@returns {Promise}` - Returns the promise from dragging and dropping the element.

### isPresent(baseOverride)
Checks if the element is present on the page or not.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - Resolves to true if the element is present and false otherwise.

### isDisplayed(baseOverride)
Checks if the element is displayed on the page or not.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - Resolves to true if the element is displayed and false otherwise.

### waitForPresent(baseElement)
Waits for the element to become present on the page. **NOTE** waitForPresent does *not* use the `_base` when checking for presence. This will be fixed later, but it is done this way now to avoid unexpected errors. If you want it to use the `_base`, pass in the result of `_getBase()` to the call.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes present within the wait timeout and unsuccessfully if it does not.

### waitForNotPresent(baseElement)
Waits for the element to become no longer present on the page. **NOTE** waitForNotPresent does *not* use the `_base` when checking for presence. This will be fixed later, but it is done this way now to avoid unexpected errors. If you want it to use the `_base`, pass in the result of `_getBase()` to the call.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes not present within the wait timeout and unsuccessfully if it does not.

### waitForDisplayed(baseElement)
Waits for the element to become displayed on the page. **NOTE** waitForDisplayed calls waitForPresent first. While waitForDisplayed uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes displayed within the wait timeout and unsuccessfully if it does not.

### waitForNotDisplayed(baseElement)
Waits for the element to become no longer displayed on the page. It still, however, expects the element to be present. If you expect the element to no longer be present, use `waitForNotPresent` instead. **NOTE** waitForNotDisplayed calls waitForPresent first. While waitForNotDisplayed uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes not displayed within the wait timeout and unsuccessfully if it does not.

### waitForTextExists(baseElement)
Waits for the element on the page to contain text. **NOTE** waitForTextExists calls waitForPresent first. While waitForTextExists uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element contains some text within the wait timeout and unsuccessfully if it does not.

### waitForTextEqual(text, baseElement)
Waits for the element on the page to contain the specified text. **NOTE** waitForTextEqual calls waitForPresent first. While waitForTextEqual uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element contains the specified text within the wait timeout and unsuccessfully if it does not.

### waitForTextNotEqual(text, baseElement)
Waits for the element on the page to not contain the specified text. **NOTE** waitForTextNotEqual calls waitForPresent first. While waitForTextNotEqual uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element contains text other than the specified text within the wait timeout and unsuccessfully if it does not.

### waitForAttributeEqual(attribute, text, baseElement)
Waits for the specified attribute on the element on the page to contain the specified text value. **NOTE** waitForAttributeEqual calls waitForPresent first. While waitForAttributeEqual uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument attribute {String}` - The attribute to look at.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the specified attribute on the element contains the specified text value within the wait timeout and unsuccessfully if it does not.

### waitForAttributeNotEqual(attribute, text, baseElement)
Waits for the specified attribute on the element on the page to contain text other than the specified text value. **NOTE** waitForAttributeNotEqual calls waitForPresent first. While waitForAttributeNotEqual uses the `_base` properly, it is possible to encounter issues if the element exists on the page, but not in the `_base` chain. This will be fixed when waitForPresent becomes fixed.

`@argument attribute {String}` - The attribute to look at.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the specified attribute on the element contains the text other than the specified text value within the wait timeout and unsuccessfully if it does not.