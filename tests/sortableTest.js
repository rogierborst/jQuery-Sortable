/* global beforeEach, afterEach, $ */
describe('Sortable jQuery', function(){

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

            var firstColValues = valuesForColumn($table, 0),
                secondColValues = valuesForColumn($table, 1);

            expect(firstColValues).toEqual(['bravo', 'foxtrot', 'uniform', 'zulu']);
            expect(secondColValues).toEqual(['2', '4', '1', '3']);
        });

        it('should not order the table if told not to do so at start', function(){
            $table.sortable({
                sortAtStart: false
            });

            var firstColumnValues = valuesForColumn($table, 0),
                secondColumnValues = valuesForColumn($table, 1);

            expect(firstColumnValues).toEqual(['foxtrot', 'zulu', 'uniform', 'bravo']);
            expect(secondColumnValues).toEqual(['4', '3', '1', '2']);
        });

        it('should sort on column specified in options', function(){
            $table.sortable({
                initialSortColumn: 1,
                initialSortOrder: 'desc'
            });

            var secondColumnValues = valuesForColumn($table, 1);
            expect(secondColumnValues).toEqual(['4', '3', '2', '1']);
        });
    });

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

            var firstColumnValues = valuesForColumn($table, 0);
            expect(firstColumnValues).toEqual(['bravo', 'foxtrot', 'uniform', 'zulu']);
        });

        it('should sort in reverse order when th is clicked twice', function(){
            $table.sortable();

            $table.find('thead th').eq(1).trigger('click').trigger('click');

            var secondColumnValues = valuesForColumn($table, 1);
            expect(secondColumnValues).toEqual(['4', '3', '2', '1']);
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