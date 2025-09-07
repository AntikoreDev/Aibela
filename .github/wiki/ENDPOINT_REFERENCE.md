# Endpoint Reference

This document lists all available API endpoints, their methods, expected input, output, and a brief description of their purpose.

---

## Feeder Endpoints

### `POST /auth`
- **Description:** Authorizes a user and returns an access token.
- **Request Body (JSON):**
  - `channel` (string, required): Channel username.
  - `api_key` (string, required): Channel API key.
- **Response:**  
  - `200 OK`: `{ channel, access_token, expiration_date }`
  - `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`

---

### `GET /feeder`
- **Description:** Returns the feeder's own address (auto-repo).
- **Response:**  
  - `200 OK`: Plain text with feeder address.

---

### `GET /meta`
- **Description:** Returns general information about the feeder.
- **Response:**  
  - `200 OK`: `{ name, description, owner }`

---

## Channel Endpoints

### `GET /channels`
- **Description:** Lists all visible channels.
- **Response:**  
  - `200 OK`: Array of `{ username, nickname, language, description }`

---

### `POST /channels`
- **Description:** Creates a new channel.
- **Request Body (JSON):**
  - `access_token` (string, required): Admin access token.
  - `username` (string, required): Channel username.
  - `nickname` (string, optional): Channel display name.
  - `description` (string, optional): Channel description.
  - `visible` (boolean, optional): Channel visibility.
  - `language` (string, optional): Channel language.
- **Response:**  
  - `200 OK`: Created channel data + API key.
  - `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`

---

### `GET /channels/:channel`
- **Description:** Gets information about a specific channel.
- **Response:**  
  - `200 OK`: `{ username, nickname, description, language }`
  - `400 Bad Request`, `404 Not Found`

---

### `PUT /channels/:channel`
- **Description:** Updates a channel's information.
- **Request Body (JSON):**
  - `access_token` (string, required): Channel or admin access token.
  - `nickname` (string, optional)
  - `description` (string, optional)
  - `visible` (boolean, optional)
  - `language` (string, optional)
- **Response:**  
  - `200 OK`: `"OK"`
  - `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`

---

### `GET /channels/:channel/icon`
- **Description:** Gets the icon for a channel.
- **Response:**  
  - `200 OK`: PNG image.
  - `204 No Content`, `400 Bad Request`, `404 Not Found`

---

### `PUT /channels/:channel/icon`
- **Description:** (Not implemented) Update channel icon.
- **Response:**  
  - `501 Not Implemented`

---

## Video Endpoints

### `GET /channels/:channel/videos`
- **Description:** Lists all visible videos in a channel.
- **Response:**  
  - `200 OK`: Array of video objects `{ id, name, title, description, language, upload_date, prev, next }`
  - `400 Bad Request`, `404 Not Found`

---

### `POST /channels/:channel/videos`
- **Description:** Uploads a new video to a channel.
- **Request Body (FormData):**
  - `access_token` (string, required): Channel or admin access token.
  - `title` (string, required)
  - `description` (string, optional)
  - `video` (file, required): MP4 video file.
  - `thumbnail` (file, optional): PNG image.
  - `prev` (number, optional): Previous video ID.
  - `next` (number, optional): Next video ID.
  - `visible` (boolean, optional): Video visibility.
  - `language` (string, optional)
- **Response:**  
  - `201 Created`: `{ id, access_key (if not visible) }`
  - `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

---

### `GET /channels/:channel/videos/:video`
- **Description:** Downloads the video file.
- **Response:**  
  - `200 OK`: MP4 video file.
  - `400 Bad Request`, `404 Not Found`

---

### `PUT /channels/:channel/videos/:video`
- **Description:** Updates video metadata or files.
- **Request Body (FormData):**
  - `access_token` (string, required): Channel or admin access token.
  - `title` (string, optional)
  - `description` (string, optional)
  - `video` (file, optional): MP4 video file.
  - `thumbnail` (file, optional): PNG image.
  - `prev` (number, optional)
  - `next` (number, optional)
  - `visible` (boolean, optional)
  - `language` (string, optional)
- **Response:**  
  - `200 OK`: `"OK"`
  - `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`

---

### `GET /channels/:channel/videos/:video/info`
- **Description:** Gets metadata for a specific video.
- **Response:**  
  - `200 OK`: `{ id, name, title, description, upload_date, prev, next, language }`
  - `400 Bad Request`, `404 Not Found`

---

### `GET /channels/:channel/videos/:video/thumbnail`
- **Description:** Gets the thumbnail image for a video.
- **Response:**  
  - `200 OK`: PNG image.
  - `204 No Content`, `400 Bad Request`, `404 Not Found`

---

### `GET /videos`
- **Description:** Lists all visible videos from all channels.
- **Response:**  
  - `200 OK`: Array of video objects `{ id, name, title, description, upload_date, prev, next, channel }`

---

## Notes

- All endpoints may return standard HTTP error codes for invalid input or authorization failures.
- For endpoints requiring authentication, use the access token obtained from `/auth`.
- File uploads (video, thumbnail) must use `multipart/form-data`.

---