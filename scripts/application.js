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

Backbone.emulateJSON = true;

Backbone.LayoutManager.configure({
	render: function(template, context) {
		return Mustache.render(template, context);
	}
});

Backbone.LayoutManager.View.prototype.serialize = function() {
	return this.model ? this.model.toJSON() : this.model;
};

var app = {};

jQuery(function($) {
	var Router = Backbone.Router.extend({
		routes: {
			"": "index",
			"show/:id": "show"
		},

		index: function() {
			var main = new Backbone.LayoutManager({
				template: "#main"
			});

			app.links = new Link.Collection();

			
			var list = main.view('.list', new Link.Views.List({ collection: app.links }));
			var detail = main.view('.detail', new Link.Views.Detail());
			var create = main.view('.create', new Link.Views.Create({ collection: app.links }));

			list.bind('update', function(model) {
				detail.model = model;
				detail.render();
			});

			main.render(function(contents) {
				$('#page-wrapper').html(contents);
			});

			app.links.fetch().success(function() {
				detail.model = app.links.at(0);
				detail.render();
			});
		},
		
		show: function(id) {
			var detailed = new Backbone.LayoutManager({
				template: "#detailed"
			});

			var detail = detailed.view('.detailed', new Link.Views.Detail({ model: app.links.get(id) }));

			detailed.render(function(contents) {
				$('#page-wrapper').html(contents);
			});
		}
	});

	app.router = new Router();
	
	Backbone.history.start({ pushState: true, root: '/ENT-sample-project/member/link/view/' });

	app.router.navigate("");
});

Helper = {
	url: function(url) {
		return 'http://localhost/ENT-sample-project/'+url;
	}
}

Link = {};

Link.Model = Backbone.Model.extend({
	defaults: {
		title: '',
		url: ''
	}
});

Link.Collection = Backbone.Collection.extend({
	url: Helper.url('api/links'),
	model: Link.Model
});

Link.Views = {};

Link.Views.Create = Backbone.LayoutManager.View.extend({
	template: '#create',

	events: {
		'submit form': 'create'
	},

	create: function() {
		var values = this.$el.find('form').serializeObject();
		this.$el.find('form input').val('');

		this.collection.create(values);

		return false;
	}
});

Link.Views.List = Backbone.LayoutManager.View.extend({
	template: '#list',

	events: {
		'click li a': 'update'
	},

	initialize: function() {
		this.collection.bind('add', function() {
			this.render();
		}, this);
		
		this.collection.bind('reset', function() {
			this.render();
		}, this);
		
		this.collection.bind('remove', function() {
			this.render();
		}, this);
	},

	update: function(event) {
		var id = $(event.target).attr('rel');
		var model = this.collection.get(id);
		
		this.trigger('update', model);

		return false;
	},

	serialize: function() {
		return { links: this.collection.toJSON() };
	}
});

Link.Views.Detail = Backbone.LayoutManager.View.extend({
	template: '#detail',

	events: {
		'click a.show': 'show',
		'click a.remove': 'remove'
	},

	remove: function() {
		this.model.destroy();
		
		app.links.remove(this.model);

		this.model = app.links.at(0);
		this.render();

		return false;
	},

	show: function() {
		app.router.navigate('show/' + this.model.id, true);

		return false;
	}
});
