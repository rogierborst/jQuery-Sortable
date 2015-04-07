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
**emptyLast** *(boolean)* | Should empty cells be treated as last in alphabet? (i.e. moved to the bottom if sorting in ascending order) | *true*
**treatAsEmpty** *(string)* | If a cell contains the specified string, treat is though it was empty. | *''*
**thSortedAscClass** *(string)* | The class assigned to the `th` when the table is sorted on that column in *ascending* order. | *'is-sorted-asc'*
**thSortedDescClass** *(string)* | The class assigned to the `th` when the table is sorted on that column in *descending* order. | *'is-sorted-desc'*
**oddRowClass** *(string)* | If you use classes on your table rows for zebra-striping (rather than, for example, the `nth-child(odd)` css selector), this is where you can set the class name you want applied to your *odd* rows. This class will be applied at initialization and will be re-applied after each sort. | *''*
**evenRowClass** *(string)* | Likewise, if you wish to set classes on your *even* rows, this is where you can set that class. Typically you'd apply classes to *either* odd *or* even rows, and let the default table styling take care of the other rows. | *''*

### Callbacks
*More information will follow shortly*

### Configuration Examples
```javascript
$('table').sortable({
  sortAtStart: true,          // true by default, so not really necessary
  initialSortColumn: 2,       // will sort on the third column at page load
  initialSortOrder: 'desc',   // will sort in descending order at page load
  emptyLast: true,            // empty cells will be treated as last in alphabet
  treatAsLast: ' - '          // cells that contain the string ' - ' will be treated as empty cells
  thSortedAscClass: 'sorting-up', // assigns 'sorting-up' class to th when appropriate
  thSortedDescClass: 'sorting-down', // assigns 'sorting-down' class to th when appropriate
  oddRowClass: 'is-odd',      // assigns 'is-odd' class to odd rows in the tbody after each sort
  evenRowClass: 'is-even'     // assign 'is-even' class to even rows in the tbody after each sort
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

### Date & Time
If a column contains dates (or times, or a combination of both), you can specify the date format template that is used on the `th`. Consider the following table:

Game title | Release Date
-----------|-------------
Grand Theft Auto | 11-10-1997
World of Warcraft | 22-11-2004
Battlefield 1942 | 28-06-2002

If you want your users to be able to sort on the second column by date, you can set the `data-sortable-date` attribute on the `th` for that column. As a value, you supply the format template that is used for the dates in the cells, like so:
```html
<th data-sortable-date="dd-MM-yyyy">
```
where `dd` stands for double digit date, `MM` stands for double digit month and `yyyy` stands for full year.
The formatting used here is the [Java SimpleDateFormat](http://docs.oracle.com/javase/6/docs/api/java/text/SimpleDateFormat.html), so be careful when you come from, say, a php background, where minutes are referred to as `ii` instead of `mm`. 

### Using links inside table headers
Let's say you're a good boy and want your tables to be sortable even when the client has JavaScript disabled. In that case, you're probably using links inside your header cells that point to some server-side sorting functionality.

jQuery Sortable encourages you and throws you a bone. When the client *does* have JavaScript enabled, jQuery Sortable will ignore those links altogether (by calling `e.preventDefault()` inside the click event handler).
