(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($){

    var defaults = {
        sortAtStart: true,
        initialSortColumn: 0,
        initialSortOrder: 'asc',
        classes: {
            oddRows: '',
            evenRows: '',
            thSortedAsc: 'is-sorted-asc',
            thSortedDesc: 'is-sorted-desc'
        },
        onBeforeSort: function(){},
        onAfterSort: function(){}
    };

    function Sortable($table, options){
        var self = this;
        self.config = $.extend({}, defaults, options);
        self.$table = $table;
        self.currentSortingColumnIndex = self.config.initialSortColumn;
        self.currentSortingDirection = self.config.initialSortOrder;

        $table.on('click', 'th', function(e){
            e.preventDefault();

            if ( $(this).data('sortable') !== 'undefined' && $(this).data('sortable') === 'false' ) {
                return false;
            }

            var clickedColumnIndex = $(this).index();
            self.sort(clickedColumnIndex);
            self.currentSortingColumnIndex = clickedColumnIndex;
        });

        self.init();
    }

    Sortable.prototype = {

        init: function() {
            if ( this.config.sortAtStart ) {
                this.sort(this.currentSortingColumnIndex, this.config.initialSortOrder);
            } else {
                this.currentSortingColumnIndex = -1;
            }

            if ( this.config.classes.oddRows || this.config.classes.evenRows ) {
                this.setRowClasses();
            }
        },

        sort: function(columnIndex, direction) {
            var self = this,
                $rows = $('tbody tr', this.$table);

            this.config.onBeforeSort.call(this, columnIndex);

            if ( typeof direction !== 'undefined' ){
                self.currentSortingDirection = direction;
            } else if ( columnIndex === self.currentSortingColumnIndex ){
                self.toggleSortingDirection();
            } else {
                self.currentSortingDirection = 'asc';
            }

            $rows.sort(function(a, b){
                var keyA = $('td', a).eq([columnIndex]).text();
                var keyB = $('td', b).eq([columnIndex]).text();

                if ( self.currentSortingDirection === 'desc') {
                    return keyB.localeCompare(keyA);
                }
                return keyA.localeCompare(keyB);
            });

            this.setHeaderClasses(columnIndex, self.currentSortingDirection);

            $.each($rows, function(index, row){
                self.$table.append(row);
            });

            this.setRowClasses();

            this.config.onAfterSort.call(this, columnIndex);
        },

        toggleSortingDirection: function(){
            this.currentSortingDirection = (this.currentSortingDirection === 'asc') ? 'desc' : 'asc';
        },

        setHeaderClasses: function(columnIndex, direction){
            var thClassName = (direction === 'asc') ? this.config.classes.thSortedAsc : this.config.classes.thSortedDesc;

            $('.' + this.config.classes.thSortedAsc + ', .' + this.config.classes.thSortedDesc).removeClass();

            $('th', this.$table).eq(columnIndex).addClass(thClassName);
        },

        setRowClasses: function(){
            var oddRowClass = this.config.classes.oddRows,
                evenRowClass = this.config.classes.evenRows;

            $('tbody tr', this.$table).removeClass(oddRowClass + ' ' + evenRowClass);

            if ( oddRowClass ) {
                $('tbody tr:visible:even', this.$table).addClass(oddRowClass);
            }

            if ( evenRowClass ) {
                $('tbody tr:visible:odd', this.$table).addClass(evenRowClass);
            }
        }

    };

    $.fn.sortable = function(options){
        return this.each(function(){
            new Sortable($(this), options);
            return this;
        });
    };

}));


