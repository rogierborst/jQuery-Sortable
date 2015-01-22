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

            this.setClasses(columnIndex, self.currentSortingDirection);

            $.each($rows, function(index, row){
                self.$table.append(row);
            });

            this.config.onAfterSort.call(this, columnIndex);
        },

        toggleSortingDirection: function(){
            this.currentSortingDirection = (this.currentSortingDirection === 'asc') ? 'desc' : 'asc';
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

}));


