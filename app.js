// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');
Titanium.include("media.js");
Titanium.include("media_helper.js");
Titanium.include("clock.js");

var tabGroup = Titanium.UI.createTabGroup();

var mediaHelper = new MediaHelper();
var clock = new Clock();
//
// create base UI tab and root window
//

var mainWin = Titanium.UI.createWindow({  
  backgroundColor:'#fff',
  fullscreen: true,
  navBarHidden: true
});

var mainTab = Titanium.UI.createTab({
  title: 'Clock',
  window: mainWin
});

var alarmWin = Titanium.UI.createWindow({
});

Titanium.include("alarm_settings.js");

var alarmTab = Titanium.UI.createTab({
  title: 'Alarm',
  window: alarmWin 
});

var photoWin = Titanium.UI.createWindow({
  url: 'photos.js'
});

var photoTab = Titanium.UI.createTab({
  title: 'Photo',
  window: photoWin 
});

var infoWin = Titanium.UI.createWindow({
  url: 'photos.js'
});

var infoTab = Titanium.UI.createTab({
  title: 'Info',
  window: infoWin 
});

// Display the image 
var topImg = Titanium.UI.createImageView({
  image: 'img/torimari.jpg',
});

mainWin.add(topImg);

// Display the clock
var timerLabel = Titanium.UI.createLabel({
  color:'#fff',
  opacity: 0.8,
  top: 60,
  right: 10,
  font:{fontSize:50,fontFamily:'AppleGothic'},
  textAlign:'center',
}); 

mainWin.add(timerLabel);

mainWin.addEventListener('open', function() {
  setInterval(function() {
    clock.setClock();
    timerLabel.text = clock.getCurrentTimeString();
  }, 1000);
});

Ti.App.addEventListener('alarmRinging', function(e) {
  tabGroup.setActiveTab(0); 
  setAlarmListTableData();
});

Ti.App.iOS.addEventListener('notification', function(e) {
  Ti.API.info('app got back from notification');
  Ti.App.iOS.cancelAllLocalNotifications(); 
  Ti.API.info('Got notification event!');
  setAlarmListTable(); 
});

Ti.App.addEventListener('resume', function() {
  Ti.API.info('app was resumed');
  Ti.App.iOS.cancelAllLocalNotifications(); 
  setAlarmListTable(); 
});

Ti.App.addEventListener('pause', function() {
  Ti.API.info('app was paused');
  clock.setBackgroundAlarm();
});

tabGroup.addTab(mainTab);
tabGroup.addTab(alarmTab);
tabGroup.addTab(photoTab);
tabGroup.addTab(infoTab);

tabGroup.open();
