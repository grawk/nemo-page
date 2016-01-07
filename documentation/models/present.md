# Present Model
The Text model is an extension of the Element model where data collection is based on the presence of the element.

`_model` - "present"

Extends - [Element Model](element.md)

## Methods

### collect(baseOverride)
Collects the value indicating the presenece of the element.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to true if the element is present and false otherwise.