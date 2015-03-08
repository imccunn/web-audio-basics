var audioContext = audioContextCheck(); // create function to determine audio context fallback (mozAudioContext, webkitAudioContext)

var audioBuffer;

var getSound = new XMLHttpRequest();
getSound.open('get', 'audioFile.mp3', true);
getSound.responseType = 'arraybuffer';

getSound.onload = function() {
	audioContext.decodeAudioData(getSound.response, function(buffer) {
		audioBuffer = buffer;
	});
};

getSound.send();

window.addEventListener('mousedown', playback);

function playback() {
	var playSound = audioContext.createBufferSource();
	playSound.buffer = audioBuffer;
	playSound.connect(audioContext.destination);
	playSound.start(audioContext.currentTime);
}