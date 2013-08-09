var Teleport = Trigger.extend({
  init: function(title, x, y, passable, w, h, size, z, to) {
    this._super(title, x, y, passable, w, h, size, z)
    this.to = to
  },
  draw: function(ctx, frameOffset, grid, isAdmin){
    if(isAdmin) {     
      this._super(ctx, frameOffset)
    }
  },
  action: function(data){
    map.character.x = this.to.x
    map.character.y = this.to.y
  }
})