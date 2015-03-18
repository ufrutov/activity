var CardListView = Backbone.View.extend({
	el: $('#card-list'),
	template: 'cards-block',
	list_template: 'cards-list',
	list_template_content: 'cards-list-content',
	autocomplete: [],

	events: {
		'click #close-cards': 'destroy',
		'click #add-card'   : 'addCard',
		'click .list'       : 'edit_card',
		'click #cancel'		: 'cancel_edit',
		'click #save'		: 'save_edit',
		'click #delete'		: 'delete_card',
		'focus #new-word'   : 'focus_word',
		'keyup #new-word'   : 'enter_word'
	},

	initialize: function(){
		_.bindAll(this, 'render');
		$('#new-word').on('change', this.input_word, this);
		this.render();
	},

	destroy: function() {
		$(this.el).html('');
	},

	edit_card: function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		var me = this,
			url = window.location.href,
			id = $(e.currentTarget).data('id');
		$.ajax({
				url: url + 'db/index.php',
				data: {
					action: 'get_card_by_id',
					id: id
				},
				type: 'post',
				success: function(output) {
					var data = $.parseJSON(output)[0];
					$.get("js/templates/edit-modal.html", function(template){
						var temp = _.template(template);
						
						$('#modal').html(temp({
							id: data['id'],
							word: data['word'],
							draw: data['draw'],
							say: data['say'],
							show: data['show']
						}));
					});

				}
			});

		return false;
	},

	save_edit: function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		
		var me = this,
			url = window.location.href,
			id = $(e.currentTarget).data('id'),
			word = $('.word-input').val(),
			draw = ($('.modale [name=draw]').is(':checked')) ? 1 : 0,
			say = ($('.modale [name=say]').is(':checked')) ? 1 : 0,
			show = ($('.modale [name=show]').is(':checked')) ? 1 : 0;

		if( (word.length != 0) && $('.modale [type=checkbox]').is(':checked') ) {
			$.ajax({
				url: url + 'db/index.php',
				data: {
					action: 'edit_card',
					id: id,
					word: word,
					draw: draw,
					say : say,
					show: show
				},
				type: 'post',
				success: function(output) {
					var data = $.parseJSON(output);
					$('#modal').html('');
					$.get("js/templates/" + me.list_template_content + ".html", function(list){
						var template = _.template(list),
							li = $('.list[data-id='+data['id']+']');
						li.html(template({
							word: data['word'],
							draw: data['draw'],
							say : data['say'],
							show: data['show']
						}));
					});
				}
			});
		}

		return false;
	},

	cancel_edit: function() {
		$('#modal').html('');
	},

	delete_card: function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		var me = this,
			url = window.location.href,
			id = $(e.currentTarget).data('id');
		if (window.confirm("Удалить карточку?")) { 
			$.ajax({
				url: url + 'db/index.php',
				data: {
					action: 'delete_card',
					id: id
				},
				type: 'post',
				success: function(output) {
					var data = $.parseJSON(output);
					$('#modal').html('');
					$('.list[data-id='+data['id']+']')[0].remove();
				}
			});
		}

		return false;
	},

	// Add new card to data base
	addCard: function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		
		var me = this,
			url = window.location.href,
			params = $('#card-form').serializeArray();

		if(params[0].value.length != 0 && $('#card-form [type=checkbox]').is(':checked') ) {
			$('#cards-count').html('<img src="img/loading.gif"/>');
			$.ajax({
				url: url + 'db/index.php',
				data: {
					action: 'add_card',
					word  : $('#card-form [name=word]').val(),
					draw  : ($('#card-form [name=draw]').is(':checked')) ? 1 : 0,
					say   : ($('#card-form [name=say]').is(':checked')) ? 1 : 0,
					show  : ($('#card-form [name=show]').is(':checked')) ? 1 : 0
				},
				type: 'post',
				success: function(output) {
					
					var data = $.parseJSON(output);

					$('#cards-count').html(data['count']);
					$('#card-form')[0].reset();

					$.get("js/templates/" + me.list_template + ".html", function(list){
						var template = _.template(list);
						$('#card-listing > ul').prepend(template({
							id: data['id'],
							word: data['word'],
							draw: data['draw'],
							say : data['say'],
							show: data['show']
						}));
					});
				}
			});
		}

		return false;
	},

	focus_word: function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		var me = this,
			url = window.location.href;

		$.ajax({
				url: url + 'db/index.php',
				data: {action: 'get_cards'},
				type: 'post',
				success: function(output) {
					var data = $.parseJSON(output);
					
					me.autocomplete = [];
					
					$.each(data, function(i, v) {
						me.autocomplete.push(v.word);
					});
				}
			});

		return false;
	},

	enter_word: function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();
		
		var me = this,
			input = $(e.currentTarget).val(),
			complete = [];
		
		$('#autocomplete').html('');

		if ( input.length > 2 ) {
			
			$.each(me.autocomplete, function(i, v) {
				if( v.toLowerCase().match(input.toLowerCase()) )
					complete.push(v);
			});

			if ( complete.length > 0 )
				$('#autocomplete').html('<ul></ul>');

			$.each(complete, function(i, v) {
				$('#autocomplete ul').append('<li>'+v+'</li>');
			});

		}

		return false;
	},

	render: function() {
		var me = this,
			url = window.location.href;
			
		var html = $.get("js/templates/" + me.template + ".html", function(template){
	      	$(me.el).html(template);

	      	$.ajax({
				url: url + 'db/index.php',
				data: {action: 'get_cards'},
				type: 'post',
				success: function(output) {
					var data = $.parseJSON(output);
					$('#cards-count').html(data.length);
					$('#card-listing').html('<ul></ul>');
					$.get("js/templates/" + me.list_template + ".html", function(list){

						var template = _.template(list);
						$.each(data.reverse(), function(i) {
							$('#card-listing > ul').append(template({
								id  : data[i]['id'],
								word: data[i]['word'],
								draw: data[i]['draw'],
								say : data[i]['say'],
								show: data[i]['show']
							}));
						});
					});
				}
			});
	    });
	}

});