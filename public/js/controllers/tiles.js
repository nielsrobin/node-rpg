function TilesCtrl ($scope, $location, $http, TilesService) {
  $scope.adminbar = 'Tiles'
  $scope.url = 'tiles'

  TilesService.query(function(resp){
    $scope.tiles = _.sortBy(resp, function(tile){ return tile.category })
  })

  $scope.delete = function(id) {
    if(confirm("Delete this for real?!")) {
      TilesService.delete({id: id})
      $scope.tiles = _($scope.tiles).reject(function(tile) { return tile.RowKey == id; })
    }
  }
}

function TilesCreateCtrl ($scope, $location, TilesService) {
  $scope.adminbar = 'Tiles'
  $scope.url = 'tiles'
  
  $scope.action = 'Add'
  $scope.srcs = sprites;
  $scope.save = function() {
    $scope.tile.x = parseInt($scope.tile.x)
    $scope.tile.y = parseInt($scope.tile.y)
    $scope.tile.z = parseInt($scope.tile.z)
    $scope.tile.type = 'tile'
    $scope.tile.passable = $scope.tile.passable ? true : false

    TilesService.save($scope.tile, function() {
      $location.path('/admin/tiles')
    })
  }  
}

function TilesUpdateCtrl ($scope, $location, $routeParams, TilesService) {
  $scope.adminbar = 'Tiles'
  $scope.url = 'tiles'
  
  var id = $routeParams.id
  $scope.tile = TilesService.get({id: id})
  setTimeout(function(){ canvasToTile($("canvas"), {size: 64}); },1000) 
  $scope.action = "Update"
  $scope.srcs = sprites;
  $scope.save = function() {
    $scope.tile.x = parseInt($scope.tile.x)
    $scope.tile.y = parseInt($scope.tile.y)
    $scope.tile.z = parseInt($scope.tile.z)
    $scope.tile.type = 'tile'
    $scope.tile.passable = $scope.tile.passable ? true : false

    TilesService.update({id: id}, $scope.tile, function() {
      $location.path('/admin/tiles')
    })
  }
}