/**
 * @file Manager for work with media files
 * @author Vladan Kudlac <vladankudlac@gmail.com>
 */

const { exec, spawn } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');
const { getVideoDurationInSeconds } = require('get-video-duration');
const log = require('./logger');

module.exports = {

	/**
	 * Get time duration of file. Return null when file is not video or audio.
	 *
	 * @param filepath
	 * @param mimeType
	 * @return {Promise<?string>}
	 */
	getDuration(filepath, mimeType) {
		return new Promise((resolve, reject) => {
			if (new RegExp(/^video\//).test(mimeType) || new RegExp(/^audio\//).test(mimeType)) {
				exec(`ffmpeg -i ${filepath} 2>&1 | grep Duration | cut -d ' ' -f 4 | sed s/,// | sed s/\\\\./,/`, (err, stdout) => {
					if (err) {
						log.error(err);
						resolve(null);
					}
					else {
						let duration = stdout.trim();
						if (duration !== '') duration += '0';
						resolve(duration);
					}
				});
				// try {
				// 	getVideoDurationInSeconds(filepath).then((duration) => {
				// 		const hour = Math.floor(duration / 3600);
				// 		const minute = Math.floor((duration % 3600) / 60);
				// 		const second = Math.floor(duration % 60);
				// 		const mili = Math.round((duration - Math.floor(duration)) * 1000);
				// 		let time = '';
				// 		if(hour.toString().length == 2) {
				// 			time += hour.toString() + ':';
				// 		} else {
				// 			time += '0' + hour.toString() + ':';
				// 		}
				// 		if(minute.toString().length == 2) {
				// 			time += minute.toString() + ':';
				// 		} else {
				// 			time += '0' + minute.toString() + ':';
				// 		}
				// 		if(second.toString().length == 2) {
				// 			time += second.toString();
				// 		} else {
				// 			time += '0' + second.toString();
				// 		}
				// 		time += ',' + mili.toString();
				// 		resolve(time);
				// 	})
				// } catch (e) {
				// 	resolve(null);
				// }
			}
			else {
				resolve(null);
			}
		});
	}

};
