function CompCtrl ($scope, $location, $http, ComponentsService) {
  ComponentsService.query(function(resp){
    $scope.comps = _.sortBy(resp, function(comp){ return comp.category })
  })

  $scope.delete = function(id) {
    if(confirm("Delete this for real?!")) {
      ComponentsService.delete({id: id})
      $scope.comps = _($scope.comps).reject(function(comp) { return comp.RowKey == id; })
    }
  }
}

// Equipment
function EquipCreateCtrl ($scope, $location, ComponentsService, ItemsService) {
  $scope.action = 'Add'
  $scope.items = ItemsService.query()
  $scope.save = function() {
    $scope.comp.category = 'equipment'
    $scope.comp.item = JSON.stringify($scope.comp.item)

    ComponentsService.save($scope.comp, function() {
      $location.path('/admin/components')
    })
  }  
}

function EquipUpdateCtrl ($scope, $location, $routeParams, ComponentsService, ItemsService) {
  var id = $routeParams.id
  ComponentsService.get({id: id}, function(resp){
    $scope.comp = resp
    $scope.comp.item = JSON.parse($scope.comp.item)
  })
  $scope.action = "Update"
  $scope.items = ItemsService.query()
  $scope.save = function() {
    $scope.comp.category = 'equipment'
    $scope.comp.item = JSON.stringify($scope.comp.item)

    ComponentsService.update({id: id}, $scope.comp, function() {
      $location.path('/admin/components')
    })
  }
}

// Consumable
function ConsumableCreateCtrl ($scope, $location, ComponentsService, ItemsService) {
  $scope.action = 'Add'
  $scope.items = ItemsService.query()
  $scope.save = function() {
    $scope.comp.category = 'consumable'
    $scope.comp.item = JSON.stringify($scope.comp.item)

    ComponentsService.save($scope.comp, function() {
      $location.path('/admin/components')
    })
  }  
}

function ConsumableUpdateCtrl ($scope, $location, $routeParams, ComponentsService, ItemsService) {
  var id = $routeParams.id
  ComponentsService.get({id: id}, function(resp){
    $scope.comp = resp
    $scope.comp.item = JSON.parse($scope.comp.item)
    console.log($scope.comp.item)
  })
  $scope.action = "Update"
  $scope.items = ItemsService.query()
  $scope.save = function() {

    console.log($scope.comp.item)
    $scope.comp.category = 'consumable'
    $scope.comp.item = JSON.stringify($scope.comp.item)

    ComponentsService.update({id: id}, $scope.comp, function() {
      $location.path('/admin/components')
    })
  }
}