const _MAIL_HELP = "HELP@I18N.SITE"

const _SITE_V = (async () => (await fetch(_I + "site/.v")).text())()
// use this for locked site version
// const _SITE_V = "0.1.27"
