var AdminMapStateEngine = StateEngine.extend({
  init: function(canvas){
    this.isAdmin = true;
    this.grid = false;
    this.tiles = [];
    this.character = {};
    this.fog = new Fog();
    this.light = 1;
    this.move = false;
    this.size = 64;

    this._super(canvas);
  },
  load: function(tiles, character){
    var myState = this;
    myState.tiles = []

    _.each(tiles, function(tile){
      if(tile.tileType == 'trigger.dialog') {
        myState.tiles.push(new Dialog(tile.title, tile.loc.x, tile.loc.y, tile.passable, tile.w, tile.h, tile.size, tile.z, tile.dialog));
      }
      else if(tile.tileType == 'trigger.loot') {
        myState.tiles.push(new Loot(tile.title, tile.loc.x, tile.loc.y, tile.passable, tile.w, tile.h, tile.size, tile.z, tile.components, tile.wealth));
      }
      else if(tile.tileType == 'trigger.cutscene') {
        myState.tiles.push(new Cutscene(tile.title, tile.loc.x, tile.loc.y, tile.passable, tile.w, tile.h, tile.size, tile.z, tile.npc, tile.frames));
      }
      else if(tile.tileType == 'trigger.teleport') {
        myState.tiles.push(new Teleport(tile.title, tile.loc.x, tile.loc.y, tile.passable, tile.w, tile.h, tile.size, tile.z, tile.to));
      }
      else if(tile.tileType == 'trigger.transformation') {
        myState.tiles.push(new Teleport(tile.title, tile.loc.x, tile.loc.y, tile.passable, tile.w, tile.h, tile.size, tile.z, tile.first, tile.second));
      }
      else {
        myState.tiles.push(new Tile((tile.offset != undefined ? tile.offset : {x:0,y:0}), tile.src, tile.loc, tile.passable, this.size, this.size, 0, this.size, this.z));
      }
    });

    myState.character = new Creature(character.name, {x:3,y:4}, "/img/64x64.png",{ x: character.x, y: character.y }, this.size, this.size, 0, this.size);
  },
  collision: function(){
    if (this.isAdmin && this.move) {
      var tiles = this.tiles;
      var p = this.character;
      this.clear();
      this.move = false;

      _.each(tiles, function(tile, i){
          if(tile.x == p.x && tile.y == p.y) tile.action();
      });
    }
  },
  draw: function(){
    var ctx = this.ctx;
    var fog = this.fog;
    var tiles = this.tiles;
    var grid = this.grid;
    var isAdmin = this.isAdmin;
    var c = this.character;
    var offset = {x: center.x - c.x * this.size, y:center.y - c.y * this.size}
    var count = 0;
    this.clear();

    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    _.each(tiles, function(tile, index){
        // We can skip the drawing of elements that have moved off the screen:
        if (tile.x > this.width || tile.y > this.height || tile.x + tile.w < 0 || tile.y + tile.h < 0) {}
        else {tile.draw(ctx, offset, grid, isAdmin)};

        if(c.x == tile.x && c.y == tile.y) {
          tile.info(ctx, count, index)
          count++;
        }
    });

    c.draw(ctx, offset);
    if(!this.isAdmin) fog.draw(ctx, this.width, this.height, this.light);

  },
  keybindings: function(e) {
    if(e.keyCode >= keyboard.left && e.keyCode <= keyboard.down)
    {
      // movement
      switch (e.keyCode)
      {
          case keyboard.left:
              map.character.x--;
              break;
          case keyboard.right:
              map.character.x++;
              break;
          case keyboard.up:
              map.character.y--;
              break;
          case keyboard.down:
              map.character.y++;
              break;
      }
      return false;
    }
  }
});