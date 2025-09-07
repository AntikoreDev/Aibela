import { r_channels_get, r_channels_post } from "./channels/channels.ts"
import { r_channel_delete, r_channel_get, r_channel_put } from "./channels/channel.ts"
import { r_auth_post } from "./feeder/auth.ts"
import { r_videos_post, r_videos_get, r_allvideos_get } from "./videos/videos.ts"
import { r_video_delete, r_video_get, r_video_put } from "./videos/video.ts"
import { r_video_info_get } from "./videos/video_info.ts"
import { r_feeder_get } from "./feeder/feeder.ts"
import { r_video_thumb_get } from "./videos/thumbnail.ts"
import { r_channel_icon_get, r_channel_icon_put } from "./channels/icon.ts"
import { r_meta_get } from "./feeder/meta.ts"
import { r_regen_put } from "./channels/regen.ts"

export const routes = {
	
	/**
	 * Feeder related endpoints
	 */
	"/auth": {
		POST: r_auth_post
	},
	"/feeder": {
		GET: r_feeder_get,
	},
	"/meta": {
		GET: r_meta_get
	},

	/**
	 * Channel related endpoints
	 */
	"/channels": {
		GET: r_channels_get,
		POST: r_channels_post
	},
	"/channels/:channel": {
		GET: r_channel_get,
		PUT: r_channel_put,
		DELETE: r_channel_delete
	},
	"/channels/:channel/icon": {
		GET: r_channel_icon_get,
		PUT: r_channel_icon_put
	},
	"/channels/:channel/regen": {
		PUT: r_regen_put
	},

	/**
	 * Video related endpoints
	 */
	"/channels/:channel/videos": {
		POST: r_videos_post,
		GET: r_videos_get
	},
	"/channels/:channel/videos/:video": {
		GET: r_video_get,
		PUT: r_video_put,
		DELETE: r_video_delete
	},
	"/channels/:channel/videos/:video/info": {
		GET: r_video_info_get
	},
	"/channels/:channel/videos/:video/thumbnail": {
		GET: r_video_thumb_get
	},
	'/videos': {
		GET: r_allvideos_get
	}

}