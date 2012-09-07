MediaHelper = function() {
	this.currentMediaHelperId = 0;
};

MediaHelper.VOICE_DATA_DIR = 'voice/';

MediaHelper.prototype.soundObj = Titanium.Media.createSound({
});;

MediaHelper.prototype.getDataSize = function() {
	return TORIMARI_MEDIA.length;
};

MediaHelper.prototype.getTableViewRows = function() {
	var rows = [];
	for (var i=0; i<this.getDataSize(); i++) {
		rows.push(Titanium.UI.createTableViewRow({
				title: TORIMARI_MEDIA[i].message}));
	};
	return rows;
};

MediaHelper.prototype.ringVoice = function(mediaId) {
	if (this.soundObj.isPlaying()) {
		this.soundObj.stop();
	}
	var voiceFile = MediaHelper.VOICE_DATA_DIR + TORIMARI_MEDIA[mediaId].voice;
	this.soundObj = Titanium.Media.createSound({
    url: voiceFile,
    volume: 5
  });
  this.soundObj.play();
};
