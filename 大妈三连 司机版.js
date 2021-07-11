// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
const Helper = {
	alert(message, title) {
		const obj = new Alert();
		obj.title = title;
		obj.message = message;
		obj.presentAlert();
	},
	prompt(message, title, placeHolder, defaultText) {
		const obj = new Alert();
		obj.title = title;
		obj.message = message;
		obj.addTextField(placeHolder, defaultText);
		obj.presentAlert();
	},
	async sendRequest(url, options) {
		const req = new Request(url);

		if (options) {
			const { method, headers, body } = options;
			req.method = method || 'POST';
			req.headers = headers;

			if (body)
				req.body = Object.keys(body)
					.map((k) => `${k}=${encodeURIComponent(body[k])}`)
					.join('&');
		}

		const res = await req.loadJSON();
		return res;
	}
};

let param;

if (args && args.shortcutParameter) param = JSON.parse(args.shortcutParameter);
else {
	return 0;
	param = {
		cookie: 'AT-z6lUyhs6%2BZ1XEcGWhu797fbDQpXxIOdP9q9AvelGrWxUKeF3tAJ0sOQy2%2BUnrCgz3EnKaEa%2BjdQYGXNOVlX%2B39SPUYxfYat5giS6tMFaXJluk96B4%2BAgXeYo',
		url: 'https://post.smzdm.com/p/amxvdomd/',
		articleId: '83961409',
		index: 0,
		comments: '全是原木色又感觉不好看了...',
		userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
		referer: 'https://post.smzdm.com/'
	};
}

const comments = param.comments.split('\n');
let comment;

if (param.index === -1) comment = comments[Math.floor(Math.random() * comments.length)];
else comment = comments.length > param.index ? comments[param.index] : '';

const headers = {
	'User-Agent': param.userAgent,
	Referer: param.referer,
	Cookie: `sess=${param.cookie}`
};

// 收藏
let res = await Helper.sendRequest('https://zhiyou.smzdm.com/user/favorites/ajax_favorite', {
	headers,
	body: {
		article_id: param.articleId,
		channel_id: 11,
		client_type: 'WAP'
	}
});

if (res.error_code === 2) {
	res = await Helper.sendRequest('https://zhiyou.smzdm.com/user/favorites/ajax_favorite', {
		headers,
		body: {
			article_id: param.articleId,
			channel_id: 11,
			client_type: 'WAP'
		}
	});
}

// 点赞
res = await Helper.sendRequest('https://zhiyou.smzdm.com/user/rating/ajax_add', {
	headers,
	body: {
		article_id: param.articleId,
		channel_id: 11,
		client_type: 'WAP',
		rating: 1
	}
});


// 评论
if (comment.length >= 5) {
	res = await Helper.sendRequest('https://zhiyou.smzdm.com/user/comment/ajax_set_comment', {
		headers,
		body: {
			pid: param.articleId,
			type: 11,
			client_type: 'WAP',
			content: comment
		}
	});
}
return 1;
