var App = Backbone.View.extend({
  el: $('#main'), // attaches `this.el` to an existing element.
  count: $('#count'),

  events: {
    'click #cards'      : 'get_cards',
    'click #logo'       : 'start_play',
    'click .count'      : 'change_count',
    'click #start-game' : 'start_play',
    'click #candy'      : 'candy',
    'click #reset-count': 'reset_count',
    'click #settings'   : 'open_settings'
  },

  initialize: function(){
    var me = this;
    _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods

    me.settings = {
      count   : true,
      draw    : 120,
      show    : 60,
      say     : 60,
      commands: []
    }

    if( $.cookie('Activity') != undefined ) {
      var cookie = JSON.parse($.cookie('Activity'));
      $.each(cookie, function(key, val) {
        switch (key) {
          case 'commands':
            break;
          default:
            me.settings[key] = val;
            break;
        }
      });
    }
    this.render(); // not all views are self-rendering. This one is.
  },

  get_cards: function() {
    new CardListView();
  },

  start_play: function() {
    new PlayView();
  },

  open_settings: function() {
    new Settings();
  },

  change_count: function(e) {
    if( $(e.target).hasClass('count') ) {
      if(!$('.count > span').is(":visible")) {
        $('.count > span').show();
        setTimeout(function() {
          $('.count > span').hide();
        }, 10000);
      }
    } else {
      var c = parseInt($(e.target).parent().find('font').html()),
        i = $(e.currentTarget).data('id');
      switch($(e.target).attr('class')) {
        case 'minus':
          if( c-1 > -1 ) {
           $(e.target).parent().find('font').html(c-=1);
           App.settings.commands[i].set('count', c, {'silent': true});
          }
          break;
        case 'plus':
          $(e.target).parent().find('font').html(c+=1);
          App.settings.commands[i].set('count', c, {'silent': true});
          break;
      }
      App.set_cookie();
    }
  },

  set_cookie: function() {
    var cookie = JSON.stringify(App.settings);
    $.cookie('Activity', cookie, {raw: true, json: true});
  },

  candy: function() {
    var me = this,
      url = window.location.href;
    $.ajax({
      url: url + 'db/index.php',
      data: {
        action  : 'candy',
        agent   : navigator.userAgent,
        platform: navigator.platform,
        time    : new Date()},
      type: 'post',
      success: function(output) {
        var data = $.parseJSON(output)[0];
        $('#candy').html('Спасибо, теперь у нас '+data['count']+' '+me.declOfNum(parseInt(data['count']), ['конфета', 'конфеты', 'конфет']));
        $('#candy').removeClass('btn-primary').addClass('btn-success');
      }
    });
  },

  update_commands: function(data) {
    var me = this;
    $('.count-items').html('');
    $.get("js/templates/count-item.html", function(item){
      var count_item = _.template(item);
      $.each(me.settings.commands, function(i, v) {
        $('.count-items').append(count_item({
          name : v.get('name'),
          count: v.get('count'),
          i    : i
        }));
      });
    });
    if(me.settings.commands.length > 2)
      $('.count-items').addClass('command3');
    else
      $('.count-items').removeClass('command3');

    App.set_cookie();
  },

  declOfNum: function(number, titles) {  
    var cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];  
  },

  reset_count: function() {
    if (window.confirm("Обнулить счет?")) {
      $.each(App.settings.commands, function(i, v) {
        v.set('count', 0);
      });
    }
  },

  render: function(){
    var me = this;
    // Add count block to the main View
    $.get("js/templates/count.html", function(template){
      if( $.cookie('Activity') != undefined ) {
        var cookie = JSON.parse($.cookie('Activity'));
        $.each(cookie.commands, function(i, v) {
          me.settings.commands.push(new Count({name: v.name, count: v.count, id: i}));
        });
      } else {
        me.settings.commands.push(new Count({name: 'Котята-утята', count: 0, id: 0}));
        me.settings.commands.push(new Count({name: 'Мальчики-зайчики', count: 0, id: 1}));
        
        App.set_cookie();
      }

      $(me.count).html(template);
      me.update_commands();
    });
  }
});

var App = new App();