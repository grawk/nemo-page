# Object Model
This model is mostly for organization of commonly located elements. Often, Object models will have a `_base` which all the nested elements fall within. All object models will have fields on them for each nested locator. For example if your Object model `obj` contains `loc1` as a nested locator, you can do `obj.loc1` and perform operations from that specific to loc1's model.

`_model` - "object"

Extends - [Base Model](base.md)

## Additional locator fields
The Object model is not a standard locator. It does not contain the `locator` or `type` fields. Instead, It will have other locators nested inside of it.

```javascript
    {
        "_model": "object",

        "loc1": {
            "locator": "...",
            "type": "css"
        },
        "loc2": {
            "locator": "...",
            "type": "css"
        }
    }
```

## Methods

### collect(baseOverride)
Collects the values of all nested objects. If any of the objects yield an empty string or undefined, they will be ignored.

`@argument baseOverride {WebElement}` - An optional override for the base element it uses for collection.

`@returns {Promise}` - Resolves to an object containing the collected data. The keys of the object correspond to the keys of the nested locators.

### setValue(data)
Sets the data for any specified nested objects which also have a setValue method. The behavior on Object model just passes the right data to the other nested objects within. Actual handling of the data depends on what `_model` those nested objects are.

`@argument data {Object}` - The data to be set.