/*!
 * Sortable jQuery plugin v1.1.2
 * https://github.com/rogierborst/jQuery-Sortable
 *
 * Copyright 2015 Rogier Borst
 * Released under the MIT license
 */

/* global define, require, jQuery */
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
        emptyLast: true,
        oddRowClass: '',
        evenRowClass: '',
        thSortedAscClass: 'is-sorted-asc',
        thSortedDescClass: 'is-sorted-desc',
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

            if ( this.config.oddRowClass || this.config.evenRowClass ) {
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

            if ( $('th', this.$table).eq(columnIndex).attr('data-sortable-date') ) {
                this._sortByDate($rows, columnIndex);
            } else {
                this._sortAlphaNum($rows, columnIndex);
            }

            this.setHeaderClasses(columnIndex, self.currentSortingDirection);

            $.each($rows, function(index, row){
                self.$table.append(row);
            });

            this.setRowClasses();

            this.config.onAfterSort.call(this, columnIndex);
        },

        _sortAlphaNum: function($rows, columnIndex) {
            var self = this;

            $rows.sort(function(a, b){
                var keyA = $.trim($('td', a).eq([columnIndex]).text());
                var keyB = $.trim($('td', b).eq([columnIndex]).text());

                if ( (keyA === '' || keyB === '') && self.config.emptyLast ) {
                    return self._sortEmptyValue(keyA, keyB);
                }

                if ( self.currentSortingDirection === 'desc') {
                    return (keyB).localeCompare(keyA);
                }

                return (keyA).localeCompare(keyB);
            });
        },

        _sortByDate: function($rows, columnIndex) {
            var self = this,
                template = $('th', self.$table).eq(columnIndex).attr('data-sortable-date');

            $rows.sort(function(a, b){
                var keyA = self._convertToDate($('td', a).eq([columnIndex]).text(), template);
                var keyB = self._convertToDate($('td', b).eq([columnIndex]).text(), template);

                if ( (keyA === '' || keyB === '') && self.config.emptyLast ) {
                    return self._sortEmptyValue(keyA, keyB);
                }

                if ( self.currentSortingDirection === 'desc') {
                    return keyA < keyB ? 1 : -1;
                } else {
                    return keyA > keyB ? 1 : -1;
                }
            });
        },

        _sortEmptyValue: function(keyA, keyB) {
            if ( this.currentSortingDirection === 'desc' ) {
                return keyA > keyB ? 1: -1;
            }

            return keyA > keyB ? -1: 1;
        },

        _convertToDate: function(dateString, template) {
            if ( dateString === '' ) {
                return dateString;
            }

            if ( typeof template === 'undefined' ) {
                return new Date(dateString);
            }

            return this._getDateFromFormat(dateString, template);
        },

        toggleSortingDirection: function(){
            this.currentSortingDirection = (this.currentSortingDirection === 'asc') ? 'desc' : 'asc';
        },

        setHeaderClasses: function(columnIndex, direction){
            var thClassName = (direction === 'asc') ? this.config.thSortedAscClass : this.config.thSortedDescClass;

            $('.' + this.config.thSortedAscClass + ', .' + this.config.thSortedDescClass).removeClass();

            $('th', this.$table).eq(columnIndex).addClass(thClassName);
        },

        setRowClasses: function(){
            var oddRowClass = this.config.oddRowClass,
                evenRowClass = this.config.evenRowClass;

            $('tbody tr', this.$table).removeClass(oddRowClass + ' ' + evenRowClass);

            if ( oddRowClass ) {
                $('tbody tr:visible:even', this.$table).addClass(oddRowClass);
            }

            if ( evenRowClass ) {
                $('tbody tr:visible:odd', this.$table).addClass(evenRowClass);
            }
        },

        // The format template should follow the SimpleDateFormat
        // see: http://docs.oracle.com/javase/6/docs/api/java/text/SimpleDateFormat.html
        // This function came from: http://www.mattkruse.com/javascript/date/source.html
        _getDateFromFormat: function(val, format) {
            val=val+"";
            format=format+"";
            var i_val=0;
            var i_format=0;
            var c="";
            var token="";
            var x,y;
            var now=new Date();
            var year=now.getYear();
            var month=now.getMonth()+1;
            var date=1;
            var hh=now.getHours();
            var mm=now.getMinutes();
            var ss=now.getSeconds();
            var ampm="";

            while (i_format < format.length) {
                // Get next token from format string
                c=format.charAt(i_format);
                token="";
                while ((format.charAt(i_format)===c) && (i_format < format.length)) {
                    token += format.charAt(i_format++);
                }
                // Extract contents of value based on format token
                if (token==="yyyy" || token==="yy" || token==="y") {
                    if (token==="yyyy") { x=4;y=4; }
                    if (token==="yy")   { x=2;y=2; }
                    if (token==="y")    { x=2;y=4; }
                    year=_getInt(val,i_val,x,y);
                    if (year===null) { return 0; }
                    i_val += year.length;
                    if (year.length===2) {
                        if (year > 70) { year=1900+(year-0); }
                        else { year=2000+(year-0); }
                    }
                }
                else if (token==="MMM"||token==="NNN"){
                    month=0;
                    for (var i=0; i<MONTH_NAMES.length; i++) {
                        var month_name=MONTH_NAMES[i];
                        if (val.substring(i_val,i_val+month_name.length).toLowerCase()===month_name.toLowerCase()) {
                            if (token==="MMM"||(token==="NNN"&&i>11)) {
                                month=i+1;
                                if (month>12) { month -= 12; }
                                i_val += month_name.length;
                                break;
                            }
                        }
                    }
                    if ((month < 1)||(month>12)){return 0;}
                }
                else if (token==="EE"||token==="E"){
                    for (var j=0; j<DAY_NAMES.length; j++) {
                        var day_name=DAY_NAMES[j];
                        if (val.substring(i_val,i_val+day_name.length).toLowerCase()===day_name.toLowerCase()) {
                            i_val += day_name.length;
                            break;
                        }
                    }
                }
                else if (token==="MM"||token==="M") {
                    month=_getInt(val,i_val,token.length,2);
                    if(month===null||(month<1)||(month>12)){return 0;}
                    i_val+=month.length;}
                else if (token==="dd"||token==="d") {
                    date=_getInt(val,i_val,token.length,2);
                    if(date===null||(date<1)||(date>31)){return 0;}
                    i_val+=date.length;}
                else if (token==="hh"||token==="h") {
                    hh=_getInt(val,i_val,token.length,2);
                    if(hh===null||(hh<1)||(hh>12)){return 0;}
                    i_val+=hh.length;}
                else if (token==="HH"||token==="H") {
                    hh=_getInt(val,i_val,token.length,2);
                    if(hh===null||(hh<0)||(hh>23)){return 0;}
                    i_val+=hh.length;}
                else if (token==="KK"||token==="K") {
                    hh=_getInt(val,i_val,token.length,2);
                    if(hh===null||(hh<0)||(hh>11)){return 0;}
                    i_val+=hh.length;}
                else if (token==="kk"||token==="k") {
                    hh=_getInt(val,i_val,token.length,2);
                    if(hh===null||(hh<1)||(hh>24)){return 0;}
                    i_val+=hh.length;hh--;}
                else if (token==="mm"||token==="m") {
                    mm=_getInt(val,i_val,token.length,2);
                    if(mm===null||(mm<0)||(mm>59)){return 0;}
                    i_val+=mm.length;}
                else if (token==="ss"||token==="s") {
                    ss=_getInt(val,i_val,token.length,2);
                    if(ss===null||(ss<0)||(ss>59)){return 0;}
                    i_val+=ss.length;}
                else if (token==="a") {
                    if (val.substring(i_val,i_val+2).toLowerCase()==="am") {ampm="AM";}
                    else if (val.substring(i_val,i_val+2).toLowerCase()==="pm") {ampm="PM";}
                    else {return 0;}
                    i_val+=2;}
                else {
                    if (val.substring(i_val,i_val+token.length)!==token) {return 0;}
                    else {i_val+=token.length;}
                }
            }
            // If there are any trailing characters left in the value, it doesn't match
            if (i_val !== val.length) { return 0; }
            // Is date valid for month?
            if (month===2) {
                // Check for leap year
                if ( ( (year%4===0)&&(year%100 !== 0) ) || (year%400===0) ) { // leap year
                    if (date > 29){ return 0; }
                }
                else { if (date > 28) { return 0; } }
            }
            if ((month===4)||(month===6)||(month===9)||(month===11)) {
                if (date > 30) { return 0; }
            }
            // Correct hours value
            if (hh<12 && ampm==="PM") { hh=hh-0+12; }
            else if (hh>11 && ampm==="AM") { hh-=12; }
            var newdate=new Date(year,month-1,date,hh,mm,ss);
            return newdate.getTime();
        }

    };

    $.fn.sortable = function(options){
        return this.each(function(){
            new Sortable($(this), options);
            return this;
        });
    };

    // Helper functions
    var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
    var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');

    function _isInteger(val) {
        var digits="1234567890";
        for (var i=0; i < val.length; i++) {
            if (digits.indexOf(val.charAt(i))===-1) { return false; }
        }
        return true;
    }
    function _getInt(str,i,minlength,maxlength) {
        for (var x=maxlength; x>=minlength; x--) {
            var token=str.substring(i,i+x);
            if (token.length < minlength) { return null; }
            if (_isInteger(token)) { return token; }
        }
        return null;
    }

}));


