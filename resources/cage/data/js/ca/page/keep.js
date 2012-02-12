// Keep
tools['Page'].runtime['keep.php'] = function() {

	window.setTimeout(function() {
		// Update potions
		tools.PotionStamina.work();
		tools.PotionEnergy.work();
		// folding units, items ...
		$('div.statsT2:has(div.statsTTitle)').css({
			'height' : 30,
			'overflow' : 'hidden',
			'cursor' : 'pointer'
		});
		// rearrange Items
		$('div.statUnit a img').unwrap().unwrap().addClass('ui-corner-all');
		$('div.statUnit').find('div:last:contains(X)').addClass('itemNumbers');
		// Collapsed items/untits ...
		$('div.statsTTitle').toggle(function() {
			$(this).parents('div.statsT2:first').css({
				'height' : '100%'
			});
		}, function() {
			$(this).parents('div.statsT2:first').css({
				'height' : 30
			});
		});
	}, 50);
	// Some more stats, like BSI, LSI... keep_data.attribute_section
	var _data = {};
	_data.lvl = $('#st_5 div:contains("Level"):last').text();
	_data.stats = $('div.keep_attribute_section');
	console.log(_data);
	if(_data.lvl && _data.stats.length > 0) {
		_data.lvl = parseInt(_data.lvl.match(/\d+/)[0], 10);
		//stats
		_data.stats = $('div.attribute_stat_container', _data.stats);
		_data.eng = parseInt(_data.stats.eq(0).text(), 10);
		_data.sta = parseInt(_data.stats.eq(1).text(), 10);
		_data.att = /(\d+)(?:\s\((.\d+)?\))?/.exec(_data.stats.eq(2).text());
		_data.att = parseInt(_data.att[1], 10) + (_data.att[2] == undefined ? 0 : parseInt(_data.att[2], 10));
		//_data.def = parseInt(_data.stats.eq(3).text(), 10);
		_data.def = /(\d+)(?:\s\((.\d+)?\))?/.exec(_data.stats.eq(3).text());
		_data.def = parseInt(_data.def[1], 10) + (_data.def[2] == undefined ? 0 : parseInt(_data.def[2], 10));
		//calculated stats
		_data.eAt = _data.att + _data.def * 0.7;
		_data.eDe = _data.def + _data.att * 0.7;
		_data.bsi = Math.round((_data.att + _data.def) / _data.lvl * 100) / 100;
		_data.lsi = Math.round((_data.eng + _data.sta * 2) / _data.lvl * 100) / 100;
		_data.tsi = _data.bsi + _data.lsi;
		$('div.keep_healer_section').prepend($('<div id="cageKeepStats">').css({
			'backgroundColor' : '#000',
			'marginLeft' : 26,
			'marginTop' : -232,
			'opacity' : 0.8,
			'color' : 'white',
			'textAlign' : 'left',
			'padding' : 10,
			'height' : 204,
			'width' : 180
		}).append('<div>eAtt: ' + _data.eAt.toFixed(2) + '</div><div style="font-size:9px;">Effective Attack</div>').append('<div>eDef: ' + _data.eDe.toFixed(2) + '</div><div style="font-size:9px;">Effective Defense</div>').append('<div>BSI: ' + _data.bsi.toFixed(2) + '</div><div style="font-size:9px;">Battle Strength Index</div>').append('<div>LSI: ' + _data.lsi.toFixed(2) + '</div><div style="font-size:9px;">Levelling Speed Index</div>').append('<div>TSI: ' + _data.tsi.toFixed(2) + '</div><div style="font-size:9px;">Total Skillpoints per Level</div>'));
		_data = undefined;
	} else {
		_data = undefined;
	}

	// Add stuff on others keep
	if($('div.keep_main_section').length == 0) {
		var _uid = $('td.statsTB > div *[uid]').attr('uid');
		if($('#keep_battle_frm1').length == 0) {
			$('td.statsTB > div:eq(1)').append($('<div id="cageArmyKeep"><button>DISMISS</button></div>').click(function() {
				$('#AjaxLoadIcon').show();
				get('army_member.php?action=delete&player_id=' + _uid, function() {
					tools.Page.loadPage('keep.php?user=' + _uid);
				});
			}));
		} else {
			tools.Facebook.CAPlayers(function(_ids) {
				if(_ids.indexOf(_uid) !== -1) {
					$('td.statsTB > div:eq(1)').append($('<div id="cageArmyKeep"><button>JOIN ARMY</button></div>').click(function() {
						$('#AjaxLoadIcon').show();
						get('party.php?twt=jneg&jneg=true&user=' + _uid + '&lka=' + _uid + '&etw=9&ref=nf', function() {
							tools.Page.loadPage('keep.php?user=' + _uid);
						});
					}));
				}
			});
		}
	}

};
