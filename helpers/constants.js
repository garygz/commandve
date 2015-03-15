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

//Production
exports.PROD_CLIENT_ID = '9e8ff83bdb61dae15c5c';
exports.PROD_CLIENT_SECRET = '13a3d9632063f5f9229c17e9b704d1c9ae620f1d';

exports.DEV_CLIENT_ID = 'cbe43cc5ac94c0d0f55b'
exports.DEV_CLIENT_SECRET = 'f19c8d822376c59a28d4730523f40e4d2061c516';



