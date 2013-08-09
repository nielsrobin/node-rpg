var Tile = Entity.extend({
  init: function(offset, src, loc, passable, w, h, sequence, size, z) {
    this._super(offset, src, loc.x, loc.y, w, h, sequence, size, z)
    this.passable = passable
  },
  draw: function(ctx, frameOffset, grid){
    this._super(ctx, frameOffset);

    if(grid)
    {
        ctx.font = "9pt Calibri"
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.fillText("(" + this.x + ":" + this.y + ")", this.x * this.size + frameOffset.x + 32, this.y * this.size + frameOffset.y + 38)
    }
  },
  action: function(data){
    console.log(this.x + ":" + this.y + ":" + this.z)
  }
});