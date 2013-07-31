Titanium.UI.setBackgroundColor('#fff');
Titanium.include("alarm_edit.js");

ALARM_LIST_ROW_HEIGHT = 100;

var alarmListTable = Titanium.UI.createTableView({
  data: [],
	rowHeight: ALARM_LIST_ROW_HEIGHT,
});

var setAlarmListTableData = function() {
  var rows = [];
	for (var i=0; i<clock.alarmList.length; i++) {
		var date = clock.alarmList[i].date;

		var alarmSummary = Titanium.UI.createTableViewRow({
			height: ALARM_LIST_ROW_HEIGHT,
			zIndex: 0,
		});

		var alarmSummryText = '';
		var amOrPm = '';
		if (date.getHours() > 12) {
			alarmSummaryText = '0' + (date.getHours() - 12) + ':'; 
			amOrPm = ' PM'
		} else {
			alarmSummaryText = date.getHours() + ':'; 
			amOrPm = ' AM'
		}
		if (date.getMinutes() > 10) {
			alarmSummaryText += date.getMinutes() + amOrPm; 
		} else {
			alarmSummaryText += '0' + date.getMinutes() + amOrPm; 
		}

		// For debugging
		Titanium.API.info('setAlarmListTableData was called');
		Titanium.API.info(date);

		var alarmSummaryLabel = Titanium.UI.createLabel({
			font: {
				fontSize: 20,
				fontWeight: 'bold',
				fontFamily: 'AppleGothic',
			},
			left: 20,
			zIndex: 1,
		});
		alarmSummaryLabel.text = alarmSummaryText;

		var alarmEnableSwitch = Titanium.UI.createSwitch({
			right: 10,
			zIndex: 2,
		});
		alarmEnableSwitch.value = clock.alarmList[i].isEnable;
		// Avoid to be incremented tentative value i
		var index = i;
		alarmEnableSwitch.addEventListener('change', function() {
			if (this.value) {
				clock.enableAlarm(index);
			} else {
				clock.disableAlarm(index);
			}
		});

		alarmSummary.add(alarmSummaryLabel);
		alarmSummary.add(alarmEnableSwitch);
		rows.push(alarmSummary); 
	}
	alarmListTable.setData(rows);
};

var setAlarmBtn = Titanium.UI.createButton({
	systemButton: Titanium.UI.iPhone.SystemButton.ADD,
});

setAlarmBtn.addEventListener('click', function() {   
  openAlarmEditWin(false);
});

var editAlarmBtn = Titanium.UI.createButton({
  //title: 'Edit'
	// TODO: Add functions to edit
	systemButton: Titanium.UI.iPhone.SystemButton.EDIT,
});

var editAlarmBtnState = 0;
editAlarmBtn.addEventListener('click', function() {
	switch(editAlarmBtnState) {
		case 0:
			editAlarmBtn.setSystemButton(Titanium.UI.iPhone.SystemButton.DONE);
			alarmListTable.editing = true;
			editAlarmBtnState = 1;
			break;
		case 1:
			editAlarmBtn.setSystemButton(Titanium.UI.iPhone.SystemButton.EDIT);
			alarmListTable.editing = false;
			editAlarmBtnState = 0;
			break;
	}
});

alarmListTable.addEventListener('delete', function(e) {
	Titanium.API.info('Deleting alarmList index ' + e.index);
	clock.deleteAlarm(e.index);
	Titanium.API.info(clock.alarmList);
});

alarmWin.add(alarmListTable);
alarmWin.rightNavButton = setAlarmBtn;
alarmWin.leftNavButton = editAlarmBtn;

