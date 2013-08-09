var Item = Entity.extend({
  init: function(title, offset, src, loc, w, h, sequence, size, z, components, wealth){
    this._super(offset, src, loc.x, loc.y, w, h, sequence, size, z);
    this.title = title
    this.remove = false
    this.components = components
    this.wealth = wealth
  },
  draw: function(ctx, frameOffset, grid){
    this._super(ctx, frameOffset);

    if(grid)
    {
        ctx.font = "9pt Calibri";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("(" + this.x + ":" + this.y + ")", this.x * this.size + frameOffset.x + 16, this.y * this.size + frameOffset.y + 10);
    }
  },
  action: function(data){
    this.remove = true
    map.character.bag = map.character.bag.concat(this.components)
    map.character.wealth += this.wealth-0
  }
});