<h1 align="center">
Aibela
</h1>

**Aibela** is an **open source video server** that exposes channels and videos through endpoints. This repository acts as the main implementation of a `feeder` of the aibela ecosystem, and can be self-hosted on any Internet server (a computer connected to the internet, SaaS, etc.)

**Note:** We are not responsible nor condone any wrong usage on the contents of this repository.

## 🌿 Aibela Ecosystem
The way this works is really simple: In one side you have feeders, in the other side you have clients. 

Feeders are hosted and exposed to the internet, just like any other server and videos are hosted there. No, this won't defragment the video like a torrent, you hold the whole video to be downloaded. 

Clients are the way to watch videos, they can connect to multiple feeders and watch their videos. These can be just a website, an application, or whatever mean you want. 

Repositores are the way a client finds feeders, these are just plain text content where every line is a feeder root address. The idea is that a client can use multiple repositories, check for repetetition, and also caching to prevent high traffic. Also including features such as accessing your own feeders to do admin stuff on them.

Feeders also include a /feeder endpoint which works like an autorepo, a repo that just refers to itself. This is useful so you can share this link to your friends so they can add it on their clients without the need of a proper repository.

Also, the idea is that the feeder shouldn't store more than what the admins include, that means no likes or comments are implemented on the feeder, anything like that should run apart.

Any of this components can be implemented in different ways and with different improvements, but keeping the standard base so all of them can be connected indifferently.

## ▶️ Usage

### As a content creator
First of all, you must possess some kind of server connected to the internet. You may download and configure this repository (See [Self Host](#self-host)). Some endpoints allow you to create channels and upload videos to them.

### As an average user
Videos from _feeders_ (like this one) hosted on the internet can be accessed through _clients_ (Official implementation not yet available). These clients can find new _feeders_ using _feeder repositories_ that work as listings of feeder URLs.

If you're not familiarized with anything of this, you just need to know that a good _client_ implementation generally holds a big _feeder repository_ by default to begin with and more can be added.

## ❓ FAQ

### What 'Aibela' stands for?
_'Aibela'_ just stands for _'Happiness'_ in a [conlang](https://en.wikipedia.org/wiki/Constructed_language) made by [@AntikoreDev](https://github.com/AntikoreDev).

## 🛟 Self Host

### 1. Install Bun
Install [bun](https://bun.com/) on your server
```bash
curl -fsSL https://bun.sh/install | bash
```

### 2. Clone this repository
Clone this repository to your server. 
```bash
git clone https://github.com/AntikoreDev/Aibela.git
```

### 3. Install dependencies
On the directory of the repository execute
```bash
rm -rf ./server_data
bunx drizzle-kit generate --dialect sqlite --schema ./database/schema.ts
bun install
```

### 4. Configure the server
You may edit the `config.toml` to fit your needs. Remember to enable nginx or apache in order to open ports correctly.

### 5. Enable the site
If you're using nginx, this should be the code for the site:
```bash
server {
    listen 443 ssl;
    server_name <server_name>;

    location ~ /.git/ {
        deny all;
    }

    location / {
        proxy_pass http://localhost:3621;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
``` 
Ensure to replace `<server name>` and the localhost port appropiately.

### 6. Run
Run the server like this
```bash
bun run index.ts
```

## 🧱 aContribute

### Development principles
_This applies mainly to official implementations of the project, forks or other projects can do whatever they want_
- To ease a transition to open source and decentralized options, implementations should be as visually as good as possible, specially to avoid giving the feeling of going through a dark and unknown place.
- Server should _only_ store data given by the server owner. This is not only for privacy purposes but also to avoid filling people's server or computers with external stuff, requiring a constant check to keep up without filling storage. That's why this implementation doesn't include a system for likes or comments

## ✅ To Do
- We are still in need of an Aibela client that allows users to watch videos from the network.

## 👥 Community
Join our community on Discord, for a free and better world (and internet): [Aibela Community](https://discord.gg/W4R4vDTT)

## ✍️ Credits
Project originally started by [@cixfra](https://github.com/cixfra) and [@AntikoreDev](https://github.com/AntikoreDev). For reasons repository was reuploaded, all 
contributions from the first commit were made by both of us.