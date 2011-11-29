new tool('General');

tools.General.current = null;
tools.General.runtime = {};

// settings
tools.General.settings = function() {
	tools.General.runtimeUpdate();
	tools['Settings'].heading(language.generalsSetName);
	tools['Settings'].text(language.generalsSetFavOnlyDesc);
	tools['Settings'].onoff(language.generalsSetFavOnlyAction, tools.General.runtime.onlyFavourites, 'onlyFavouritesGenerals', tools.General.runtimeUpdate);
};

tools.General.runtimeUpdate = function() {
	if(!tools.General.runtime) {
		tools.General.runtime = {};
	}
	tools.General.runtime.onlyFavourites = item.get('onlyFavouritesGenerals', 'false');
	tools.General.runtime.favourites = item.get('favouriteGenerals', []);
	if(!tools.General.runtime.general) {
		tools.General.runtime.general = {};
	}
};
//get current general from CA and set it in fb ui
tools.General.get = function() {
	if($('div[style*="general_plate.gif"] > div:first').length > 0) {
		tools.General.current = $('div[style*="general_plate.gif"] > div:first').text().trim();
		tools.General.set();
	}
};
// Set general image & name in fb ui
tools.General.set = function() {

	var _g = tools.General.runtime.general[tools.General.current];
	$('#cageGeneralImage').attr('src', _g.image);
	$('#cageGeneralName').text(tools.General.current);
	$('#cageGeneralAttack').text(_g.attack);
	$('#cageGeneralDefense').text(_g.defense);
};
// Set General by name
tools.General.setByName = function(_name, _callback) {
	if(_name !== tools.General.current) {
		var _g = tools.General.runtime.general[_name];
		if(_g !== null) {
			$('#cageGeneralImage').attr('src', 'http://image4.castleagegame.com/graphics/shield_wait.gif');
			$.get('generals.php?item=' + _g.item + '&itype=' + _g.itype + '&bqh=' + CastleAge.bqh + '&signed_request=' + CastleAge.signed_request, function(_data) {
				tools.General.parsePage(_data);
				tools.General.current = _name;
				tools.General.set();
				if(_callback !== undefined) {
					_callback();
				}
			});
		}
	}
};
// update generals object
tools.General.update = function() {
	if(CastleAge.signed_request !== null) {
		get('generals.php', function(_data) {
			tools.General.parsePage(_data);
		})
	} else {
		window.setTimeout(tools.General.update, 50);
	}
};
tools.General.parsePage = function(_data) {
	console.log('parse General page');
	_data = _data ? _data : $('#app_body');
	$('div.generalSmallContainer2 div.general_pic_div3', _data).each(function(i, e) {
		var $_this = $(this);
		var $_image = $('form:has(input[name="item"]) input.imgButton', e);
		var $_general = $_image.parents('div.generalSmallContainer2:first');
		var _image = $_image.attr('src');
		var _name = $_general.children('div.general_name_div3:first').text().trim();
		var _item = $_this.parent().find('input[name="item"]').attr('value');
		var _itype = $_this.parent().find('input[name="itype"]').attr('value');
		var _text = $_general.children('div:last').children('div').html().trim().replace(/<br>/g, ' ');
		var _stats = $_general.find('div.generals_indv_stats_padding');
		var _att = _stats.children('div:eq(0)').text().trim();
		var _def = _stats.children('div:eq(1)').text().trim();
		var _lvl = $_general.find('div:contains("Level"):last').text().trim();
		var _charge = $_general.find('div:contains("Charged"):last').text().trim();
		_charge = _charge.length > 0 ? /\d+/.exec(_charge) : null;
		tools.General.runtime.general[_name] = {
			name : _name,
			image : _image,
			item : _item,
			itype : _itype,
			attack : _att,
			defense : _def,
			text : _text,
			level : _lvl,
			charge : _charge
		};
	});
	$('#cageGeneralSelector').empty().append('<span id="cageSelectorInfo" class="ui-state-active ui-corner-all"></span><div id="cageFavouriteGenerals"></div><div id="cageAllGenerals"></div>');
	var _names = [];
	$.each(tools.General.runtime.general, function(_i, _e) {
		_names.push(_e.name);
	});
	_names.sort();
	for(var i = 0, len = _names.length; i < len; i++) {
		var _e = tools.General.runtime.general[_names[i]];
		$('#cageAllGenerals').append($('<span>').append($('<img class="cageSelectorImage ui-corner-all cageSelectorGeneral" src="' + _e.image + '" alt="' + _e.name + '" />').click(function() {
			console.log($(this).attr('alt'));
			tools.General.setByName($(this).attr('alt'));
			$('#cageGeneralSelector').slideToggle('slow');
		}).hover(function() {
			var _general = tools.General.runtime.general[$(this).attr('alt')];
			$(this).addClass('cageSelectorGeneralHover');
			$('#cageSelectorInfo').html(_general.name + ' (' + _general.level + ') <img src="http://image4.castleagegame.com/graphics/demi_symbol_2.gif" style="height:12px;"/> ' + _general.attack + ' <img src="http://image4.castleagegame.com/graphics/demi_symbol_3.gif" style="height:12px;"/> ' + _general.defense + ' - ' + _general.text);
		}, function() {
			$(this).removeClass('cageSelectorGeneralHover');
			$('#cageSelectorInfo').html('');
		})).append($('<img class="cageAddFavourite" src="' + 'resource://jid0-un8bmbr60nostzundr1tvlgn4hy-at-jetpack-cage-castle-age-game-enhancer-data/img/fav.png' + '" alt="' + _e.name + '" />').hover(tools.General.hoverAddIn, tools.General.hoverAddOut).click(tools.General.clickAdd)));
		if(_e.charge) {
			$('#cageAllGenerals span:last').append('<div class="cageCharge" style="height:' + (50 * _e.charge / 100) + 'px;' + (_e.charge < 100 ? '' : 'background-color:#4F4;') + '"></div>');
		}
	}
	if(tools.General.runtime.favourites && tools.General.runtime.favourites.length > 0) {
		var _tempFav = tools.General.runtime.favourites;
		tools.General.runtime.favourites = [];
		for(var i = 0, len = _tempFav.length; i < len; i++) {
			$('#cageAllGenerals > span > img.cageAddFavourite[alt="' + _tempFav[i] + '"]:first').click();
		}
	}
	tools.General.get();
};

