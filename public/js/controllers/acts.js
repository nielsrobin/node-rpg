function ActsCtrl ($scope, $location, $http, ActsService) {
  $scope.acts = ActsService.query()

  $scope.delete = function(id) {
    if(confirm("Delete this for real?!")) {
      ActsService.delete({id: id})
      $scope.acts = _($scope.acts).reject(function(act) { return act.RowKey == id; })
    }
  }
}

function ActsCreateCtrl ($scope, $location, ActsService) {
  $scope.action = 'Add'
  $scope.save = function() {
    ActsService.save($scope.act, function() {
      $location.path('/admin/acts')
    })
  }  
}

function ActsUpdateCtrl ($scope, $location, $routeParams, ActsService) {
  var id = $routeParams.id
  $scope.act = ActsService.get({id: id})
  $scope.action = "Update"
  $scope.save = function() {
    ActsService.update({id: id}, $scope.act, function() {
      $location.path('/admin/acts')
    })
  }
}

function ActCtrl ($scope, $routeParams, ActsService, ScenesService) {
  var actId = $routeParams.id
  $scope.actId = actId
  $scope.act = ActsService.get({id: actId})
  ScenesService.query({actId: actId}, function(resp){
    $scope.scenes = resp
    $scope.scenesSequences = getSequence(resp)
  })

  $scope.delete = function(id) {
    if(confirm("Delete this for real?!")) {
      ScenesService.delete({actId: actId, id: id})
      $scope.scenes = _($scope.scenes).reject(function(scene) { return scene.RowKey == id; })
    }
  }
}