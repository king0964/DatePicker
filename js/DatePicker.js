(function() {
    var monthData, //月份数据
        wrapper; //日历外包元素
    // 构造函数
    var DatePicker = function(inputClassName) {
        var _this_ = this;
        // 初始化功能
        _this_.render();

        var inputClickEvent = document.querySelector(inputClassName);
        var isOpen = false; //默认日历表隐藏
        // 点击input展开和隐藏日历表
        EventUtil.addHandler(inputClickEvent, 'click', function() {
            if (isOpen) {
                wrapper.className = 'ui-datepicker-wrapper';
                isOpen = false;
            } else {
                wrapper.className = 'ui-datepicker-wrapper ui-datepicker-wrapper-show';
                var left = inputClickEvent.offsetLeft;
                var top = inputClickEvent.offsetTop;
                var height = inputClickEvent.offsetHeight;
                wrapper.style.left = left + 'px';
                wrapper.style.top = top + height + 2 + 'px'; //加多2px，为了显示好看
                isOpen = true;
            }
        }, false); //false表示冒泡阶段
        // 切换月份和选择日期
        EventUtil.addHandler(wrapper, 'click', function(e) {
            var event = EventUtil.getEvent(e);
            var target = EventUtil.getTarget(event);
            if (target.className.indexOf('ui-datepicker-prev-btn') > -1) {
                // 上一月
                // console.log(_this_);
                _this_.render('prev');
            } else if (target.className.indexOf('ui-datepicker-next-btn') > -1) {
                // 下一月
                _this_.render('next');
            } else if (target.tagName.toLowerCase() === 'td') {
                // 点击日期
                // console.log(target.getAttribute('data-date'));
                var date = new Date(monthData.year, monthData.month - 1, target.getAttribute('data-date'));
                inputClickEvent.value = _this_.formate(date);
                wrapper.className = 'ui-datepicker-wrapper';
                isOpen = false;
            }
        }, false);
    };
    // 方法
    DatePicker.prototype = {
        // 获取月份数据
        getMonthData: function(year, month) {
            var ret = []; //用于储存当前月份、日期（会小于1和大于31）和真实日期
            if (!year || !month) {
                var today = new Date();
                year = today.getFullYear();
                month = today.getMonth() + 1; //js获取的月份会自动少1（比如9月份显示8）
            }
            var firstDay = new Date(year, month - 1, 1); //获取该月份第一天
            var firstDayWeekDay = firstDay.getDay(); //获取月份第一天是星期几
            if (firstDayWeekDay === 0) { //周日显示0，为了计算，换算为7
                firstDayWeekDay = 7;
            }
            year = firstDay.getFullYear();
            month = firstDay.getMonth() + 1;
            var lastDayOfLastMonth = new Date(year, month - 1, 0); //获取上个月最后一天
            var lastDateOfLastMonth = lastDayOfLastMonth.getDate(); //获取上个月最后一天的日期
            var preMonthDayCount = firstDayWeekDay - 1; //计算上个月显示几天（比如该月份第一天是周二，上个月就显示1天（2-1））
            var lastDay = new Date(year, month, 0); //获取该月份的最后一天
            var lastDate = lastDay.getDate(); //获取该月份最后一天的日期

            for (var i = 0; i < 7 * 6; i++) {
                var date = i + 1 - preMonthDayCount; //为了让月份第一天显示日期1
                var showDate = date; //showDate用于计算跨界问题
                var thisMonth = month;
                if (date <= 0) {
                    // 上一月
                    thisMonth = month - 1; //获取上个月的月份
                    showDate = lastDateOfLastMonth + date; //修正上个月的日期（减去相应天数）
                } else if (date > lastDate) {
                    // 下一月
                    thisMonth = month + 1; //获取下个月的月份
                    showDate = date - lastDate; //修正下个月的日期
                }
                if (thisMonth === 0) {
                    thisMonth = 12; //上一年12月份
                }
                if (thisMonth === 13) {
                    thisMonth = 1; //下一年的1月份
                }
                // console.log(thisMonth);
                ret.push({
                    month: thisMonth,
                    date: date,
                    showDate: showDate
                });
            }
            return {
                year: year, //显示当前年份
                month: month, //显示当前月份
                days: ret
            };
        },
        // 创建日历样式
        buildUi: function(year, month) {
            monthData = this.getMonthData(year, month);
            var html = '<div class="ui-datepicker-header">' +
                '<a href="#" class="ui-datepicker-btn ui-datepicker-prev-btn">&lt;</a>' +
                '<a href="#" class="ui-datepicker-btn ui-datepicker-next-btn">&gt;</a>' +
                '<span class="ui-datepicker-curr-month">' + monthData.year + '-' + this.padding(monthData.month) + '</span>' +
                '</div>' +
                '<div class="ui-datepicker-body">' +
                '<table>' +
                '<thead>' +
                '<th>一</th>' +
                '<th>二</th>' +
                '<th>三</th>' +
                '<th>四</th>' +
                '<th>五</th>' +
                '<th>六</th>' +
                '<th>日</th>' +
                '</thead>' +
                '<tbody>';
            // 循环一个月数据
            for (var i = 0; i < monthData.days.length; i++) {
                date = monthData.days[i];
                if (i % 7 === 0) { //一周第一天
                    html += '<tr>';
                }
                html += '<td data-date=' + date.date + '>' + date.showDate + '</td>';
                if (i % 7 === 6) { //一周最后一天
                    html += '</tr>';
                }
            }
            html += '</tbody>' +
                '</table>' +
                '</div>';
            return html;
        },
        // 把日历数据渲染到页面上
        render: function(direction) {
            var year, month;
            if (monthData) { //初始化是不在的，所以需要判断
                year = monthData.year;
                month = monthData.month;
            }
            if (direction === 'prev') month--;
            if (direction === 'next') month++;
            if (month == 0) { //解决2018切换到2017又跳到201809
                year--;
                month = 12;
            }
            // console.log(year, month);
            var html = this.buildUi(year, month);

            if (!wrapper) { //不存在才创建，不然会导致切换月份有问题
                wrapper = document.createElement('div');
                wrapper.className = 'ui-datepicker-wrapper';
                document.body.appendChild(wrapper);
            }

            wrapper.innerHTML = html;
        },
        // 格式化date数据
        formate: function(date) {
            ret = '';
            ret += date.getFullYear() + '-';
            ret += this.padding(date.getMonth() + 1) + '-';
            ret += this.padding(date.getDate());
            return ret;
        },
        // 小于10数字前面加0
        padding: function(num) {
            if (num <= 9) {
                return '0' + num;
            }
            return num;
        }
    };

    window.DatePicker = DatePicker; //暴露到window
})();