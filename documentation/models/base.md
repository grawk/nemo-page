# Base Model
This model serves as the root for all models, providing some of the basic functionality needed across the board.

`_model` - Abstract... cannot be instantiated from `_model`

## Methods

### _getBase(cache)
Gets the base element for the object. Will walk up its parent objects to find the closest one.

`@argument cache {Boolean}` - True to cache the base element; false or undedined to not cache it.

`@returns {Promise}` resolves to a WebElement of the appropriate base element to the object. If the object does not have a `_base` of its own, it walks up the parent objects until it finds one (or returns undefined).

### _clearBase(isRecursive)
Clears the cached base element of the object.

`@argument isRecursive {Boolean}` - Whether to keep clearing the cached bases of the parent objects.