// CAGE stuff working on Castle Age site
var CastleAge = {
	bqh : null,
	signed_request : null,
	userId : null,
	inGuild : null,
	startInterval : null,
	started : false
};

com.initPort(com.port.castleAge);

var _append = '';
$.each(['css/cage.css', 'css/ca_cage.css', 'css/ca_stats.css', 'css/ca_general.css', 'css/ca_monster.css', 'css/ui.selectmenu.css', 'css/settings.css'], function(_i, _e) {
	_append += '<link rel="stylesheet" type="text/css" href="' + getPath(_e) + '?_=' + Math.random() + '" >';
});
_append += '<link id="cageTheme" rel="stylesheet" type="text/css" href="' + getPath('css/dark-hive/jquery-ui.css') + '" >';
_append += '<script type="text/javascript" language="javascript" src="' + getPath('js/jquery.js') + '"></script>';
$(document.body).append($('<input>').attr({
	'id' : 'signed_request',
	'type' : 'hidden'
})).append(_append);
_append = _css = undefined;

// Add CAGE container / repos menu
$('center:first').prepend('<div id="cageContainer"><div id="cageStatsContainer"></div><div id="cageToolsContainer" class="ui-widget-content ui-corner-bottom"><a target="_blank" href="http://cagenhancer.blogspot.com/"><img id="cageLogoShadow" src="' + getPath('img/icon64shadow.png') + '"><img id="cageLogo" src="' + getPath('img/icon64.png') + '"></a></div></div>');

CastleAge.startInterval = window.setInterval(function() {
	if(CastleAge.signed_request !== null && CastleAge.userId !== null) {
		window.clearInterval(CastleAge.startInterval);
		window.setInterval(function() {
			com.send(com.task.alive, com.port.facebook, null);
		}, 10000);
		initTools();
		var _startURL = $('#current_pg_url').attr('value');
		if(_startURL.indexOf('?') !== -1) {
			_startURL = _startURL.substring(0, _startURL.indexOf('?'));
		}
		console.log("URL:" + _startURL);
		tools.Page.runtime.allPages();
		if(tools.Page.runtime[_startURL]) {
			tools.Page.runtime[_startURL]();
		}
		_startURL = undefined;
	} else {
		com.send(com.task.castleAgeReady, com.port.facebook);
	}
}, 100);
