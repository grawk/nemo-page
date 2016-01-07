# Text Model
The Text model is an extension of the Element model where data collection is based on the text of the element.

`_model` - "text"

Extends - [Element Model](element.md)

## Methods

### collect(baseOverride)
Collects the text value of the element.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to a string containing the text of the element. If the element is not present, resolves to undefined instead.