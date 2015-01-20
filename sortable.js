(function ($, window, document, undefined){
    'use strict';

    var defaults = {
        sortAtStart: true,
        initialSortColumn: 0,
        initialSortOrder: 'asc',
        classes: {
            thSortedAsc: 'is-sorted-asc',
            thSortedDesc: 'is-sorted-desc'
        }
    };

    function Sortable($table, options){
        var self = this;
        self.config = $.extend({}, defaults, options);
        self.$table = $table;
        self.sortingColumnIndex = self.config.initialSortColumn;
        self.sortingDirection = self.config.initialSortOrder;

        $table.on('click', 'th', function(){
            var clickedColumnIndex = $(this).index();
            self.sort(clickedColumnIndex);
            self.sortingColumnIndex = clickedColumnIndex;
        });

        self.init();
    }

    Sortable.prototype = {

        init: function() {
            if (this.config.sortAtStart) {
                this.changeSortingDirection();
                this.sort(this.sortingColumnIndex, this.initialSortOrder);
            }
        },

        sort: function(columnIndex) {
            var self = this;
            var $rows = $('tbody tr', this.$table);

            if ( columnIndex === self.sortingColumnIndex ){
                self.changeSortingDirection();
            } else {
                self.sortingDirection = 'asc';
            }

            $rows.sort(function(a, b){
                var keyA = $('td', a).eq([columnIndex]).text();
                var keyB = $('td', b).eq([columnIndex]).text();

                if ( self.sortingDirection === 'desc') {
                    return keyB.localeCompare(keyA);
                }
                return keyA.localeCompare(keyB);
            });

            this.setClasses(columnIndex, self.sortingDirection);

            $.each($rows, function(index, row){
                self.$table.append(row);
            });
        },

        changeSortingDirection: function(){
            this.sortingDirection = (this.sortingDirection === 'asc') ? 'desc' : 'asc';
        },

        setClasses: function(columnIndex, direction){
            var className = (direction === 'asc') ? this.config.classes.thSortedAsc : this.config.classes.thSortedDesc;
            $('.' + this.config.classes.thSortedAsc + ', .' + this.config.classes.thSortedDesc).removeClass();
            this.$table.find('th:eq(' + columnIndex + ')').addClass(className);
        }

    };

    $.fn.sortable = function(options){
        return this.each(function(){
            new Sortable($(this), options);
            return this;
        });
    };

})(jQuery, window, document);

