var Character = Entity.extend({
  init: function(name, offset, src, loc, w, h, sequence, size, z, bag, wealth){
    this._super(offset, src, loc.x, loc.y, w, h, sequence, size, z)
    this.name = name
    this.remove = false

    this.bag = bag
    this.wealth = wealth
  },
  draw: function(ctx, frameOffset){
    this._super(ctx, frameOffset);

    if(this.name != undefined) 
    {
        ctx.font = "12pt Calibri";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.strokeText(this.name, this.x * this.size + frameOffset.x + this.size/2, this.y * this.size + frameOffset.y - 2);
        ctx.fillText(this.name, this.x * this.size + frameOffset.x + this.size/2, this.y * this.size + frameOffset.y - 2);
    }
  },
  action: function(data){
    console.log('this is yourself.')
  }
});