var Cutscene = Trigger.extend({
  init: function(title, x, y, passable, w, h, size, z, npc, frames) {
    this._super(title, x, y, passable, w, h, size, z)
    this.remove = false
    this.npc = npc
    this.frames = frames
  },
  draw: function(ctx, frameOffset, grid, isAdmin) {
    if(isAdmin) {     
      this._super(ctx, frameOffset)
    }
  },
  action: function() {
    var time = 0
    var npc = this.npc;

    this.remove = true
    map.pause()

    _.each(this.frames, function(frame){
      setTimeout(function(){
        _.each(map.tiles, function(tile,i){
          if(tile.x == npc.x && tile.y == npc.y && tile instanceof Creature) {
            npc.x = frame.moveNpc.x
            npc.y = frame.moveNpc.y
            map.tiles[i].x = npc.x
            map.tiles[i].y = npc.y 
          }
        })
        map.character.x = frame.movePc.x
        map.character.y = frame.movePc.y
        map.draw()

        if(frame.dialog != undefined)
        {
          var lineLength = 25
          var length = frame.dialog.length/lineLength
          for(var i=0; i<=length; i++)
          { 
            var fragment = frame.dialog.substring(i*lineLength, i*lineLength+lineLength)
          
            map.ctx.fillStyle = "white";
            map.ctx.strokeStyle = "black";
            map.ctx.textAlign = "left";
            map.ctx.strokeText(fragment, center.x + frame.moveNpc.x*size, center.y + frame.moveNpc.y*size + i * 14);
            map.ctx.fillText(fragment, center.x + frame.moveNpc.x*size, center.y + frame.moveNpc.y*size + i * 14);
          }
        }
      }, time)
      time += (frame.dialog != undefined ? 5000 : 1000)
    })

    setTimeout(function(){
      map.resume()
    }, time+1000)
  }
})