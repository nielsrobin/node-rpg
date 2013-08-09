function ScenesCreateCtrl ($scope, $location, $routeParams, ScenesService) {
  var actId = $routeParams.actId
	$scope.actId = actId
  $scope.scenes = ScenesService.query({actId: actId})
  $scope.prev = []
  $scope.action = 'Add'
  $scope.types = ['area','cinematic','city']
  $scope.save = function() {
    if($scope.scene.type == 'area') {
      $scope.scene.tiles = JSON.stringify([])
      $scope.scene.start = JSON.stringify({x: 0, y: 0})
      $scope.scene.end = JSON.stringify({x: 0, y: 0})
    }
  	$scope.scene.prev = $scope.prev
  	$scope.scene.PartitionKey = $scope.actId
  	console.log($scope.scene)
    ScenesService.save($scope.scene, function() {
      $location.path('/admin/acts/' + $scope.actId)
    })
  }  
}

function ScenesUpdateCtrl ($scope, $location, $routeParams, ScenesService) {
  var actId = $routeParams.actId
  var id = $routeParams.id
  ScenesService.get({actId: actId, id: id}, function(resp){
  	$scope.scene = resp
  	$scope.actId = resp.PartitionKey
		$scope.prev = resp.prev != undefined ? resp.prev.split(",") : []
  })
  $scope.scenes = ScenesService.query({actId: actId})

  $scope.action = "Update"
  $scope.types = ['area','cinematic','city']

  $scope.save = function() {
    if($scope.scene.type == 'area' && $scope.scene.tiles == undefined) $scope.scene.tiles = []
  	$scope.scene.prev = $scope.prev
    ScenesService.update({id: id}, $scope.scene, function() {
      $location.path('/admin/acts/' + $scope.actId)
    })
  }
}

