# Select Model
The Select model is an extension of the Element model where data collection is based on the input value of a select element as well as handling set operations specifically for select elements.

`_model` - "select"

Extends - [Element Model](element.md)

## Fields

### options
An [Array](array.md) model which represents all of the options inside the select.

## Methods

### option(data)
Gets the specified option for the select.

`@argument data {String/Number}` - If `data` is a String, gets the option with the value of `data`. If `data` is a Number, gets the option at the index of `data`.
`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - The promise from setting the value of the select.

### setValue(data)
**Auto-Retry Enabled**
Sets the option for the select.

`@argument data {String/Number}` - If `data` is a String, sets the option with the value of `data`. If `data` is a Number, sets the option at the index of `data`.
`@argument baseOverride {WebElement}` - An optional override for the base element it uses to retrieve the element.

`@returns {Promise}` - The promise from setting the value of the select.