document.addEventListener('DOMContentLoaded', function() {
	const cache = new Map();

	function fetch_page(url) {
		console.log(`Fetching ${url}`);
		return fetch(url)
			.then(response => response.text())
			.then(html => {
				cache.set(url, html);
				return html;
			})
			.catch(error => console.error(`Failed to fetch ${url}:`, error));
	}

	function replace_dom(html, url, update_history = true) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		document.documentElement.innerHTML = doc.documentElement.innerHTML;
		if (update_history) {
			history.pushState({ url: url }, '', url);
		}

		const fragment = url.split('#')[1];
		if (fragment) {
			const element = document.getElementById(fragment);
			if (element) {
				element.scrollIntoView();
			}
		} else {
			window.scrollTo(0, 0);
		}

		attach_event_listeners();
	}

	function handle_anchor_click(event) {
		event.preventDefault();
		const url = event.currentTarget.href;
		if (url && cache.has(url)) {
			replace_dom(cache.get(url), url);
		} else {
			fetch_page(url).then(html => replace_dom(html, url));
		}
	}

	window.addEventListener('popstate', function(event) {
		if (event.state && event.state.url) {
			const url = event.state.url;
			if (cache.has(url)) {
				replace_dom(cache.get(url), url, false);
			} else {
				fetch_page(url).then(html => replace_dom(html, url, false));
			}
		}
	});

	function attach_event_listeners() {
		document.querySelectorAll('a').forEach(anchor => {
			let hoverTimeout;
			anchor.addEventListener('mouseover', function() {
				const url = anchor.href;
				if (url && !cache.has(url)) {
					hoverTimeout = setTimeout(() => fetch_page(url), 100);
				}
			});

			anchor.addEventListener('mouseout', function() {
				clearTimeout(hoverTimeout);
			});

			anchor.addEventListener('click', handle_anchor_click);
			anchor.addEventListener('touchstart', handle_anchor_click);
		});
	}

	attach_event_listeners();
});
