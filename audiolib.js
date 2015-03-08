// audiolib.js

'use strict';

function audioFileLoader(fileDirectory) {
	
	// Sound object to 
	var soundObj = {};

	var getSound = new XMLHttpRequest();
	getSound.open('GET', soundObj.fileDirectory, true);
	getSound.responseType = 'arrayBuffer';
	getSound.onload = function() {
		audioContext.decodeAudioData(getSound.response, function(buffer) {
			soundObj.soundToPlay = buffer;
		});
	};

	getSound.send();

	soundObj.play = function(volumeVal, playbackRateVal) {

		// optionally connect to gain node for volume control
		var volume = audioContext.createGain();
		volume.gain.value = volumeVal;
		
		// optionally add playback rate
		playSound.playbackRate.value = playbackRateVal;

		// basic requirements to play audio file
		var playSound = audioContext.createBufferSource();
		playSound.buffer = soundObj.soundToPlay;

		//send to gain node first before destination node
		playSound.connect(volume);
		volume.connect(audioContext.destination);
		playSound.start(audioContext.currentTime);
	};

	return soundObj;
}

// Load Audio File
var someRandomAudio = audioFileLoader('anAudioFileOnTheServer.mp3');

function eventCallback() {

	someRandomAudio.play(1, 1);
}


// Add a way to play/trigger the sound
window.addEventListener('keydown', eventCallback, false);