function AreaCtrl ($scope, $location, $routeParams, ScenesService, ItemsService, NpcsService, TilesService, ComponentsService) {
  var actId = $routeParams.actId
  var id = $routeParams.id
  $scope.info = ''
	ScenesService.get({actId: actId, id: id}, function(resp){
    console.log(resp.tiles.length) // must not exceed 64k?

  	$scope.scene = resp
    $scope.sceneTiles = JSON.parse($scope.scene.tiles)
    $scope.start = JSON.parse($scope.scene.start)
    $scope.end = JSON.parse($scope.scene.end)

    // #TODO: move to directive?
    setMapSize($(".map"))
    startMap($(".map")[0], $scope.sceneTiles, { name: "robin", x: $scope.start.x , y: $scope.start.y }, true)
    
    // #TODO on angular html finished / deferred promise
    setTimeout(function(){initEditor($(".editor-panel canvas"));},6000) 
  })
  
  $isActive = ''

  $scope.tile = {x: 0, y: 0, z: 0}
  TilesService.query(function(resp){
    $scope.tiles = _.sortBy(resp, function(tile){ return tile.category })
  })
  $scope.tileClick = function(i) {
    $scope.tile = $scope.tiles[i]
    $scope.tileType = 'tile'
    $scope.target = 'tile'
    $scope.info = 'place ' + $scope.tile.title + ' ' + $scope.tileType
  }
  
  ItemsService.query(function(resp){
    $scope.items = _.sortBy(resp, function(tile){ return tile.category })
  })
  $scope.itemsClick = function(i) {
    $scope.tile = $scope.items[i]
    $scope.tileType = 'item'
    $scope.target = 'item'
    $scope.info = 'place ' + $scope.tile.title + ' ' + $scope.tileType
  }

  NpcsService.query(function(resp){
    $scope.npcs = _.sortBy(resp, function(tile){ return tile.category })
  })
  $scope.npcsClick = function(i) {
    $scope.tile = $scope.npcs[i]
    $scope.tileType = 'npc'
    $scope.target = 'tile'
    $scope.info = 'place ' + $scope.tile.title + ' ' + $scope.tileType
  }

  $scope.target = ''
  $scope.click = function ($event) {
    var cords = getXY($('.map')[0], $event)
    console.log($scope.target)

    if($event.clientX < 64) {
      var e = $('.map')[0].relMouseCoords($event)
      var index = Math.round(e.y/64-.5);

      var count = 0;
      for(var i=0; i<map.tiles.length; i++) {
        if(map.character.x == map.tiles[i].x && map.character.y == map.tiles[i].y) {
          if(count == index) {
            map.tiles.splice(i ,1)
            $scope.sceneTiles.splice(i ,1)
            break
          }
          count++
        }
      }
    }
    else if($scope.target == 'start') {
      $scope.start = cords
      $scope.info = 'start cordinates updated'
    }  
    else if($scope.target == 'end') {
      $scope.end = cords
      $scope.info = 'end cordinates updated'
    }
    else if($scope.target == 'item' || $scope.target == 'loot') {
      $scope.cords = cords;
      $scope.components = ComponentsService.query()
      $scope.componentsSelected = []
      $(".modal-trigger-components").modal();
    }
    else if($scope.target == 'tile') {
      var tile = $scope.tile
      console.log(tile)
      $scope.sceneTiles.push({title: tile.title, tileType: $scope.tileType, offset:{x: tile.x, y: tile.y}, src: 'img/' + tile.src, loc:cords, passable: tile.passable, w:64, h:64, sequence:0, size:64, z: tile.z})
      $scope.sceneTiles = _.sortBy($scope.sceneTiles, function(tile){ return tile.z });
      map.load($scope.sceneTiles, map.character)
    }
    else if($scope.target == 'dialog') {
      $scope.cords = cords;
      $(".modal-trigger-dialog").modal()
      $(".wysihtml5-toolbar .btn").addClass("btn-default") // TEMP SOLUTION REMOVE
    }
    else if($scope.target == 'cutscene') {
      if($scope.cutsceneStart == undefined) {
        $scope.cutsceneStart = cords
        $scope.cutsceneFrames = []
        $(".cutscene-editor").show()
        $scope.info = 'select npc to move'
      }
      else if($scope.cutsceneNpc == undefined) {
        $scope.cutsceneNpc = cords
        $scope.info = 'select where to move the pc to'
      }
      else if($scope.cutsceneMovePc == undefined) {
        $scope.cutsceneMovePc = cords
        $scope.info = 'select where to move the npc to'
      }
      else if($scope.cutsceneMoveNpc == undefined) {
        $scope.cutsceneMoveNpc = cords
        $(".modal-trigger-cutscene").modal()
      }
    }
    else if($scope.target == 'teleport') {      
      if($scope.teleportFrom == undefined) {
        $scope.teleportFrom = cords
      }
      else {        
        $scope.sceneTiles.push({title: 'teleport', tileType: 'trigger.teleport', loc: $scope.teleportFrom, passable: 'true', w:64, h:64, sequence:0, size:64, z: 5, to: cords})
        $scope.sceneTiles = _.sortBy($scope.sceneTiles, function(tile){ return tile.z });
        map.load($scope.sceneTiles, map.character)
        $scope.teleportFrom = undefined
      }
    }
    else if($scope.target == 'transformation') {      
      if($scope.transformationButton == undefined) {
        $scope.transformationButton = cords
      }      
      else if($scope.transformationFirst == undefined) {
        $scope.transformationFirst = cords
      }
      else {       
        $scope.sceneTiles.push({title: 'transformation', tileType: 'trigger.transformation', loc: $scope.transformationButton, passable: 'true', w:64, h:64, sequence:0, size:64, z: 5, first: $scope.transformationFirst, second: cords})
        console.log($scope.sceneTiles[$scope.sceneTiles.length-1])
        $scope.sceneTiles = _.sortBy($scope.sceneTiles, function(tile){ return tile.z });
        map.load($scope.sceneTiles, map.character)
        $scope.transformationButton = undefined
        $scope.transformationFirst = undefined
      }
    }
  }

  $scope.saveBtn = 'Save'
  $scope.save = function() {
    $scope.scene.tiles = JSON.stringify($scope.sceneTiles);
    $scope.scene.start = JSON.stringify($scope.start);
    $scope.scene.end = JSON.stringify($scope.end);
    $scope.saveBtn = 'Saving'
    ScenesService.update({id: $scope.scene.RowKey}, $scope.scene, function() {
      console.log('saved!')
      $scope.saveBtn = 'Save'
    })
  }

  $scope.clearBtn = 'Clear'
  $scope.clear = function() {
    if(confirm("Clear all for real?!")) {
      $scope.scene.tiles = []
    }
  }

  $scope.back = function() {
    $location.path('/admin/acts/' + actId)
  }

  $scope.grid = function() {
    map.grid = !map.grid
  }

  // triggers

  $scope.dialogOpen = function() {
    $scope.target = 'dialog'
  }

  $scope.dialogSave = function() {
    $(".modal-trigger-dialog").modal('hide')

    $scope.sceneTiles.push({title: 'dialog', tileType: 'trigger.dialog', loc:$scope.cords, passable: 'true', w:size, h:size, sequence:0, size:size, z: 5, dialog: $('.textarea-dialog').val()})
    $scope.sceneTiles = _.sortBy($scope.sceneTiles, function(tile){ return tile.z });
    map.load($scope.sceneTiles, map.character)
  }

  $scope.dialogCancel = function() {
    $(".modal-trigger-dialog").modal('hide')
  }

  $scope.cutsceneSave = function() {
    $(".modal-trigger-cutscene").modal('hide')
    $scope.cutsceneFrames.push({moveNpc: $scope.cutsceneMoveNpc, movePc: $scope.cutsceneMovePc, dialog: $('.textarea-cutscene').val()})
    $scope.cutsceneMovePc = undefined
    $scope.cutsceneMoveNpc = undefined
    $scope.info = 'select where to move pc to'
  }

  $scope.cutsceneCancel = function() {
    $(".modal-trigger-cutscene").modal('hide')
    $scope.cutsceneFrames.push({moveNpc: $scope.cutsceneMoveNpc, movePc: $scope.cutsceneMovePc, dialog: undefined})
    $scope.cutsceneMovePc = undefined
    $scope.cutsceneMoveNpc = undefined
    $scope.info = 'select where to move pc to'
  }

  $scope.cutsceneFinished = function() {
    $(".cutscene-editor").hide()

    $scope.sceneTiles.push({title: 'cutscene', tileType: 'trigger.cutscene', loc:$scope.cutsceneStart, passable: 'true', w:size, h:size, sequence:0, size:size, z: 5, npc: $scope.cutsceneNpc, frames: $scope.cutsceneFrames })
    $scope.sceneTiles = _.sortBy($scope.sceneTiles, function(tile){ return tile.z });
    map.load($scope.sceneTiles, map.character)
    $scope.cutsceneFrames = undefined
    $scope.cutsceneStart = undefined
    $scope.cutsceneNpc = undefined
    $scope.target = undefined
    $scope.info = ''
  }

  $scope.componentsSave = function() {
    var tile = $scope.tile

    if($scope.target == 'loot') {
      $scope.sceneTiles.push({title: 'loot', tileType: 'trigger.loot', loc:$scope.cords, passable: 'true', w:size, h:size, sequence:0, size:size, z: 5, components: $scope.componentsSelected, wealth: $scope.wealth})
    }
    else {
      $scope.sceneTiles.push({title: tile.title, tileType: $scope.tileType, offset:{x: tile.x, y: tile.y}, src: 'img/' + tile.src, loc:$scope.cords, passable: tile.passable, w:64, h:64, sequence:0, size:64, z: tile.z, components: $scope.componentsSelected, wealth: $scope.wealth})
    }

    $scope.sceneTiles = _.sortBy($scope.sceneTiles, function(tile){ return tile.z })
    map.load($scope.sceneTiles, map.character)

    $(".modal-trigger-components").modal('hide')
  }

  $scope.componentAdd = function(component) {
    $scope.componentsSelected.push(component)
  }

  $scope.componentsCancel = function() {
    $(".modal-trigger-components").modal('hide')
  }

  $scope.transformation = function() {
    $scope.target = 'transformation'
  }

  $scope.ambush = function() {
    alert('not implemented yet')
    $scope.target = 'ambush'
  }

  $scope.teleport = function() {
    $scope.target = 'teleport'
  }

  $scope.trap = function() {
    alert('not implemented yet')
    $scope.target = 'trap'
  }

  $scope.loot = function() {
    $scope.target = 'loot'
  }

  $scope.cutscene = function() {
    $scope.target = 'cutscene'
    $scope.info = 'select where to start cutscene'
  }

  $('.textarea-dialog, .textarea-cutscene').wysihtml5({
    "font-styles": false
  });
}
