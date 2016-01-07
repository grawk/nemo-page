# Select Model
The Select model is an extension of the Element model where data collection is based on the input value of a select element as well as handling set operations specifically for select elements.

`_model` - "select"

Extends - [Element Model](element.md)

## Methods

### collect(baseOverride)
Collects the input value of the element.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to a string containing the input value of the element. If the element is not present, resolves to undefined instead.

### setValue(data)
Sets the option for the select.

`@argument data {String}` - The value of the option element to be set.