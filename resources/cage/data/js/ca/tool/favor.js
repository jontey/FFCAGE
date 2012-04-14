tool('Favor');

tools.Favor.init = function() {
	tools.Favor.runtimeUpdate();
	$('#cageSidebarStats').append($('<div id="cageStatsFavor" class="cageSidebarStat"><div>Favor Points</div><span></span></div>')).append($('<button id="cageFavorLogo" title=""><span id="cageFavorPoints"></span></button>').click(function() {
		tools.Page.loadPage('oracle.php');
	}));
	// stamina
	$('<input type="image" title="Refill stamina for 10FP" src="http://image4.castleagegame.com/graphics/stat_stamina.gif">').click(function() {
		var $this = $(this);
		$this.attr('src', 'http://image4.castleagegame.com/graphics/shield_wait.gif').mouseleave().attr('disabled', 'disabled');
		tools.Sidebar.smallDialog('Stamina Refill', 'Do you really want to use 10 favor points to buy a stamina refill?', function() {
			//ok
			get('oracle.php?', function(_oracle) {//option=1&buychoice=6
				addFunction(function(data) {
					cageStat.stamina = data.stamina;
				}, JSON.stringify({
					stamina : parseInt($(_oracle).find('span[id="stamina_current_value"]').text(), 10) + 5000
				}), true, true);
				$('#cageFavorPoints').text($(_oracle).find('div[id="main_bn"] div[style*="persistent_bar_oracle.gif"]').text().trim());
				$this.attr('src', 'http://image4.castleagegame.com/graphics/stat_stamina.gif').removeAttr('disabled');
			});
		}, {
			'backgroundImage' : 'url(\'http://image4.castleagegame.com/graphics/quick_buy_button.jpg\')',
			'width' : 97
		}, function() {
			//cancel
			$this.attr('src', 'http://image4.castleagegame.com/graphics/stat_stamina.gif').removeAttr('disabled');
		}, {
			'top' : 160
		});
	}).hover(function() {
		$(this).stop().animate({
			'height' : 28,
			'top' : -2,
			'marginRight' : -4,
			'marginLeft' : -1
		}, 'fast');
	}, function() {
		$(this).stop().animate({
			'height' : 20,
			'top' : '',
			'marginRight' : '',
			'marginLeft' : 3
		}, 'fast');
	}).appendTo('#cageStatsFavor span');
	// energy
	$('<input type="image" title="Refill energy for 10FP" src="http://image4.castleagegame.com/graphics/stat_energy.gif">').click(function() {
		var $this = $(this);
		$this.attr('src', 'http://image4.castleagegame.com/graphics/shield_wait.gif').mouseleave().attr('disabled', 'disabled');
		tools.Sidebar.smallDialog('Refill Energy', 'Do you really want to use 10 favor points to buy a energy refill?', function() {
			//ok
			get('oracle.php?', function(_oracle) {//option=2&buychoice=6
				addFunction(function(data) {
					cageStat.energy = data.energy;
				}, JSON.stringify({
					energy : parseInt($(_oracle).find('span[id="energy_current_value"]').text(), 10) + 5000
				}), true, true);
				$('#cageFavorPoints').text($(_oracle).find('div[id="main_bn"] div[style*="persistent_bar_oracle.gif"]').text().trim());
				$this.attr('src', 'http://image4.castleagegame.com/graphics/stat_energy.gif').removeAttr('disabled');
			});
		}, {
			'backgroundImage' : 'url(\'http://image4.castleagegame.com/graphics/quick_buy_button.jpg\')',
			'width' : 97
		}, function() {
			//cancel
			$this.attr('src', 'http://image4.castleagegame.com/graphics/stat_energy.gif').removeAttr('disabled');
		}, {
			'top' : 160
		});
	}).hover(function() {
		$(this).stop().animate({
			'height' : 28,
			'top' : -2,
			'marginRight' : -4,
			'marginLeft' : -1
		}, 'fast');
	}, function() {
		$(this).stop().animate({
			'height' : 20,
			'top' : '',
			'marginRight' : '',
			'marginLeft' : 3
		}, 'fast');
	}).appendTo('#cageStatsFavor span');
}
tools.Favor.runtimeUpdate = function() {
	tools.Favor.runtime = {};
};
tools.Favor.done = function() {
	$('#cageFavorLogo').css({
		'cursor' : 'pointer',
		'backgroundImage' : 'url(\'http://image4.castleagegame.com/graphics/favor_icon.jpg\')'
	}).removeAttr('disabled');
};
/*
 demi_symbol_2.gif (army)
 stat_gold.gif
 */