tools.General.clickAdd = function() {
	tools.General.runtime.favourites.push($(this).attr('alt'));
	item.set('favouriteGenerals', tools.General.runtime.favourites.sort());
	$(this).mouseleave().parent().hide().clone(true, true).appendTo('#cageFavouriteGenerals').show().find('img.cageAddFavourite').unbind('click').click(tools.General.clickRemove).hover(tools.General.hoverRemoveIn, tools.General.hoverRemoveOut);
};
tools.General.clickRemove = function() {
	var _name = $(this).attr('alt');
	tools.General.runtime.favourites.splice(tools.General.runtime.favourites.indexOf(_name), 1);
	item.set('favouriteGenerals', tools.General.runtime.favourites);
	$(this).parent().hide().remove();
	$('#cageAllGenerals img[alt="' + _name + '"]:first').parent().show();
};
tools.General.hoverAddIn = function() {
	$('#cageSelectorInfo').html('Add ' + $(this).attr('alt') + ' to favourites');
	$(this).attr('src', 'resource://jid0-un8bmbr60nostzundr1tvlgn4hy-at-jetpack-cage-castle-age-game-enhancer-data/img/favadd.png');
};
tools.General.hoverAddOut = function() {
	$('#cageSelectorInfo').html('');
	$(this).attr('src', 'resource://jid0-un8bmbr60nostzundr1tvlgn4hy-at-jetpack-cage-castle-age-game-enhancer-data/img/fav.png');
};
tools.General.hoverRemoveIn = function() {
	$('#cageSelectorInfo').html('Remove ' + $(this).attr('alt') + ' from favourites');
	$(this).attr('src', 'resource://jid0-un8bmbr60nostzundr1tvlgn4hy-at-jetpack-cage-castle-age-game-enhancer-data/img/favdel.png');
};
tools.General.hoverRemoveOut = function() {
	$('#cageSelectorInfo').html('');
	$(this).attr('src', 'resource://jid0-un8bmbr60nostzundr1tvlgn4hy-at-jetpack-cage-castle-age-game-enhancer-data/img/fav.png');
};
// init general tool @fb
tools.General.init = function() {
	tools.General.runtimeUpdate();
	var _elm = {
		general : '<div id="cageGeneralContainer" class="ui-corner-br ui-widget-content"></div>',
		generalImageContainer : '<div id="cageGeneralImageContainer" class="ui-state-active ui-corner-all"></div>',
		generalImage : '<img id="cageGeneralImage" class="ui-corner-all" src="http://image4.castleagegame.com/graphics/shield_wait.gif"/>',
		generalName : '<span id="cageGeneralName" class="ui-state-active ui-corner-right"></span>',
		generalValues : '<span id="cageGeneralValues" class="ui-state-active ui-corner-br"><img src="http://image4.castleagegame.com/graphics/demi_symbol_2.gif" class="cageGeneralAttDefImg" /><span id="cageGeneralAttack" class="cageGeneralAttDefText"></span><img src="http://image4.castleagegame.com/graphics/demi_symbol_3.gif" class="cageGeneralAttDefImg" /><span id="cageGeneralDefense" class="cageGeneralAttDefText"></span></span>',
		generalSelector : '<div id="cageGeneralSelector" class="ui-widget-content ui-corner-bottom">',
	}
	$('#cageContainer').append($(_elm.general).prepend($(_elm.generalImageContainer).append(_elm.generalImage)).append(_elm.generalName).append(_elm.generalValues)).prepend(_elm.generalSelector);
	$('#cageGeneralImage').click(function() {
		if(tools.General.runtime.onlyFavourites == 'true') {
			$('#cageAllGenerals').hide();
		} else {
			$('#cageAllGenerals').show();
		}
		$('#cageGeneralSelector').slideToggle('slow');
	});
	tools.General.update();

};