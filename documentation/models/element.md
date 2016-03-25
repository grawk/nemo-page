# Element Model
The Element model is the model used for anything that resolves to an element on the page.

`_model` - "element"

Extends - [Base Model](base.md)

## Additional locator fields
The element model takes the following additional locator fields

* `_data` - {String} (Optional) This field specifies what to collect when using the `collect` method. Defaults to `text`.
* `locator` - {String} (Optional) This is the locator string used to look up the element by the `type` specified. If not specified, it will look up the closest base element instead for all functionalities.
* `type` - {String} (Optional) This is the type of lookup to perform. This accepts any selenium type such as `css`, `xpath`, `id`, etc...

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

### hover(baseOverride)
Hovers over the element on the page.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - Returns the promise from hovering over the element.

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
Waits for the element to become present on the page. **NOTE** `waitForNotPresent` still expects the base element (if there is one) to be present.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes present within the wait timeout and unsuccessfully if it does not.

### waitForNotPresent(baseElement)
Waits for the element to become no longer present on the page. **NOTE** `waitForNotPresent` still expects the base element (if there is one) to be present.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes not present within the wait timeout and unsuccessfully if it does not.

### waitForDisplayed(baseElement)
Waits for the element to become displayed on the page. **NOTE** `waitForDisplayed` calls `waitForPresent` first. Make sure the requirements for `waitForPresent` are met.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes displayed within the wait timeout and unsuccessfully if it does not.

### waitForNotDisplayed(baseElement)
Waits for the element to become no longer displayed on the page. It still, however, expects the element to be present. If you expect the element to no longer be present, use `waitForNotPresent` instead. **NOTE** `waitForNotDisplayed` calls `waitForPresent` first. Make sure the requirements for `waitForPresent` are met.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element becomes not displayed within the wait timeout and unsuccessfully if it does not.

### waitForTextExists(baseElement)
Waits for the element on the page to contain text. **NOTE** `waitForTextExists` calls `waitForPresent` first. Make sure the requirements for `waitForPresent` are met.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element contains some text within the wait timeout and unsuccessfully if it does not.

### waitForTextEqual(text, baseElement)
Waits for the element on the page to contain the specified text. **NOTE** `waitForTextEqual` calls `waitForPresent` first. Make sure the requirements for `waitForPresent` are met.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element contains the specified text within the wait timeout and unsuccessfully if it does not.

### waitForTextNotEqual(text, baseElement)
Waits for the element on the page to not contain the specified text. **NOTE** `waitForTextNotEqual` calls `waitForPresent` first. Make sure the requirements for `waitForPresent` are met.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the element contains text other than the specified text within the wait timeout and unsuccessfully if it does not.

### waitForAttributeEqual(attribute, text, baseElement)
Waits for the specified attribute on the element on the page to contain the specified text value. **NOTE** `waitForAttributeEqual` calls `waitForPresent` first. Make sure the requirements for `waitForPresent` are met.

`@argument attribute {String}` - The attribute to look at.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the specified attribute on the element contains the specified text value within the wait timeout and unsuccessfully if it does not.

### waitForAttributeNotEqual(attribute, text, baseElement)
Waits for the specified attribute on the element on the page to contain text other than the specified text value. **NOTE** `waitForAttributeNotEqual` calls `waitForPresent` first. Make sure the requirements for `waitForPresent` are met.

`@argument attribute {String}` - The attribute to look at.

`@argument text {String}` - The text to check for.

`@argument baseElement {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` Resolves sucessfully if the specified attribute on the element contains the text other than the specified text value within the wait timeout and unsuccessfully if it does not.

### collect(baseOverride)
Collects the data based on the `_data` field. If `_data` is not specified in the locator, this will collect the text of the element.
Possible `_data` values:
* `text` - Collect the text of the element.
* `html` - Collect the html of the element.
* `attribute:<attributeName>` - Collects the attribute of the name `<attributeName>` on the element.
* `present` - Collects `true` if the element is present and `false` otherwise.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - Returns the promise from clicking the element.