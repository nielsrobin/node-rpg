function GameAreaCtrl ($scope, $location, $routeParams, ScenesService) {
  var actId = $routeParams.actId
  var id = $routeParams.id
  ScenesService.get({actId: actId, id: id}, function(resp){
    console.log(resp.tiles.length) // must not exceed 64k?

    $scope.scene = resp
    $scope.scene.tiles = JSON.parse($scope.scene.tiles)
    $scope.scene.start = JSON.parse($scope.scene.start)
    $scope.scene.end = JSON.parse($scope.scene.end)

    setMapSize($(".map"))
    startMap($(".map")[0], $scope.scene.tiles, { name: "robin", x: $scope.scene.start.x , y: $scope.scene.start.y, bag: ['84fc077a-6720-4bb0-adde-50db04b074d9'], wealth: 42}, false)
    map.end = $scope.scene.end
  })
  
  $scope.click = function ($event) {
  }

  $scope.back = function() {
    $location.path('/admin/acts/' + actId)
  }

  $scope.dialog = function() {
    // same code as keybindings
    if(dialogContainer.length > 0) {
      $(".dialog .text").html(dialogContainer.splice(0,1))
    }
    else {
      $('.dialog').fadeOut()
    }
  }
}

var dialogContainer = []