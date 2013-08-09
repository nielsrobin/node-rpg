var app = angular.module('app', ['ngResource','ngSanitize']);

app.config(function ($routeProvider) {
	$routeProvider.
	  when('/', {templateUrl: 'partial/home.html'}).
	  when('/admin', {templateUrl: 'partial/admin.html'}).
	  when('/admin/components', {controller: CompCtrl, templateUrl: 'partial/components/list.html'}).
    when('/admin/components/equipment/create', {controller: EquipCreateCtrl, templateUrl: 'partial/components/create-update.html'}).
    when('/admin/components/equipment/update/:id', {controller: EquipUpdateCtrl, templateUrl: 'partial/components/create-update.html'}).
    when('/admin/components/consumable/create', {controller: ConsumableCreateCtrl, templateUrl: 'partial/components/create-update.html'}).
    when('/admin/components/consumable/update/:id', {controller: ConsumableUpdateCtrl, templateUrl: 'partial/components/create-update.html'}).
    when('/admin/npcs', {controller: NpcsCtrl, templateUrl: 'partial/tiles/list.html'}).
    when('/admin/npcs/create', {controller: NpcsCreateCtrl, templateUrl: 'partial/tiles/create-update.html'}).
    when('/admin/npcs/update/:id', {controller: NpcsUpdateCtrl, templateUrl: 'partial/tiles/create-update.html'}).
    when('/admin/items', {controller: ItemsCtrl, templateUrl: 'partial/tiles/list.html'}).
    when('/admin/items/create', {controller: ItemsCreateCtrl, templateUrl: 'partial/tiles/create-update.html'}).
    when('/admin/items/update/:id', {controller: ItemsUpdateCtrl, templateUrl: 'partial/tiles/create-update.html'}).
    when('/admin/tiles', {controller: TilesCtrl, templateUrl: 'partial/tiles/list.html'}).
    when('/admin/tiles/create', {controller: TilesCreateCtrl, templateUrl: 'partial/tiles/create-update.html'}).
    when('/admin/tiles/update/:id', {controller: TilesUpdateCtrl, templateUrl: 'partial/tiles/create-update.html'}).
    when('/admin/acts', {controller: ActsCtrl, templateUrl: 'partial/acts/list.html'}).
    when('/admin/acts/create', {controller: ActsCreateCtrl, templateUrl: 'partial/acts/create-update.html'}).
    when('/admin/acts/update/:id', {controller: ActsUpdateCtrl, templateUrl: 'partial/acts/create-update.html'}).
    when('/admin/acts/:id', {controller: ActCtrl, templateUrl: 'partial/acts/read.html'}).
    when('/admin/scenes/create/:actId', {controller: ScenesCreateCtrl, templateUrl: 'partial/scenes/create-update.html'}).
    when('/admin/scenes/update/:actId/:id', {controller: ScenesUpdateCtrl, templateUrl: 'partial/scenes/create-update.html'}).
    when('/admin/scenes/area/:actId/:id', {controller: AreaCtrl, templateUrl: 'partial/scenes/area.html'}).
    when('/admin/game/area/:actId/:id', {controller: GameAreaCtrl, templateUrl: 'partial/game/area.html'}).
    when('/admin/scenes/cinematic/:actId/:id', {controller: AreaCtrl, templateUrl: 'partial/scenes/cinematic.html'}).
    when('/admin/scenes/city/:actId/:id', {controller: AreaCtrl, templateUrl: 'partial/scenes/city.html'}).
    when('/error', {templateUrl: 'partial/error.html'}).
	  otherwise({redirectTo: '/error'});
});

app.factory('ActsService', function($resource) {
  return $resource('/api/acts/:id', {id: '@id'}, {update: {method: 'PUT'}});
});

app.factory('ScenesService', function ($resource) {
  return $resource('/api/scenes/:actId/:id', { actId : '@actId', id:'@id' }, {
    update: {method: 'PUT'},
    query: {method: 'GET', isArray: true},
    get: {method: 'GET'},
    delete: {method: 'DELETE'}
  })
});

app.factory('ItemsService', function($resource) {
  return $resource('/api/items/:id', {id: '@id'}, {update: {method: 'PUT'}});
});

app.factory('NpcsService', function($resource) {
  return $resource('/api/npcs/:id', {id: '@id'}, {update: {method: 'PUT'}});
});

app.factory('TilesService', function($resource) {
  return $resource('/api/tiles/:id', {id: '@id'}, {update: {method: 'PUT'}});
});

app.factory('ComponentsService', function($resource) {
  return $resource('/api/components/:id', {id: '@id'}, {update: {method: 'PUT'}});
});

// directive
app.directive('adminbar', function() {
  return {
    restrict: 'E',
    templateUrl: 'partial/element/adminbar.html',
    controller: 'AdminbarCtrl',
    link: function(scope, element, attrs) {
      scope.active = attrs.active;
    }
  }
})

app.directive('onKeypress', function() {
  return function(scope, elm, attrs) {
    elm.bind("keypress", function() {
      scope.$apply(attrs.onKeypress);
    });
  };
});