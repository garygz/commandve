var nconf = require('nconf');

// First consider commandline arguments and environment variables, respectively
nconf.argv().env();
// Then load configuration from a designated file.
nconf.file({ file: 'config.json' });

//TODO READ THEM FROM CONFIG FILE
exports.GROUP_TYPE_GITHUB = "github-gist";
exports.GROUP_NAME_GITHUB = "My GitHub Gists";

exports.GROUP_TYPE_UNCATEGORIZED = "external";
exports.GROUP_NAME_UNCATEGORIZED = "Found On The Web";

exports.GROUP_TYPE_SUBLIME = "sublime";
exports.GROUP_NAME_SUBLIME = "Sublime";

exports.GROUP_DESCR_GITHUB = "Gist group exposes your GitHub gists and automatically synchronizes them with GitHub.";
exports.GROUP_DESCR_UNCATEGORIZED = "Contains all snippets found on the web.";
exports.GROUP_DESCR_SUBLIME = "Contains all snippets from Sublime.";


exports.GIT_GIST_ID_PLACEHOLDER = "{/gist_id}";
exports.DEFAULT_THEME = "Eclipse";

exports.GIT_IMAGE = "app/img/github-code-image.png";
exports.SUBLIME_IMAGE = "app/img/sublime-code-image.png";
exports.MISC_IMAGE = "app/img/misc-code-image.png";

exports.TAG_DEFAULT = "HTML";

//Production GITHUB
exports.PROD_CLIENT_ID = nconf.get("github:production:client_id");
exports.PROD_CLIENT_SECRET = nconf.get("github:production:client_secret");

//DEVELOPMENT GITHUB
exports.DEV_CLIENT_ID = nconf.get("github:development:client_id");
exports.DEV_CLIENT_SECRET = nconf.get("github:development:client_secret");

//DEVELOPMENT/PRODUCTION GOOGLE
exports.GOOGLE_CLIENT_ID = nconf.get("google:client_id");
exports.GOOGLE_CLIENT_SECRET = nconf.get("google:client_secret");



