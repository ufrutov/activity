var Card = Backbone.View.extend({
	el: $('#play-block'),
	template: 'card',
	progress: {},
	params: 'card-params',
	next: 'get-next',
	run: false,
	word: '',
	interval_status: 1,
	current: {},
	events: {

	},

	initialize: function(){
		_.bindAll(this, 'render');
		this.render();
	},

	destroy: function() {
		$(this.el).html('');
	},

	add_point: function(e) {
		var me = this,
			cnt = $(e.currentTarget).data('cnt'),
			i = $(e.currentTarget).data('command');
		App.settings.commands[i].set('count', cnt+=1);
		$('.card-body > nav').html('<button type="button" class="btn btn-info" id="get-other" data-next="true">Выбрать следующую</button>');

		App.set_cookie();
	},

	start: function() {
		var me = this;
		$('#close-play').hide();
		// Encode word

		$('#word').html( me.encode_word($('#word').html()) );
		$('#word').addClass('encoded');

		App.getTemplate('progress', function(template){
	      	$('.card-body > nav').html(template);
	      	var i = 1;
	      	me.progress = setInterval(function() {
	      		me.interval(i);
	      		i++;
	      	}, 1000);
	      	me.run = true;
	    });
	},

	stop: function() {
		var me = this;
		if( me.run ) {
			clearInterval(me.progress);
			me.run = false;
			$('.progress .progress-bar').addClass('progress-bar-warning');
			$('.progress-buttons').show();
		} else {
			me.progress = setInterval(function() {
				me.interval(me.interval_status);
	      		me.interval_status++;
			}, 1000);
			me.run = true;
			$('.progress .progress-bar').removeClass('progress-bar-warning');
			$('.progress-buttons').hide();
		}
	},

	interval: function(i) {
		var me = this,
			time = App.settings[this.current],
			limit = Math.floor((time*80)/100);
		me.interval_status = i;
		if(i > time) {
			try {
				if( App.settings.sound )
					AndroidAudio.playAudio($('#beep source').attr('src'));
				// $('#beep')[0].play();
			} catch(e) {
				console.error('[E] Error on play audio: ', e);
			}
  			clearInterval(me.progress);
  			$('#close-play').show();

				App.getTemplate(me.next, function(template){
  				var btn = _.template(template);
  				$('.card-body > nav').html('');
  				$.each(App.settings.commands, function(i, v) {
  					$('.card-body > nav').append(btn({
  						name : v.get('name'),
  						count: v.get('count'),
  						i    : i
  					}));
  				});
  				$('.card-body > nav').append('<div class="no-one"><button type="button" id="get-other" class="btn btn-default btn-xs non-command" data-next="true">Выбрать другую карточку</button></div>');
  			});
  		}
  		if(i == limit)
  			$('.progress .progress-bar').addClass('progress-bar-danger').removeClass('progress-bar-success');

  		$('.progress .progress-bar').css('width', (i*100/time)+'%').attr('aria-valuenow', i);
	},

	show_count: function() {
		var me = this;

		me.stop();
		clearInterval(me.progress);

		$('#close-play').show();

		App.getTemplate(me.next, function(template){
			var btn = _.template(template);
			$('.card-body > nav').html('');
			$.each(App.settings.commands, function(i, v) {
				$('.card-body > nav').append(btn({
					name : v.get('name'),
					count: v.get('count'),
					i    : i
				}));
			});
			$('.card-body > nav').append('<div class="no-one"><button type="button" id="get-other" class="btn btn-default btn-xs non-command" data-next="true">Выбрать другую карточку</button></div>');
		});
	},

	get_card: function(btn) {
		if( !activity_words && activity_words.length == 0 ) {
			console.error('[E] Activity Words data is missing! Check db/words.json file.');
			return;
		}

		var index = Math.floor(Math.random() * activity_words.length);
		var me = this;

		$('#close-play').show();

		var data = activity_words[index];

		$('#card-id').html(data.id);
		$('#word').html(data.word);
		$('#word').removeClass('encoded');
		me.word = data.word;

		if(btn) {
			App.getTemplate('card-buttons', function(template){
				$('.card-body > nav').html(template);
			});
		}

		App.getTemplate(me.params, function(template){
	      	var parameters = _.template(template),
	      		common = Math.floor(Math.random() * 3) + 1, // 1 to 3
	      		params = [0, 0, 0];
	      	params[(Math.floor(Math.random() * 3) + 1) - 1] = 1;

	      	$('.parameters').html(parameters({
	      		common: common == 1 ? 1 : 0,
	      		draw  : params[0],
				say   : params[1],
				show  : params[2]
	      	}));
	      	switch (params.indexOf(1)) {
	      		case 0:
	      			me.current = 'draw';
	      			break;
	      		case 1:
	      			me.current = 'say';
	      			break;
	      		case 2:
	      			me.current = 'show';
	      			break;
	      	}
	    });

		return false;
	},

	render: function(e) {
		var me = this;
		me.el = $('#play-block');
		App.getTemplate(me.template, function(template){
	      	$(me.el).html(template);
	      	me.get_card(false);
	    });
	    return false;
	},

	encode_word: function(w) {
		var out = [];
		$.each(w.split(''), function(i, v) {
			if(/[\wа-я]+/ig.test(v))
				out.push('*');
			else
				out.push(v);
		});
		return out.join('');
	},

	decode_word: function(e) {
		var me = this;
		if(e) {
			$('#word').html( me.word );
			$('#word').removeClass('encoded');
		} else {
			$('#word').html( me.encode_word($('#word').html()) );
			$('#word').addClass('encoded');
		}

	}

});
