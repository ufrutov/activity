var Count = Backbone.Model.extend({
    defaults: {
        name: "Command",
        count: 0
    },
    initialize: function(){
        this.on('change', this.change, this);
    },

    change:function(e) {
        var changed = Object.keys(e.changed)[0];
        switch (changed) {
            case 'count':
                var i = e.attributes.id;
                $($('font.count')[i]).html(e.changed.count);
                break;
        }

        App.set_cookie();
    }
});