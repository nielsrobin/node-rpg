var Trigger = Class.extend({
  init: function(title, x, y, passable, w, h, size, z) {
    this.title = title
    this.x = x
    this.y = y
    this.passable = passable
    this.w = w
    this.h = h
    this.size = size
    this.z = z
  },
  draw: function(ctx, frameOffset){
    ctx.font = "9pt Calibri";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(this.title, this.x * this.size + frameOffset.x + 32, this.y * this.size + frameOffset.y + 38);
  },
  info: function(ctx, offset, index){
    ctx.font = "9pt Calibri";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(this.title, 32, this.size * offset + 38);
  },
  action: function(data){
    console.log("trigger: " + this.title);
  }
});