var openAlarmEditWin = function(isEdit) {
  var alarmEditWin = Titanium.UI.createWindow({
    backgroundColor: '#000',
  });

	var rootAlarmEditWin = Titanium.UI.createWindow({
		navBarHidden: true,
	});

	var alarmEditWinNavGroup = Titanium.UI.iPhone.createNavigationGroup({
		window: alarmEditWin
	});
	
	var alarmOptionsGroup = Titanium.UI.createTableViewSection({});

	var voiceRow = Titanium.UI.createTableViewRow({
		title: 'Voice',
		hasChild: true,
		height: 50,
	});

	var snoozeSwitch = Titanium.UI.createSwitch({
		value: true,
		right: 10,
	});

	var snoozeRow = Titanium.UI.createTableViewRow({
		title: 'Snooze',
		height: 50,
	});

	var getAlarmOptionsTableData = function() {
		alarmOptionsGroup.add(voiceRow);
		snoozeRow.add(snoozeSwitch);
		alarmOptionsGroup.add(snoozeRow);
		return [alarmOptionsGroup];
	};

	var alarmOptionsTable = Titanium.UI.createTableView({
		data: getAlarmOptionsTableData(),
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
		zIndex: 0,
	});

	var currentCheckedVoiceId = 0;

	var voiceWin = Titanium.UI.createWindow({});

	var voiceOptionsGroup = Titanium.UI.createTableViewSection({});

	var getVoiceOptionsTableData = function(mediaId) {
		var voiceRows = mediaHelper.getTableViewRows();
		for (var i=0; i<voiceRows.length; i++) {
			if (i == mediaId) {
				voiceRows[i].hasCheck = true;
				voiceOptionsGroup.add(voiceRows[i]);			
			} else {
				voiceRows[i].hasCheck = false;
				voiceOptionsGroup.add(voiceRows[i]);			
			}
		}
		return [voiceOptionsGroup]
	};

	var voiceOptionsTable = Titanium.UI.createTableView({
		data: getVoiceOptionsTableData(currentCheckedVoiceId),
		style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
	});

	voiceOptionsTable.addEventListener('click', function(e) {
		if (!e.row.hasCheck) {
			var voiceOptionsTableRows = voiceOptionsGroup.getRows()
			for (var i=0; i<voiceOptionsTableRows.length; i++) {
				if (e.index == i) {
					voiceOptionsTableRows[i].hasCheck = true;
				} else {
					voiceOptionsTableRows[i].hasCheck = false;
				}
			}
		}
		mediaHelper.ringVoice(e.index);
		currentCheckedVoiceId = e.index;
	});
	
	alarmOptionsTable.addEventListener('click', function(e) {
		if (e.row.hasChild) {
			voiceWin.add(voiceOptionsTable);
			alarmEditWinNavGroup.open(voiceWin);
		}
	});

  var timePicker = Titanium.UI.createPicker({
    //type: Titanium.UI.PICKER_TYPE_DATE_AND_TIME,
    type: Titanium.UI.PICKER_TYPE_TIME,
    value: new Date(),
		zIndex: 1,
		bottom: 0,
  });

  timePicker.addEventListener('change', function(e) {
    timePicker.value = e.value;
  });

  var setTimeBtn = Titanium.UI.createButton({
    title: 'set',
  });

  setTimeBtn.addEventListener('click', function() {
    Titanium.API.info(new Date(new Date() - new Date(timePicker.getValue())).getTime());
    if (new Date(new Date() - new Date(timePicker.getValue())).getTime() > -1) {
      // Set 24 hours later if the time is earlier than current time.
      clock.setAlarm(
					new Date(timePicker.getValue().setSeconds(0) + 1000 * 60 * 60 * 24),
					currentCheckedVoiceId,
					snoozeSwitch.value,
					true);
      Titanium.API.info('added 24 hours');
    } else {
      clock.setAlarm(
					new Date(timePicker.getValue().setSeconds(0)),
					currentCheckedVoiceId,
					snoozeSwitch.value,
					true);
      Titanium.API.info('not added 24 hours');
    }
    Titanium.API.info(clock.alarmList); 
    setAlarmListTableData();
    rootAlarmEditWin.close();
  });

  var cancelBtn = Titanium.UI.createButton({
    systemButton:Titanium.UI.iPhone.SystemButton.CANCEL,
    title: 'cancel',
  });

  cancelBtn.addEventListener('click', function() {
    rootAlarmEditWin.close();
  });

  alarmEditWin.add(timePicker);
  alarmEditWin.add(alarmOptionsTable);
  alarmEditWin.rightNavButton = setTimeBtn;
  alarmEditWin.leftNavButton = cancelBtn;

	rootAlarmEditWin.add(alarmEditWinNavGroup);
	rootAlarmEditWin.open({
		modal: true,
	});
};
