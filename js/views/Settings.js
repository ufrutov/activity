var Settings = Backbone.View.extend({
	el: $('#settings-block'),
	template: 'settings',
	command: 'command-name',

	events: {
		'click #close-settings': 'destroy',
		'change #show-count'   : 'change_show',
		'blur .command-name'   : 'change_name',
		'click #add-command'   : 'add_command'
	},

	initialize: function(){
		_.bindAll(this, 'render');
		this.render();
	},

	change_show: function() {
		App.settings.count = $('#show-count').prop('checked');
	},

	change_name: function(e) {
		var id = $(e.currentTarget).data('id'),
			value = $(e.target).val();
		if( value.length >= 2 ) {
			App.settings.commands[id].set('name', value);
			$('#command'+id).html($(e.target).val());
		}
	},

	add_command: function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		if( App.settings.commands.length < 3 ) {
			var command = new Count({name: 'Новая команда', count: 0, id: 2});
			App.settings.commands.push(command);

			$.get("js/templates/" + this.command + ".html", function(template) {
	    		var input = _.template(template);
    			$('#commands').append(input({
    				i : 2,
    				id : command.get('id'),
    				name : command.get('name')
    			}));
	    	});
	    	$('#add-command').html('Удалить команду');
		} else {
			App.settings.commands.splice(2, 1);
			$('#commands > .input-group:nth-child(3)').remove();
			$('#add-command').html('Добавить команду');
		}
		App.update_commands();
	},

	destroy: function() {
		$(this.el).html('');
	},

	render: function() {
		var me = this,
			url = window.location.href;
		
		if( $.cookie('Activity') != undefined ) {
        	var cookie = JSON.parse($.cookie('Activity'));
        	App.settings.say = cookie.say;
        	App.settings.show = cookie.show;
        	App.settings.draw = cookie.draw;
		}

		var html = $.get("js/templates/" + me.template + ".html", function(template){
	      	$(me.el).html(template);

	      	$('#show-count').prop('checked', App.settings.count);
	    	
	    	$('#say-slide').noUiSlider({
				start: App.settings.say,
				step: 1,
				range: { 'min': 10, 'max': 120 }
			});
			$('#show-slide').noUiSlider({
				start: App.settings.show,
				step: 1,
				range: { 'min': 10, 'max': 120 }
			});
			$('#draw-slide').noUiSlider({
				start: App.settings.draw,
				step: 1,
				range: { 'min': 10, 'max': 120 }
			});

			$('.ui-slide').on({
				change: function(e, val){
					var v = Math.floor(val),
						id = e.target.id.split('-')[0];
					App.settings[id] = v;
					$('#'+id+'-time > i').html(v);
					App.set_cookie();
				}
			});
			$('#say-time > i').html(App.settings.say);
			$('#draw-time > i').html(App.settings.draw);
			$('#show-time > i').html(App.settings.show);

	    	$.get("js/templates/" + me.command + ".html", function(template) {
	    		var input = _.template(template);
	    		$.each(App.settings.commands, function(i, v) {
	    			$('#commands').append(input({
	    				i : i,
	    				id : v.get('id'),
	    				name : v.get('name')
	    			}));
	    		});
	    	});

	    	if(App.settings.commands.length > 2)
	    		$('#add-command').html('Удалить команду');
	    	else
	    		$('#add-command').html('Добавить команду');
	    });
	}

});