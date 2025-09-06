import { r_channels_get, r_channels_post } from "./channels/channels.ts"
import { r_channel_get, r_channel_put } from "./channels/channel.ts"
import { r_auth_post } from "./feeder/auth.ts"
import { r_videos_post, r_videos_get, r_allvideos_get } from "./videos/videos.ts"
import { r_video_get, r_video_put } from "./videos/video.ts"
import { r_video_info_get } from "./videos/video_info.ts"
import { r_feeder_get } from "./feeder/feeder.ts"
import { r_video_thumb_get } from "./videos/thumbnail.ts"
import { r_channel_icon_get, r_channel_icon_put } from "./channels/icon.ts"
import { r_meta_get } from "./feeder/meta.ts"

export const routes = {
	"/auth": {
		POST: r_auth_post
	},
	"/channels": {
		GET: r_channels_get,
		POST: r_channels_post
	},
	"/channels/:channel": {
		GET: r_channel_get,
		PUT: r_channel_put
	},
	"/channels/:channel/icon": {
		GET: r_channel_icon_get,
		PUT: r_channel_icon_put
	},
	"/channels/:channel/videos": {
		POST: r_videos_post,
		GET: r_videos_get
	},
	"/channels/:channel/videos/:video": {
		GET: r_video_get,
		PUT: r_video_put
	},
	"/channels/:channel/videos/:video/info": {
		GET: r_video_info_get
	},
	"/channels/:channel/videos/:video/thumbnail": {
		GET: r_video_thumb_get
	},
	'/videos': {
		GET: r_allvideos_get
	},
	"/feeder": {
		GET: r_feeder_get,
	},
	"/meta": {
		GET: r_meta_get
	}
}
