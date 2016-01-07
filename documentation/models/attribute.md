# Attribute Model
The Attribute model is an extension of the Element model where data collection is based on the value of the specified attribute of the element.

`_model` - "attribute"

Extends - [Element Model](element.md)

## Additional locator fields

* `_attribute` - The attribute to look for when collecting.

## Methods

### collect(baseOverride)
Collects the value of the specified attribute of the element.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to a string containing the text of the specified attribute of the element. If the element is not present, resolves to undefined instead.