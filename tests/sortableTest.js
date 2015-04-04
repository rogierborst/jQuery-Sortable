/* global beforeEach, afterEach, $ */
describe('Sortable jQuery', function(){

    /*
     * ON INITIALIZATION
     */
    describe('On initialization', function(){

        var $table;

        beforeEach(function(){
            loadFixtures('simpleTable.html');
            $table = $('#simpleTable');
        });

        it('should be chainable', function(){
            $table.sortable().addClass('classified');
            expect($table).toHaveClass('classified');
        });

        it('should contain 4 rows of data', function(){
            var $rows = $table.find('tbody tr');
            expect($rows).toHaveLength(4);
        });

        it('should order the table at startup by default', function(){
            $table.sortable();

            expect(valuesForColumn($table, 0)).toEqual(['bravo', 'foxtrot', 'uniform', 'zulu']);
            expect(valuesForColumn($table, 1)).toEqual(['2', '4', '1', '3']);
        });

        it('should not order the table if told not to do so at start', function(){
            $table.sortable({
                sortAtStart: false
            });

            expect(valuesForColumn($table, 0)).toEqual(['foxtrot', 'zulu', 'uniform', 'bravo']);
            expect(valuesForColumn($table, 1)).toEqual(['4', '3', '1', '2']);
        });

        it('should sort on column specified in options', function(){
            $table.sortable({
                initialSortColumn: 1,
                initialSortOrder: 'desc'
            });

            expect(valuesForColumn($table, 1)).toEqual(['4', '3', '2', '1']);
        });

        it('should apply odd classes on odd rows if set so in options', function(){
            $table.sortable({
                classes: {
                    oddRows: 'is-odd'
                }
            });

            expect($('tbody tr:even', $table)).toHaveClass('is-odd');
            expect($('tbody tr:odd', $table)).not.toHaveClass('is-odd');
        });

        it('should apply even classes on even rows if set so in options', function(){
            $table.sortable({
                classes: {
                    evenRows: 'is-even'
                }
            });

            expect($('tbody tr:odd', $table)).toHaveClass('is-even');
            expect($('tbody tr:even', $table)).not.toHaveClass('is-even');
        })
    });

    /*
     * AFTER INITIALIZATION
     */
    describe('After initialization', function(){
        var $table;

        beforeEach(function(){
            loadFixtures('simpleTable.html');
            $table = $('#simpleTable');
        });

        it('should sort on column when th is clicked', function(){
            $table.sortable({
                sortAtStart: false
            });

            $table.find('thead th').eq(0).trigger('click');

            expect(valuesForColumn($table, 0)).toEqual(['bravo', 'foxtrot', 'uniform', 'zulu']);
        });

        it('should not be case sensitive', function(){
            $('td', $table.find('tbody tr')).filter(function(){
                return $(this).text() === 'foxtrot';
            }).text('Foxtrot');

            $table.sortable();

            expect(valuesForColumn($table, 0)).toEqual(['bravo', 'Foxtrot', 'uniform', 'zulu']);
        });

        it('should not sort when th is clicked with data-sortable="false"', function(){
            $('th', $table).eq(1).data('sortable', 'false');
            $table.sortable({
                sortAtStart: false
            });

            $table.find('th').eq(1).trigger('click');

            expect(valuesForColumn($table, 1)).toEqual(['4', '3', '1', '2']);
        });

        it('should sort in reverse order when th is clicked twice', function(){
            $table.sortable();

            $table.find('thead th').eq(1).trigger('click').trigger('click');

            expect(valuesForColumn($table, 1)).toEqual(['4', '3', '2', '1']);
        });

        it('should re-apply odd row classes after sorting', function(){
            $table.sortable({
                classes: {
                    oddRows: 'is-odd'
                }
            });

            $('thead th', $table).eq(1).trigger('click');

            expect($('tbody tr:even', $table)).toHaveClass('is-odd');
            expect($('tbody tr:odd', $table)).not.toHaveClass('is-odd');
        });

        it('should prevent default behavior when th contains a link', function(){
            var event = $.Event('click');
            $table.find('th').eq(0).html('<a href="link">I am a link</a>');
            $table.sortable();

            $table.find('thead th').eq(0).trigger(event);

            expect(event.isDefaultPrevented()).toBeTruthy();
            expect(valuesForColumn($table, 0)).toEqual(['zulu', 'uniform', 'foxtrot', 'bravo']);
        });

        it('should apply default classes to th\'s of sorted columns', function(){
            var expectedClassAscending = 'is-sorted-asc',
                expectedClassDescending = 'is-sorted-desc',
                $th = $table.find('th').eq(0);

            $table.sortable({sortAtStart: false});
            expect($th).not.toHaveClass(expectedClassAscending);
            expect($th).not.toHaveClass(expectedClassDescending);

            $th.trigger('click');

            expect($th).toHaveClass(expectedClassAscending);
            expect($th).not.toHaveClass(expectedClassDescending);

            $th.trigger('click');

            expect($th).toHaveClass(expectedClassDescending);
            expect($th).not.toHaveClass(expectedClassAscending);
        });

        it('should allow users to change the th classes', function(){
            var thClassAsc = 'funky-sort-asc',
                thClassDesc = 'funky-sort-desc',
                $th = $table.find('th').eq(0);

            $table.sortable({
                sortAtStart:true,
                classes: {
                    thSortedAsc: thClassAsc,
                    thSortedDesc: thClassDesc
                }
            });
            expect($th).toHaveClass(thClassAsc);
            expect($th).not.toHaveClass('is-sorted-asc');

            $th.trigger('click');

            expect($th).toHaveClass(thClassDesc);
            expect($th).not.toHaveClass('is-sorted-desc');
        });
    });

    /*
     * DATE COLUMNS
     */
    describe('Date columns', function(){
        var $table;

        beforeEach(function(){
            loadFixtures('datesTable.html');
            $table = $('#datesTable');
        });

        it('should sort by dd-MM-yyyy dates if instructed in the th', function(){
            $table.sortable();

            expect(valuesForColumn($table, 0)).toEqual(['1', '2', '3', '4']);

            $table.find('thead th').eq(1).trigger('click');

            expect(valuesForColumn($table, 0)).toEqual(['3', '1', '2', '4']);
        });

        it('should sort backwards by dd-MM-yyyy dates if th is clicked twice', function(){
            $table.sortable();

            $table.find('thead th').eq(1).trigger('click').trigger('click');

            expect(valuesForColumn($table, 0)).toEqual(['4', '2', '1', '3']);
        });

        it('should sort by MM-dd-yyyy hh:mm:ss if instructed in the th', function(){
            $table.sortable();

            $table.find('thead th').eq(2).trigger('click');

            expect(valuesForColumn($table, 0)).toEqual(['2', '1', '3', '4']);
        });

        it('should attempt to sort by ISO 8601 if no data attr is set on th', function(){
            $table.sortable();

            $table.find('thead th').eq(3).trigger('click');

            expect(valuesForColumn($table, 0)).toEqual(['3', '2', '1', '4']);
        });
    });

    /*
     * CALLBACKS
     */
    describe('Callbacks', function(){
        var $table,
            observer = {callback: function(){}};

        beforeEach(function(){
            loadFixtures('simpleTable.html');
            $table = $('#simpleTable');
        });

        it('should execute callback function before sorting', function(){
            spyOn(observer, 'callback');
            $table.sortable({
                sortAtStart: false,
                onBeforeSort: observer.callback
            });

            $table.find('th').eq(0).trigger('click');

            expect(observer.callback).toHaveBeenCalled();
        });

        it('should execute callback function after sorting', function(){
            spyOn(observer, 'callback');
            $table.sortable({
                sortAtStart: false,
                onAfterSort: observer.callback
            });

            $table.find('th').eq(0).trigger('click');

            expect(observer.callback).toHaveBeenCalled();
        });
    });
});

function valuesForColumn($table, colIndex){
    var values = [];
    $table.find('tbody tr').each(function(){
        values.push($(this).children('td').eq(colIndex).text());
    });

    return values;
}