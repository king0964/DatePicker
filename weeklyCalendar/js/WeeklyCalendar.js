(function() {
    /*简化id操作*/
    var $$ = function(id) {
        return document.getElementById(id);
    };
    var d = new Date();
    var currDay = d.getDay(),
        currDate = d.getDate(),
        currMonth = d.getMonth() + 1,
        currYear = d.getFullYear(),
        clickedTimes = 0; //用于计算每周显示数据
    var WeeklyCalendar = function() {
        var _this_ = this;
        /*周历使用*/
        this.initweeklyCalendar();
        EventUtil.addHandler($$('ui-datepicker-wrapper'), 'click', function(e) {
            var event = EventUtil.getEvent(e);
            var target = EventUtil.getTarget(event);
            if (target.id == 'prev_week') {
                /*前一周*/
                clickedTimes++;
                _this_.changeWeek(clickedTimes);

            } else if (target.id == 'next_week') {
                /*后一周*/
                clickedTimes--;
                _this_.changeWeek(clickedTimes);
            } else if (target.tagName.toLowerCase() == 'a') {
                var lis = $$('weeklyCanlendarView').getElementsByTagName('li');
                for (var i = 0, len = lis.length; i < len; i++) {
                    if (lis[i].className.indexOf('active') == -1) {
                        lis[i].className = '';
                    }
                }
                target.parentNode.className = "clickActive";
                // 获取点击日期的年月日
                // var _y = target.getAttribute('data-year'),
                //     _m = parseInt(target.title) < 10 ? "0" + parseInt(target.title) : parseInt(target.title),
                //     _d = target.innerHTML < 10 ? "0" + target.innerHTML : target.innerHTML,
                //     dateTime;
                // dateTime = {
                //     "year": _y,
                //     "month": _m,
                //     "date": _d
                // };
                // console.log(dateTime);
            }
        }, false);
    };
    WeeklyCalendar.prototype = {
        /**
          * 计算过去或者是未来时间
          @param obj 返回的月份和日期  
          @param {number} num 计算过去或者是未来的某天
        */
        calcTime: function(num) {
            num = num || 0;
            var someTime = d.getTime() + (24 * 60 * 60 * 1000) * num,
                someYear = new Date(someTime).getFullYear(),
                someMonth = new Date(someTime).getMonth() + 1, //未来月
                someDate = new Date(someTime).getDate(); //未来天
            var obj = {
                "year": someYear,
                "month": someMonth,
                "date": someDate
            };
            return obj;
        },
        /*创建周历*/
        creatWeeklyCalendar: function(some) {
            if (currMonth < 10) currMonth = '0' + currMonth;
            var html = '<div class="datetime_header">' +
                '<a href="javascript:;" title="上一周" class="prev_icon" id="prev_week"></a>' +
                '<span><b id="year_selector">' + currYear + '</b>年<b id="month_selector">' + currMonth + '</b>月</span>' +
                '<a href="javascript:;" title="下一周" class="next_icon" id="next_week"></a>' +
                '</div>' +
                '<ul id="weeks_ch">' +
                '<li>日</li>' +
                '<li>一</li>' +
                '<li>二</li>' +
                '<li>三</li>' +
                '<li>四</li>' +
                '<li>五</li>' +
                '<li>六</li>' +
                '</ul>' +
                '<ul id="weeklyCanlendarView" clickedTimes="0">';
            for (var i = some, len = some + 7; i < len; i++) {
                if (this.calcTime(i).month == currMonth && this.calcTime(i).date == currDate) {
                    html += '<li class="active"><a href="javascript:;" data-year="' + this.calcTime(i).year + '" title="' + this.calcTime(i).month + '月">' + this.calcTime(i).date + '</a></li>';
                } else {
                    html += '<li><a href="javascript:;" data-year="' + this.calcTime(i).year + '" title="' + this.calcTime(i).month + '月">' + this.calcTime(i).date + '</a></li>';
                }
            }
            html += '</ul>';
            $$('ui-datepicker-wrapper').innerHTML = html;
        },
        // 初始化周历
        initweeklyCalendar: function() {
            this.creatWeeklyCalendar(-currDay);
        },
        /*前一周和后一周方法*/
        changeWeek: function(clickedTimes) {
            this.creatWeeklyCalendar(-currDay - (7 * clickedTimes));
            var aTags = $$('weeklyCanlendarView').getElementsByTagName('a');
            $$('weeklyCanlendarView').setAttribute('clickedTimes', clickedTimes);
            //动态设置月
            var clickMonth = parseInt(aTags[0].title);
            if (clickMonth < 10) clickMonth = '0' + clickMonth;
            $$('month_selector').innerHTML = clickMonth;
            //动态设置年
            var clickYear = aTags[0].getAttribute('data-year');
            $$('year_selector').innerHTML = clickYear;
        }
    };
    window.WeeklyCalendar = WeeklyCalendar;
})();