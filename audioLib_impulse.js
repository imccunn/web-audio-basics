// audiolib.js

// Audio lib with reverb/impulse response integration
'use strict';

function audioFileLoader(fileDirectory, impulseFileDirectory) {
	
	// Sound object to 
	var soundObj = {};
	soundObj.fileDirectory = fileDirectory;
	soundObj.impulseFileDirectory = impulseFileDirectory;



	var getSound = new XMLHttpRequest();
	getSound.open('GET', soundObj.fileDirectory, true);
	getSound.responseType = 'arrayBuffer';
	getSound.onload = function() {
		audioContext.decodeAudioData(getSound.response, function(buffer) {
			soundObj.soundToPlay = buffer;
		});
	};

	getSound.send();

	// ************* Fetch and load impulse file ***********************************
	
	var impulseBuffer;

	var getImpulse = new XMLHttpRequest();
	getImpulse.open('GET', soundObj.impulseFileDirectory, true);
	getImpulse.responseType = 'arrayBuffer';
	getImpulse.onload = function() {
		audioContext.decodeAudioData(getImpulse.response, function(bufferImpulse) {
			impulseBuffer = bufferImpulse;
		});
	};

	getImpulse.send();

	// ************************************************


	soundObj.play = function() {

		// basic requirements to play audio file
		var playSound = audioContext.createBufferSource();
		playSound.buffer = soundObj.soundToPlay;

		// convolver setup
		var convolver = audioContext.createConvolver();
		convolver.buffer = impulseBuffer;
		

		//send sound file through convolver node
		playSound.connect(convolver);

		// send convolved signal to audio context destination
		convolver.connect(audioContext.destination);

		playSound.start(audioContext.currentTime);
	};

	return soundObj;
}

// Load Audio File
var someRandomAudio = audioFileLoader('anAudioFileOnTheServer.mp3');


// Add a way to play/trigger the sound
window.addEventListener('keydown', someRandomAudio.play, false);
