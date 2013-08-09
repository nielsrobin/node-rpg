var MapStateEngine = StateEngine.extend({
  init: function(canvas){
    this.grid = false;
    this.tiles = [];
    this.character = {};
    this.nextMove = {};
    this.fog = new Fog();
    this.light = 5;
    this.move = false;
    this.size = 64;
    this.end;

    this._super(canvas);
  },
  load: function(tiles, character){
    var myState = this;

    tiles = _.sortBy(tiles, function(tile){ return tile.z });

    _.each(tiles, function(tile){
        if(tile.tileType == 'tile') {
          myState.tiles.push(new Tile((tile.offset != undefined ? tile.offset : {x:0,y:0}), tile.src, tile.loc, tile.passable, this.size, this.size, 0, this.size, tile.z));
        }
        else if(tile.tileType == 'item') {
          myState.tiles.push(new Item(tile.title, (tile.offset != undefined ? tile.offset : {x:0,y:0}), tile.src, tile.loc, this.size, this.size, 0, this.size, tile.z, tile.components, tile.wealth));
        }
        else if(tile.tileType == 'npc') {
          myState.tiles.push(new Creature(tile.title, (tile.offset != undefined ? tile.offset : {x:0,y:0}), tile.src, tile.loc, this.size, this.size, 0, this.size, tile.z));
        }
        else if(tile.tileType == 'trigger.dialog') {
          myState.tiles.push(new Dialog(tile.title, tile.loc.x, tile.loc.y, tile.passable, tile.w, tile.h, tile.size, tile.z, tile.dialog));
        }   
        else if(tile.tileType == 'trigger.cutscene') {
          myState.tiles.push(new Cutscene(tile.title, tile.loc.x, tile.loc.y, tile.passable, tile.w, tile.h, tile.size, tile.z, tile.npc, tile.frames));
        }   
        else if(tile.tileType == 'trigger.loot') {
          myState.tiles.push(new Loot(tile.title, tile.loc.x, tile.loc.y, tile.passable, tile.w, tile.h, tile.size, tile.z, tile.components, tile.wealth));
        }      
        else if(tile.tileType == 'trigger.teleport') {
          myState.tiles.push(new Teleport(tile.title, tile.loc.x, tile.loc.y, tile.passable, tile.w, tile.h, tile.size, tile.z, tile.to));
        }   
        else if(tile.tileType == 'trigger.transformation') {
          myState.tiles.push(new Transformation(tile.title, tile.loc.x, tile.loc.y, tile.passable, tile.w, tile.h, tile.size, tile.z, tile.first, tile.second));
        }   
    });

    myState.character = new Character(character.name, {x:3,y:4}, "/img/64x64.png", {x: character.x, y: character.y }, this.size, this.size, 0, this.size, 8, character.bag, character.wealth);
  },
  collision: function(){
    if (this.move) {
      var tiles = this.tiles
      var p = this.character
      var nextMove = this.nextMove
      this.clear()
      this.move = false

      _.each(tiles, function(tile, i){
          if(tile.remove) {
            tiles.splice(i,1)
          }

          if(tile.x == nextMove.x && tile.y == nextMove.y) {
            tile.action()
          }    
      });

      if(nextMove.x == this.end.x && nextMove.y == this.end.y) {
        alert('Area completed! Here have my +1 mace.')
      }

      if(p.x != nextMove.x || p.y != nextMove.y) {
        this.moveTo(nextMove.x, nextMove.y)
      }
    }
  },
  draw: function(){
    var ctx = this.ctx;
    var fog = this.fog;
    var tiles = this.tiles;
    var grid = this.grid;
    var c = this.character;
    var offset = {x: center.x - c.x * this.size, y:center.y - c.y * this.size}
    this.clear();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    var isCharacterDrawn = false;

    _.each(tiles, function(tile){
        if(tile.z > 9 && !isCharacterDrawn) {
          c.draw(ctx, offset)
          isCharacterDrawn = true
        }

        // We can skip the drawing of elements that have moved off the screen:
        if (tile.x > this.width || tile.y > this.height || tile.x + tile.w < 0 || tile.y + tile.h < 0) {}
        else {tile.draw(ctx, offset, grid)};
    });

    if(!isCharacterDrawn) c.draw(ctx, offset);

    fog.draw(ctx, this.width, this.height, this.light, this.size);
  },
  keybindings: function(e) {
    if(e.keyCode >= keyboard.left && e.keyCode <= keyboard.down)
    {
      // movement
      switch (e.keyCode)
      {
          case keyboard.left:
              map.nextMove = {x: map.character.x-1, y: map.character.y}
              break;
          case keyboard.right:
              map.nextMove = {x: map.character.x+1, y: map.character.y}
              break;
          case keyboard.up:
              map.nextMove = {x: map.character.x, y: map.character.y-1}
              break;
          case keyboard.down:
              map.nextMove = {x: map.character.x, y: map.character.y+1}
              break;
      }
      map.move = true
      return false;
    }
    else if(e.keyCode == keyboard.return || e.keyCode == keyboard.space) {
      // same code as GameAreaCtrl.dialog
      if(dialogContainer.length > 0) {
        $(".dialog .text").html(dialogContainer.splice(0,1))
      }
      else {
        $('.dialog').fadeOut()
      }      
    }
    else if(e.keyCode == keyboard.i) {
      $('.inventory').fadeToggle()   
      $('.inventory .bag').html('')
      
      _.each(map.character.bag, function(comp){
        $('.inventory .bag').append('<p>' + comp + '</p>')
      })
      $('.inventory .bag').append('<p>Wealth: ' + map.character.wealth + '</p>')
    }
  },
  moveTo: function(x, y) {
    var myState = this
    var isPassable = true;

    var tiles = _.filter(myState.tiles, function(tile, i){ return tile.x == x && tile.y == y })

    if(tiles.length < 1) {
      isPassable = false
    }
    else {
      _.each(tiles, function(tile){
          if(tile.passable == false) {
            isPassable = false
          }
      });
    }

    if(isPassable)
    {
      myState.character.x = x;
      myState.character.y = y;
    }
  }
});