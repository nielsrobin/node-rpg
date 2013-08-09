function ItemsCtrl ($scope, $location, $http, ItemsService) {
  $scope.adminbar = 'Items'
  $scope.url = 'items'
  
  ItemsService.query(function(resp){
    $scope.tiles = _.sortBy(resp, function(tile){ return tile.category })
  })

  $scope.delete = function(id) {
    if(confirm("Delete this for real?!")) {
      ItemsService.delete({id: id})
      $scope.tiles = _($scope.tiles).reject(function(tile) { return tile.RowKey == id; })
    }
  }
}

function ItemsCreateCtrl ($scope, $location, ItemsService) {
  $scope.adminbar = 'Items'
  $scope.url = 'items'
  
  $scope.action = 'Add'
  $scope.srcs = sprites;
  $scope.save = function() {
    $scope.tile.x = parseInt($scope.tile.x)
    $scope.tile.y = parseInt($scope.tile.y)
    $scope.tile.z = parseInt($scope.tile.z)
    $scope.tile.type = 'item'
    $scope.tile.passable = $scope.tile.passable ? true : false

    ItemsService.save($scope.tile, function() {
      $location.path('/admin/items')
    })
  }  
}

function ItemsUpdateCtrl ($scope, $location, $routeParams, ItemsService) {
  $scope.adminbar = 'Items'
  $scope.url = 'items'
  
  var id = $routeParams.id
  $scope.tile = ItemsService.get({id: id})
  setTimeout(function(){ canvasToTile($("canvas"), {size: 64}); },1000) 
  $scope.action = "Update"
  $scope.srcs = sprites;
  $scope.save = function() {
    $scope.tile.x = parseInt($scope.tile.x)
    $scope.tile.y = parseInt($scope.tile.y)
    $scope.tile.z = parseInt($scope.tile.z)
    $scope.tile.type = 'item'
    $scope.tile.passable = $scope.tile.passable ? true : false

    ItemsService.update({id: id}, $scope.tile, function() {
      $location.path('/admin/items')
    })
  }
}