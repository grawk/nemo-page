# Radio Model
The Radio model is an extension of the Element model where data collection is based on the input value of the matching checked radio option as well as handling set operations specifically for radio input elements. The locator for Radio model should match to all radio input fields that you want to cover. Unlike most Element model types, `locator` and `type` are required for Radio model.

`_model` - "radio"

Extends - [Element Model](element.md)

## Fields

### options
An [Array](array.md) model which represents all of the radio inputs.

## Methods

### option(data)
**Auto-Retry Enabled**
Gets the specified radio input by either index or value.

`@argument data {String/Number}` - If `data` is a String, gets the radio input with the value of `data`. If `data` is a Number, gets the radio input at the index of `data`.
`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - The promise from setting the value of the select.

### setValue(data)
**Auto-Retry Enabled**
Checks the given radio option.

`@argument data {String/Number}` - If `data` is a String, checks the radio input with the value of `data`. If `data` is a Number, checks the radio option at the index of `data`.
`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - The promise from setting the value of the select.