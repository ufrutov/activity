var PlayView = Backbone.View.extend({
	el: $('#play'),
	viewport: {},
	template: 'play-block',
	card: {},

	events: {
		'click #close-play'            : 'destroy',
		'click #start'                 : 'startPlay',
		'click img.cards'              : 'startPlay',
		'click #get-other'             : 'get_card',
		'click #play'                  : 'start',
		'click #point'                 : 'add_point',
		'click #word'                  : 'decode_word',
		'click .progress'  			   : 'stop',
		'click .progress-buttons .btn' : 'get_card',
		'click #win-btn'			   : 'show_count'
	},

	initialize: function(){
		_.bindAll(this, 'render');
		this.render();
	},

	get_card: function(e) {
		if($(e.currentTarget).data('next'))
			this.card.get_card(true);
		else 
			this.card.get_card(false);
	},

	add_point: function(e) {
		this.card.add_point(e);
	},

	start: function() {
		this.card.start();
	},

	stop: function() {
		this.card.stop();
	},

	show_count: function() {
		this.card.show_count();
	},

	decode_word: function(e) {
		this.card.decode_word($(e.currentTarget).hasClass('encoded'));
	},

	destroy: function() {
		$(this.el).html('');
	},

	startPlay: function(e) {
		e.preventDefault();
		e.stopImmediatePropagation();

		$(this.viewport).html('<img class="loading" src="img/load.gif" />');
		this.card = new Card();

		return false;
	},

	render: function() {
		var me = this,
			url = window.location.href;

		$.get("js/templates/" + me.template + ".html", function(template){
	      	$(me.el).html(template);
	      	me.viewport = $('#play-block');
	    });
	}

});