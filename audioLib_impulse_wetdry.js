// audioLib_impulse_wetdry.js
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

	// *****************************************************************************


	soundObj.play = function() {

		// basic requirements to play audio file
		var playSound = audioContext.createBufferSource();
		playSound.buffer = soundObj.soundToPlay;
		var playSoundDry = audioContext.createGain();
		var playSounWet = audioContext.createGain();
		var mixGain = audioContext.createGain();

		// convolver setup
		var convolver = audioContext.createConvolver();
		convolver.buffer = impulseBuffer;
		
		// gain control params
		
		playSoundDry.gain.value = 1;
		playSoundWet.gain.value = 0.9;

		/* ***************** Routing Diagram ******************
		
		playSound - > convolver - > playSoundWet--mixGain-- > destination
		playSound - > playSoundDry---------------- ^

		******************************************************/


		// Node Graph Connections
		playSound.connect(convolver);
		convolver.connect(playSoundWet);
		playSound.connect(playSoundDry);
		playSoundDry.connect(mixGain);
		playSoundWet.connect(mixGain);

		mixGain.connect(audioContext.destination);

		playSound.start(audioContext.currentTime);
	};

	return soundObj;
}

// Load Audio File
var someRandomAudio = audioFileLoader('anAudioFileOnTheServer.mp3');


// Add a way to play/trigger the sound
window.addEventListener('keydown', someRandomAudio.play, false);
