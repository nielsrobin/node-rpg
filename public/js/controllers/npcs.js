function NpcsCtrl ($scope, $location, $http, NpcsService) {
  $scope.adminbar = 'Npcs'
  $scope.url = 'npcs'
  
  NpcsService.query(function(resp){
    $scope.tiles = _.sortBy(resp, function(tile){ return tile.category })
  })

  $scope.delete = function(id) {
    if(confirm("Delete this for real?!")) {
      NpcsService.delete({id: id})
      $scope.tiles = _($scope.tiles).reject(function(tile) { return tile.RowKey == id; })
    }
  }
}

function NpcsCreateCtrl ($scope, $location, NpcsService) {
  $scope.adminbar = 'Npcs'
  $scope.url = 'npcs'
  
  $scope.action = 'Add'
  $scope.srcs = sprites;
  $scope.save = function() {
    $scope.tile.x = parseInt($scope.tile.x)
    $scope.tile.y = parseInt($scope.tile.y)
    $scope.tile.z = parseInt($scope.tile.z)
    $scope.tile.type = 'npc'
    $scope.tile.passable = $scope.tile.passable ? true : false
    
    NpcsService.save($scope.tile, function() {
      $location.path('/admin/npcs')
    })
  }  
}

function NpcsUpdateCtrl ($scope, $location, $routeParams, NpcsService) {
  $scope.adminbar = 'Npcs'
  $scope.url = 'npcs'
  
  var id = $routeParams.id
  $scope.tile = NpcsService.get({id: id})
  setTimeout(function(){ canvasToTile($("canvas"), {size: 64}); },1000) 
  $scope.action = "Update"
  $scope.srcs = sprites;
  $scope.save = function() {
    $scope.tile.x = parseInt($scope.tile.x)
    $scope.tile.y = parseInt($scope.tile.y)
    $scope.tile.z = parseInt($scope.tile.z)
    $scope.tile.type = 'npc'
    $scope.tile.passable = $scope.tile.passable ? true : false

    NpcsService.update({id: id}, $scope.tile, function() {
      $location.path('/admin/npcs')
    })
  }
}