const F = {
		fetch: (event) => {
			const key = "respondWith"
			event[key](
				new Promise((resolve, reject) => {
					P.then(() => {
						event[key] = (r) => {
							resolve(r || fetch(event.request))
						}
						F.fetch(event)
					}, reject)
				}),
			)
		},
	},
	split = (i) => i.split(">"),
	JSD = split("{cdn.jsd}"),
	loadFunc = (txt) => new Function("return (" + txt + ")")(),
	P = (async () => {
		const f = async (host_li, func) => {
				let n = 0,
					len = host_li.length
				while (n < len) {
					const url = func(host_li[n++])
					try {
						const r = await fetch("//" + url)
						if (r.status == 200) {
							return await r.text()
						}
					} catch (e) {
						if (n == len) {
							throw e
						}
						console.error(url, e)
					}
				}
			},
			hostUrl = (suffix) => (host) => `${host}/${suffix}`

		const cdn_v = split("{cdn.v}")
		const pkg_md = "{pkg.md}"
		const mdv = f(cdn_v, hostUrl(pkg_md))

		const org_i = "@{pkg.i}/"
		const site = "site"
		const [sitev, _18x, _18x_v] = split(await f(cdn_v, hostUrl(org_i + site)))
		const at = "@"
		const pkg_18x = _18x + at + _18x_v

		loadFunc(await f(JSD, hostUrl(pkg_18x + "/S.js")))(
			new Set(
				"js|css|htm|html|md|avif|rss|gz|ico|json|png|svg|txt|webmanifest|xml".split(
					"|",
				),
			),
			JSD,
			pkg_18x + "/_.css",
			F,
			pkg_md,
			mdv,
			org_i,
			site + at + sitev,
			pkg_18x,
		)
	})()

for (const i of "notificationclick push".split(" ")) {
	F[i] = async (event) => {
		const key = "waitUntil"
		event[key](
			new Promise((resolve) => {
				P.then(() => {
					event[key] = resolve
					F[i](event)
				})
			}),
		)
	}
	addEventListener(i, (event) => F[i](event))
}

Object.entries({
	install: (event) => event.waitUntil(self.skipWaiting()),
	activate: (event) => {
		event.waitUntil(
			(async () => {
				await P
				await clients.claim()
			})(),
		)
	},
	fetch: (event) => F.fetch(event),
}).forEach(([key, func]) => addEventListener(key, func))
