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

  templates: [
    'card-buttons',
    'card-params',
    'card',
    'cards-block',
    'cards-list-content',
    'cards-list',
    'command-name',
    'count-item',
    'count',
    'edit-modal',
    'get-next',
    'new-card',
    'play-block',
    'play-start',
    'progress',
    'settings'
  ],

  initialize: function(){
    var me = this;
    _.bindAll(this, 'render'); // fixes loss of context for 'this' within methods

    me.settings = {
      count   : true,
      sound   : true,
      draw    : 120,
      show    : 60,
      say     : 60,
      commands: []
    }

    if( $.cookie('Activity') != undefined ) {
      var cookie = [];
      try {
        cookie = JSON.parse($.cookie('Activity'));
      } catch (e) {
        console.warn('[E] Initialize cookie error: ', e);
      }
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
           this.settings.commands[i].set('count', c, {'silent': true});
          }
          break;
        case 'plus':
          console.log('[this.settings.commands]', this.settings.commands[i]);
          $(e.target).parent().find('font').html(c+=1);
          this.settings.commands[i].set('count', c, {'silent': true});
          break;
      }
      this.set_cookie();
    }
  },

  set_cookie: function() {
    var cookie = {};

    cookie.commands = [];

    for(var key in this.settings) {
      switch (key) {
        case 'commands':
          $.each(this.settings[key], function(i, r) {
            cookie[key].push(r.attributes);
          });
          break;
        default:
          cookie[key] = this.settings[key];
      }
    }
    console.log('[set_cookie]', cookie);
    $.cookie('Activity', JSON.stringify(cookie), {raw: true, json: true});
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
    me.getTemplate('count-item', function(item){
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

    this.set_cookie();
  },

  declOfNum: function(number, titles) {
    var cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
  },

  reset_count: function() {
    var me = this;
    if (window.confirm("Обнулить счет?")) {
      $.each(me.settings.commands, function(i, v) {
        console.log('[count]', v);
        v.set('count', 0);
      });
    }
  },

  loadTemplates: function() {
    $.each(this.templates, function(i, t) {
      var link = document.createElement('link');
      link.setAttribute('href','js/templates/'+t+'.html');
      link.setAttribute('id','tmp-'+t);
      link.setAttribute('rel','import');
      document.head.appendChild(link);
    });
  },

  getTemplate: function(id, callback) {
    var me = this;
    id = 'tmp-'+id;
    if( document.getElementById(id).import != null )
      callback(me.convertTemplate(document.getElementById(id).import.body.innerHTML));
    else {
      document.getElementById(id).onload = function() {
        callback(me.convertTemplate(document.getElementById(id).import.body.innerHTML));
      };
    }
  },

  convertTemplate: function(str) {
    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&quot;/g, "\"");
    str = str.replace(/&#039;/g, "'");
    return str;
  },

  isFunction: function(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	},

  render: function(){
    var me = this;

    me.loadTemplates();
    // Add count block to the main View
    me.getTemplate('count', function(template) {
      console.log('1 >>> [render]', $.cookie('Activity'));
      if( $.cookie('Activity') != undefined ) {
        var cookie = {};
        try {
          cookie = JSON.parse($.cookie('Activity'));
          console.log('2 >>> [try]', cookie);
        } catch (e) {
          console.error('[E] Render function cookie error', e);

          me.settings.commands.push(new Count({name: 'Котята-утята', count: 0, id: 0}));
          me.settings.commands.push(new Count({name: 'Мальчики-зайчики', count: 0, id: 1}));
          console.log(me.settings);
          me.set_cookie();
        }
        console.log('2.1 >>> [commands]', cookie.hasOwnProperty('commands'), cookie.commands);
        if( cookie.hasOwnProperty('commands') && cookie.commands.lenght > 0 ) {
          console.log('3 >>> [commands]', cookie.commands);
          $.each(cookie.commands, function(i, v) {
            me.settings.commands.push(new Count({name: v.name, count: v.count, id: i}));
          });
          me.set_cookie();
        } else {
          console.log('3 >>> [empty commands]');
          me.settings.commands.push(new Count({name: 'Котята-утята', count: 0, id: 0}));
          me.settings.commands.push(new Count({name: 'Мальчики-зайчики', count: 0, id: 1}));

          me.set_cookie();
        }
      } else {
        me.settings.commands.push(new Count({name: 'Котята-утята', count: 0, id: 0}));
        me.settings.commands.push(new Count({name: 'Мальчики-зайчики', count: 0, id: 1}));

        me.set_cookie();
      }
      console.log('[render FINISH]', me.settings, cookie);
      $(me.count).html(template);
      me.update_commands();
    });
  }
});

var App = new App();
