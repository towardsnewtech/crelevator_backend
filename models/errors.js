/**
 * @file Error messages cs-CZ
 * @author Vladan Kudlac <vladankudlac@gmail.com>
 */

const errors = {
	get uploadMissingFile400() { return {
		code: 400,
		err: 'File is missing.',
		msg: 'The request body must contain a file to upload.',
	};},
	get parameterTrackMissing400() { return {
		code: 400,
		err: 'Missing parameters.',
		msg: 'Required parameter is missing "track"',
	};},
	get parameterTrackTypeMissing400() { return {
		code: 400,
		err: 'Wrong parameter.',
		msg: 'The type parameter is missing or has a value other than "video" or "audio".',
	};},
	get parameterItemMissing400() { return {
		code: 400,
		err: 'Missing parameters',
		msg: 'The track or item parameter is missing.',
	};},
	get parameterDurationMissing400() { return {
		code: 400,
		err: 'Missing duration.',
		msg: 'To insert an image on the timeline, you must enter a duration in the format 00:00:00,000.',
	};},
	get parameterSplitMissing400() { return {
		code: 400,
		err: 'Missing parameters.',
		msg: 'Required parameters are missing: track, item, time.',
	};},
	get parameterFilterMissing400() { return {
		code: 400,
		err: 'Missing parameters.',
		msg: 'Required parameters are missing: "track", "item", "filter".',
	};},
	get parameterMoveMissing400() { return {
		code: 400,
		err: 'Missing parameters.',
		msg: 'Required parameters are missing: track, trackTarget, item, time.',
	};},
	parameterTimeRange400: (time) => { return {
		code: 400,
		err: 'Parameter out of range of values.',
		msg: `The time parameter must have a value between 00:00:00,000 a ${time}`,
	};},
	get parameterTimeWrong400() { return {
		code: 400,
		err: 'Wrong parameter.',
		msg: 'The time parameter must be positive, in the format 00:00:00,000.',
	};},
	get parameterTransitionMissing400() { return {
		code: 400,
		err: 'Missing parameters.',
		msg: 'Required parameters are missing: track, itemA, itemB, transition, duration.',
	};},
	get parameterTransitionWrong400() { return {
		code: 400,
		err: 'Wrong parameters.',
		msg: 'Parameters itemA, itemB must be integer, non-negative, duration must be non-zero, in format 00:00:00,000.',
	};},
	get parameterTransitionOrder400() { return {
		code: 400,
		err: 'Wrong parameters',
		msg: 'itemA must directly follow itemB.',
	};},
	get transitionTooLong400() { return {
		code: 400,
		err: 'Transition time too long.',
		msg: 'The transition is longer than one of the transition items.',
	};},
	get imgWrongTrack400() { return {
		code: 400,
		err: 'Unsupported file type.',
		msg: 'Images can only be inserted on a video track.',
	};},
	get videoWrongTrack400() { return {
		code: 400,
		err: 'Unsupported file type.',
		msg: 'Video can only be embedded on a video track.',
	};},
	get audioWrongTrack400() { return {
		code: 400,
		err: 'Unsupported file type.',
		msg: 'Audio can only be inserted on an audio track.',
	};},
	get videoDurationMissing400() { return {
		code: 400,
		err: 'File length is missing.',
		msg: 'The video has no detected length. Please try again or upload the file again.',
	};},
	get audioDurationMissing400() { return {
		code: 400,
		err: 'File length is missing.',
		msg: 'Audio has no detected length. Please try again or upload the file again.',
	};},
	get tracksIncompatible400() { return {
		code: 400,
		err: 'Incompatible tracks.',
		msg: 'Items cannot be moved between video and audio tracks.',
	};},
	get trackDefaultDel403() { return {
		code: 403,
		err: 'The track cannot be deleted.',
		msg: 'The default tracks "videotrack0" and "audiotrack0" cannot be deleted.',
	};},
	get fileWrongTrack403() { return {
		code: 403,
		err: 'Unsupported file type.',
		msg: 'Only video, image or audio can be pasted on the timeline.',
	};},
	get sourceInUse403() { return {
		code: 403,
		err: 'The source is in use.',
		msg: 'The resource is used in the project. Remove it from the timeline before deleting it from the project.',
	};},
	get transitionExists403() { return {
		code: 403,
		err: 'Transition already applied.',
		msg: 'The selected elements already have a mutual transition.',
	};},
	filterExists403: (item, track, filter) => { return {
		code: 403,
		err: 'The filter is already applied.',
		msg: `Item "${item}" on track "${track}" already has filter "${filter}" applied.`,
	};},
	get projectStillRendering403() { return {
		code: 403,
		err: 'Processing in progress.',
		msg: 'The project is already being processed, wait for completion.',
	};},
	get moveNoSpace403() { return {
		code: 403,
		err: 'Destination already contains item.',
		msg: 'The space you entered is not available, you can not move the item.',
	};},
	get projectNotFound404() { return {
		code: 404,
		err: 'The project does not exist',
		msg: 'The specified project does not exist.',
	};},
	get sourceNotFound404() { return {
		code: 404,
		err: 'Source not found.',
		msg: 'The source is not in the project.'
	};},
	trackNotFound404: (track) => { return {
		code: 404,
		err: 'Trace not found.',
		msg: `Entered track  "${track}" is not in the project.`,
	};},
	itemNotFound404: (item, track) => { return {
		code: 404,
		err: 'Item not found.',
		msg: `Item "${item}" on the trail "${track}" does not find.`,
	};},
	filterNotFound404: (item, track, filter) => { return {
		code: 404,
		err: 'Filter not found.',
		msg: `Filtr "${filter}" are on ${item}. track items "${track}" does not find.`,
	};},
	get projectFailedOpen500() { return {
		err: 'The project cannot be opened',
		msg: 'An error occurred while loading the project.',
	};}
};

module.exports = errors;
