# jQuery-Sortable
A simple jQuery plugin that makes tables sortable.

## Installation
Simply include jQuery and `sortable.js` in your HTML page. jQuery-Sortable also exposes itself as an AMD module, so you can easily require it with requireJS or commonJS.

## Usage
The simplest way to make your tables sortable is to use the following code:
```javascript
$('table').sortable();
```
In this case, your table will be sorted alphabetically, using the values from the first column.
If your table contains a `thead`, then clicking any of the table header cells will order on that column. Clicking the same header twice will reverse the order (descending).

You can change the default behaviour by passing an options object. For example:
```javascript
$('table').sortable({
  initialSortColumn: 1,
  initialSortOrder: 'desc'
});
```
which will sort your table in descending order using the second column.

## Configuration
### Basics
The following options can be used to setup jQuery Sortable:

Option | Description | Default
-------|-------------|---------
**sortAtStart** *(boolean)* | Set to `false` if you don't want to sort the table at page load | *true*
**initialSortColumn** *(integer)* | If `sortAtStart` is set to `true`, this is where you can define what column the table is sorted on. This value is zero-based, so to sort on the second column, `initialSortColumn` should be set to `1`. | *0*
**initialSortOrder** *(string)* | The direction of the sort at page load. (`sortAtStart` should be `true` for this to have any effect). Can be either `'asc'` for ascending or `'desc'` for descending order. | *'asc'*
**classes** *(object)* | jQuery Sortable automatically sets classes on `th`'s that the table is sorted on. If you want to change those class names, this is where to do it. *[Read more below](class config)*

### <a name="class config"></a>Classes
jQuery Sortable will assign classes to a `th` when the table is sorted on its column. You can change those class names by passing the following object to the `classes` property of your `options` object.

Option | Description | Default
-------|-------------|--------
**thSortedAsc** *(string)* | The class assigned to the `th` when the table is sorted on that column in *ascending* order. | *'is-sorted-asc'*
**thSortedDesc** *(string)* | The class assigned to the `th` when the table is sorted on that column in * descending* order. | *'is-sorted-desc'*

### Callbacks
*More information will follow shortly*

### Configuration Examples
```javascript
$('table').sortable({
  sortAtStart: true,           // true by default, so not really necessary
  initialSortColumn: 2,        // will sort on the third column at page load
  initialSortOrder: 'desc',    // will sort in descending order at page load
  
  classes: {
    thSortedAsc: 'sorting-up', // assigns 'sorting-up' class to th when appropriate
    thSortedDesc: 'sorting-down'
  }
});
```

## Extras
### Excluding columns
If for whatever reason you wish to exclude a column from sorting (clicking the `th` shouldn't do any sorting), you can do so with the `data-sortable` attribute.
On the `th` set the `data-sortable` attribute to false, like so:
```html
<thead>
<tr>
  //...
  <th data-sortable="false">Non sorting column</th>
```
and clicking that `th` will not have any effect anymore.

### Using links inside table headers
Let's say you're a good boy and want your tables to be sortable even when the client has JavaScript disabled. In that case, you're probably using links inside your header cells that point to some server-side sorting functionality.

jQuery Sortable encourages you and throws you a bone. When the client *does* have JavaScript enabled, jQuery Sortable will ignore those links altogether (by calling `e.preventDefault()` inside the click event handler).
