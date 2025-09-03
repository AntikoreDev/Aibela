
/*const response = await fetch("http://127.0.0.1:3621/channels", {
	method: "POST",
	body: JSON.stringify({
		access_token: "admin",
		channel: "kiba",
		description: "The best boyfwen :3"
	}),
	headers: { "Content-Type": "application/json" }
});

const json_content = await response.json()
console.log(json_content);
//console.log(response.statusText);
*/

async function auth(channel: string, api_key: string) {
	const response = await fetch("http://127.0.0.1:3621/auth", {
		method: "POST",
		body: JSON.stringify({
			channel: channel,
			api_key: api_key
		}),
		headers: { "Content-Type": "application/json" }
	});
	try
	{
		const json_content: any = await response.json();
		return json_content;
	}
	catch (error)
	{
		console.log(response.statusText);
		return null;
	}
}

async function create_channel(username: string, nickname: string, description: string|null, access_token: string|null) {
	const response = await fetch("http://127.0.0.1:3621/channels", {
		method: "POST",
		body: JSON.stringify({
			access_token: access_token,
			username: username,
			nickname: nickname,
			description: description
		}),
		headers: { "Content-Type": "application/json" }
	});
	try
	{
		const json_content: any = await response.json();
		return json_content;
	}
	catch (error)
	{
		console.log(response.statusText);
		return null;
	}
}

async function upload_video(channel:string, title: string, description:string, path:string, access_token: string) {
	const form_data = new FormData();

	form_data.append("access_token", access_token);
	form_data.append("title", title);
	form_data.append("description", description);

	const video_bytes = await Bun.file(path).bytes();
	const video_blob = new Blob([video_bytes]);
	
	form_data.append("video", video_blob);

	const response = await fetch(`http://127.0.0.1:3621/channels/${channel}/videos`, {
		method: "POST",
		body: form_data,
	});
	try
	{
		const json_content: any = await response.json();
		return json_content;
	}
	catch (error)
	{
		console.log(response.statusText);
		return null;
	}
}

const { access_token } = await auth("admin", "admin");
console.log(access_token);
/*
const fran = await create_channel("cixfra", "El Paco", "Programmer boy :3", access_token);
console.log(fran);

const video = await upload_video("cixfra", "Video00", "My first video", "./video.mp4", access_token);
console.log(video);

const video = await upload_video("cixfra", "Video01", "Homophobic Cat", "./video2.mp4", access_token);
console.log(video);

const video = await upload_video("cixfra", "Deltarune meme", "funny", "./deltarune.mp4", access_token);
console.log(video);*/

/*

const response = await fetch("http://127.0.0.1:3621/channels/user00/videos", {
	method: "POST",
	body: JSON.stringify({
		name: "vid.mp4",
	}),
	headers: { "Content-Type": "application/json" }
});
*/
