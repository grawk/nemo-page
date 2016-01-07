# Input Model
The Input model is an extension of the Element model where data collection is based on the input value of the element.

`_model` - "input"

Extends - [Element Model](element.md)

## Methods

### collect(baseOverride)
Collects the input value of the element.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to a string containing the input value of the element. If the element is not present, resolves to undefined instead.

### setValue(data)
Sets the input value for the element.

`@argument data {String}` - The data to be set.