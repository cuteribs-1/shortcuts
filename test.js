const param = JSON.parse(args.shortcutParameter);
let url = param.url.replace('post.m.', 'post.');

if (!url.startsWith('https://post.smzdm.com')) {
	return { error: '无效链接' };
}

let req = new Request(param.url);

req.headers = {
	'User-Agent': param.userAgent,
	Referer: param.referer
};
let html = await req.loadString();
let articleId = [...html.matchAll(/id="data-aid"  value="([\d]+)"/g)][0][1];
let title = [...html.matchAll(/<title>([\s\S]+)<\/title>/g)][0][1];

const fm = FileManager.local();
cookies = [];
let text = fm.readString(param.cookieFile);

if (text) {
	cookies = text
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l.length > 0)
		.map((l) => `sess=${l};`);
}

if (cookies.length === 0) return { error: '无效链接' };

return JSON.stringify(parameter);

Script.complete();
