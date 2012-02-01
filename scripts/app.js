$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

App = {
	url: function(url) {
		return 'http://localhost/ENT-sample-project/'+url;
	}
}

Backbone.emulateJSON = true;
TemplateManager = {
	init: function(key, callback) {
		var self = this;
		
		this.cache = (this.cache || {});

		if (!this.cache[key]) {
			$.get(App.url(key), function(template) {
				self.cache[key] = template;

				callback.call(this, template);
			});
		}
	},
	get: function(key) {
		return this.cache[key];
	}
}

// models

Link = Backbone.Model.extend({
	defaults: {
		title: '',
		url: ''
	}
});

// collections

LinkCollection = Backbone.Collection.extend({
	url: App.url('api/links'),
	model: Link
});

// views

LinkListView = Backbone.View.extend({
	events: {
		"submit .create form": "create"
	},
	initialize: function() {
		var self = this;
		
		this.ids = [];

		this.collection.on('reset', this.render, this);
		this.collection.on('add', this.render, this);
		this.collection.on('remove', this.remove, this);
	},
	create: function() {
		var values = this.$el.find('.create form').serializeObject();
		this.$el.find('.create form').find('input').val('');
		this.collection.create(values);
		return false;
	},
	remove: function(link) {
		this.$el.find('#link-'+link.id).remove();
	},
	render: function() {
		var self = this;
		_.forEach(this.collection.models, function(link) {
			if (!_.include(this.ids, link.id)) {
				this.$el.find('#links').append(new window.LinkItemView({ 
					model: link,
					collection: self.collection,
					id: 'link-'+link.id		
				}).render().el);
				this.ids.push(link.id);
			}
		}, this);
		
		this.$el.find('#links').sortable();

		return this;
	}
});

LinkItemView = Backbone.View.extend({
	tagName: 'li',
	className: 'link',
	events: {
		"click .delete": "remove"
	},
	remove: function() {
		this.model.destroy();
		this.collection.remove(this.model);
		return false;
	},
	initialize: function() {
		this.id = 'link-'+this.model.id;
		this.template = TemplateManager.get('member/link/item');
	},
	render: function() {
		this.$el.html(Mustache.render(this.template, this.model.toJSON()));
		return this;
	}
});

$(document).ready(function () {
	TemplateManager.init('member/link/item', function(templates) {
		links = new LinkCollection();

		linkListView = new window.LinkListView({
			el: '#page-content',
			collection: links
		});

		links.fetch();
	});
});
