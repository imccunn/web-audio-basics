// audioContext_check.js

'use strict';

/**
 *      Checks to make sure the AudioContext object or the vendor shim objects are supported.
 *      
 * @return {object} The supported AudioContext object
 */
function audioContextCheck() {
	if (typeof AudioContext !== 'undefined') {
		return new AudioContext();
	} else if (typeof webkitAudioContext !== 'undefined') {
		return new webkitAudioContext();
	} else if (typeof mozAudioContext !== 'undefined') {
		return new mozAudioContext();
	} else {
		throw new Error('AudioContext not supported');
	}
}

var audioContext = audioContextCheck();