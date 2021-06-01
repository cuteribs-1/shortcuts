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
const filePath = fm.joinPath(fm.documentDirectory(), param.cookieFile);
cookies = [];
let text = fm.readString(filePath);

if (text) {
	cookies = text
		.split('\n')
		.map((r) => r.trim())
		.filter((r) => r.length > 0)
		.map((r) => `sess=${r};`);
}

if (cookies.length === 0) return { error: '无效链接' };

const comments = param.comments.split('\n').map((r) => r.trim());
comments.length = cookies.length;
results = [];

for (const i = 0; i < comments.length; i++) {
	let comment = comments[i] || '';

	const headers = {
		'User-Agent': param.userAgent,
		Referer: param.referer,
		Cookie: cookies[i]
	};
	const result = [];

	req = new Request('https://zhiyou.smzdm.com/user/favorites/ajax_favorite');
	req.headers = headers;
	req.body = {
		article_id: articleId,
		channel_id: 11,
		client_type: 'WAP'
	};
	let res = await req.loadJSON();
	result.push(true);
	result.push(res.error_msg);

	req = new Request('https://zhiyou.smzdm.com/user/rating/ajax_add');
	req.headers = headers;
	req.body = {
		article_id: articleId,
		channel_id: 11,
		client_type: 'WAP',
		rating: 1
	};
	res = await req.loadJSON();

	if (res.error_code != 1) res = await req.loadJSON();

	result.push(true);
	result.push(res.error_msg);

	if (comment.length < 5) {
		result.push(false);
		result.push('评论不足5字, 忽略');
	} else {
		req = new Request('https://zhiyou.smzdm.com/user/comment/ajax_set_comment');
		req.headers = headers;
		req.body = {
			pid: articleId,
			type: 11,
			client_type: 'WAP',
			content: comment
		};
		res = await req.loadJSON();

		if (typeof res.error_msg === 'object') {
			result.push(true);
			result.push(res.error_msg.comment_content);
		} else {
			result.push(false);
			result.push(res.error_msg);
		}
	}
}

results.push(result);
return results;