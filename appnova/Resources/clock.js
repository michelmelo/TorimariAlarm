Clock = function() {
};

Clock.prototype.alarmList = [];

Clock.prototype.createAlarmObj = function(dateObj, mediaId, isSnooze, isEnable) {
    return {
        //'id': (new Date()).getTime(),
        'date' : dateObj,
        'mediaId' : mediaId,
        'isSnooze' : isSnooze,
        'isEnable' : isEnable,
        'timerId' : null,
    };
};

Clock.prototype.setClock = function() {
    this.now = new Date();
    this.hour = this.now.getHours();
    this.min = this.now.getMinutes();
    this.sec = this.now.getSeconds();
};

Clock.prototype.getCurrentTime = function() {
    return this.now;
};

Clock.prototype.getCurrentTimeString = function() {
    var hour, min;
    if (this.hour < 10) {
        hour = '0' + this.hour.toString();
    } else {
        hour = this.hour.toString();
    }
    if (this.min < 10) {
        min = '0' + this.min.toString();
    } else {
        min = this.min.toString();
    }
    if (this.sec < 10) {
        sec = '0' + this.sec.toString();
    } else {
        sec = this.sec.toString();
    }
    //return hour + ':' + min + ':' + sec;
    return hour + ':' + min;
};

Clock.prototype.sortAlarmList = function() {
    this.alarmList.sort(function(x, y) {
        return x.date - y.date;
    });
}

Clock.prototype.setAlarm = function(dateObj, mediaId, isSnooze, isEnable) {
    var alarmObj = this.createAlarmObj(dateObj, mediaId, isSnooze, isEnable)
    this.sortAlarmList();
    // Register foreground alarm
    this.setAlarmTimeOut(alarmObj);
    this.alarmList.push(alarmObj);
};

Clock.prototype.enableAlarm = function(index) {
    var oldDate = this.alarmList[index].date;
    var now = new Date();
    var newDate;
    if (new Date(now - oldDate).getTime() > -1) {
        newDate = new Date(new Date(now.getFullYear(), now.getMonth() + 1, now.getDay(), oldDate.getHours(), oldDate.getMinutes(), 0).getTime() + 1000 * 60 * 60 * 24);
    } else {
        newDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDay(), oldDate.getHours(), oldDate.getMinutes(), 0);
    }

    var alarmObj = this.createAlarmObj(newDate, this.alarmList[index].mediaId, this.alarmList[index].isSnooze, true);
    this.setAlarmTimeOut(alarmObj);
    this.alarmList[index] = alarmObj;
    Titanium.API.info(this.alarmList);
};

Clock.prototype.disableAlarm = function(index) {
    this.alarmList[index].isEnable = false;
    this.clearAlarmTimeOut(this.alarmList[index]);
    Titanium.API.info(this.alarmList);
};

Clock.prototype.setAlarmTimeOut = function(alarmObj) {
    var clockObj = this;
    alarmObj.timerId = setTimeout(function() {
        clockObj.ringAlarm(alarmObj);
        alarmObj.isEnable = false;
    }, alarmObj.date - new Date());
};

Clock.prototype.clearAlarmTimeOut = function(alarmObj) {
    if (alarmObj.timerId > 0) {
        clearTimeout(alarmObj.timerId);
    } else {
        Titanium.API.info('Clock.prototype.clearAlarmTimeOut: timerId is null');
    }
};

Clock.prototype.getAlarm = function() {
};

Clock.prototype.ringAlarm = function(alarmObj) {
    var alarmSound = Titanium.Media.createSound({
        url : 'pop.caf',
        volume : 5
    });
    alarmSound.play();
    Ti.App.fireEvent('alarmRinging');
}

Clock.prototype.setBackgroundAlarm = function() {
    // Register background alarm
    Ti.App.Properties.setList('alarmList', this.alarmList);
    Ti.App.iOS.registerBackgroundService({
        url : 'bg_alarm.js'
    });
};

Clock.prototype.deleteAlarm = function(index) {
    this.disableAlarm(index);
    this.alarmList.splice(index, 1);
}

