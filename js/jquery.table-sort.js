(function ($) {
    "use strict";
    $.fn.sort_table = function(options) {
        var cur_table = this;
        var thead = null;
        if(options.action == "init") {
            init_head_table(options);
            cur_table.parent().append("<div class='copy_sort_table' style='display:none;'></div>");
            cur_table.parent().find("div.copy_sort_table").append(cur_table.clone());
        } else if(options.action == "update_click") {
            if(cur_table.parent().hasClass("copy_sort_table") == false) {
                thead = cur_table.find("thead");
                thead.find("tr th").each(function() {
                    if($(this).hasClass("no-sort") == false) {
                        $(this).addClass("sort");
                        $(this).css("white-space", "nowrap");
                        init_header_click($(this));
                    } else {
                        $(this).css("white-space", "nowrap");
                    }
                });
            }
        }
        function init_head_table(options) {
            thead = cur_table.find("thead");
            thead.find("tr th").each(function() {
                if($(this).hasClass("no-sort") == false) {
                    $(this).addClass("sort");
                    init_set_header_status($(this), "sortable");
                    init_header_click($(this));
                }
            });
        }
        function init_header_click(head_th) {
            var handler = function() {
                //change header status
                var sort_status = head_th.attr("sort_status");
                head_th.parent().find("th").each(function() {
                    if($(this).hasClass("no-sort") == false) {
                        set_header_status($(this), "sortable");
                    }
                });
                var cur_status = 'sortable'; 
                if(sort_status == 'sortable') {
                    set_header_status(head_th, 'up');
                    cur_status = 'up';
                } else if(sort_status == 'up') {
                    set_header_status(head_th, 'down');
                    cur_status = 'down';
                } else if(sort_status == 'down') {
                    set_header_status(head_th, 'sortable');
                    cur_status = 'sortable';
                }
                var col_index = 0; 
                var need_sort_col_index = 0;
                head_th.parent().find("th").each(function() {
                    if($(this).attr("sort_status") == cur_status) {
                        need_sort_col_index = col_index;
                        return false; // break $.each
                    } else {
                        col_index++;
                    }
                });
                var rows = cur_table.parent().find("div.copy_sort_table table tbody tr");
                var copy_table = cur_table.parent().find("div.copy_sort_table table");
                var need_sort_col_vals = [];
                var rows_map = {};
                var isAllNum = true;
                for(var i = 0; i < rows.length; i++) {
                    var cur_row = copy_table.find("tbody tr:eq(" + i + ")");
                    var need_sort_col_td = cur_row.children("td:eq(" + need_sort_col_index + ")");
                    var key = need_sort_col_td.html();
                    if($.isNumeric(key)) {
                        var trailing_i = (i + 1) / (rows.length + 1);
                        trailing_i = trailing_i.toString();
                        trailing_i = trailing_i.substr(2);
                        if(key.indexOf('.') == -1) {
                            key = key + '.' + trailing_i;
                        } else {
                            key = key + trailing_i; 
                        }
                    } else {
                        key = key + ":" + i;
                        isAllNum = false;
                    }
                    need_sort_col_vals.push(key);
                    rows_map[key] = cur_row.clone();
                }
                if(cur_status != 'sortable') {
                    if(isAllNum) {
                       need_sort_col_vals.sort(function(a, b){
                           return a - b;
                       }); 
                    } else {
                        need_sort_col_vals.sort();
                    }
                    if(cur_status == 'up') {
                        need_sort_col_vals.reverse();
                    }
                    var cur_tbody = cur_table.find("tbody");
                    cur_tbody.html("");
                    for(var i = 0; i < need_sort_col_vals.length; i++) {
                        cur_tbody.append(rows_map[need_sort_col_vals[i]]); 
                    }
                } else {
                    var cur_tbody = cur_table.find("tbody");
                    cur_tbody.html("");
                    for(var i = 0; i < need_sort_col_vals.length; i++) {
                        cur_tbody.append(rows_map[need_sort_col_vals[i]]); 
                    }
                }
                init_select_tr_event();
            };
            head_th.unbind("click");
            head_th.bind("click", handler);
        }
        function init_select_tr_event() {
            cur_table.find("tbody>tr").click(function(event) {
                var table_tr_contextual_classes = ['active', 'success', 'info', 'warning', 'danger'];
                var selected=$(this).hasClass("info");
                var cur_tr = $(this);
                if(selected){
                    $.each(table_tr_contextual_classes, function(index, value) {
                        if(cur_tr.hasClass(value + '_old')) {
                            cur_tr.removeClass(value + '_old');
                            cur_tr.addClass(value);
                        }
                    });
                    $(this).removeClass("info");
                } else {
                    $.each(table_tr_contextual_classes, function(index, value) {
                        if(cur_tr.hasClass(value)) {
                            cur_tr.removeClass(value);
                            cur_tr.addClass(value + '_old');
                        }
                    });
                    $(this).addClass("info");
                }
            });
        }
        function set_header_status(head_th, type) {
            head_th.attr("sort_status", type);
            var span = head_th.find("span.glyphicon:first");
            if(span != null) {
                span.remove();
            }
            if(type == 'sortable') {
                head_th.append('<span class="glyphicon glyphicon-sort"></span>');
            } else if(type == 'up') {
                head_th.append('<span class="glyphicon glyphicon-chevron-up"></span>');
            } else if(type == 'down') {
                head_th.append('<span class="glyphicon glyphicon-chevron-down"></span>');
            }
        }
        function init_set_header_status(head_th, type) {
            var val = head_th.html();
            head_th.attr("sort_status", type);
            var span = head_th.find("span.glyphicon:first");
            if(span != null) {
                span.remove();
            }
            if(type == 'sortable') {
                head_th.append('&nbsp;&nbsp;<span class="glyphicon glyphicon-sort"></span>');
            } else if(type == 'up') {
                head_th.append('&nbsp;&nbsp;<span class="glyphicon glyphicon-chevron-up"></span>');
            } else if(type == 'down') {
                head_th.append('&nbsp;&nbsp;<span class="glyphicon glyphicon-chevron-down"></span>');
            }
        }
        return this;
    };
    //Example 
    //$("table.sort_table").addTableFilter({
    //  "filter" : "input#search_input"
    //});
    //thanks hail2u
    //https://github.com/hail2u/jquery.table-filter
    //
    $.fn.addTableFilter = function (options) {
        var o = $.extend({}, $.fn.addTableFilter.defaults, options);
        var input = $(options.filter);
        input.on('click', function () {
            $(this).keyup();
        });
        var cur_table = this;
        // Bind filtering function
        input.delayBind("keyup", function (e) {
            var words = $(this).val().toLowerCase().split(" ");
            cur_table.find("tbody tr").each(function () {
                var s = $(this).html().toLowerCase().replace(/<.+?>/g, "").replace(/\s+/g, " "),
                state = 0;
                $.each(words, function () {
                    if (s.indexOf(this) < 0) {
                        state = 1;
                        return false; // break $.each()
                    }
                });

                if (state) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        }, 300);
        return this;
    };
    $.fn.delayBind = function (type, data, func, timeout) {
        if ($.isFunction(data)) {
            timeout = func;
            func    = data;
            data    = undefined;
        }

        var self  = this,
        wait    = null,
        handler = function (e) {
            clearTimeout(wait);
            wait = setTimeout(function () {
                func.apply(self, [$.extend({}, e)]);
            }, timeout);
        };

        return this.bind(type, data, handler);
    };
}( jQuery ));
