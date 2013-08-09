var Entity = Class.extend({
  init: function(offset, src, x, y, w, h, sequence, size,z){
    this.z = z;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.offset = offset;
    this.sprite = new Image();
    this.sprite.src = src;
    this.sequence = sequence;
    this.current = 0;
    this.direction = 0;
    this.destroy = false;
    this.size = size;
  },
  draw: function(ctx, frameOffset){
    ctx.drawImage(this.sprite, this.offset.x*this.size + this.current * this.size, this.offset.y*this.size + this.direction * this.size, this.size, this.size, this.x * this.size + frameOffset.x, this.y * this.size + frameOffset.y, this.w, this.h);
    if(this.sequence > this.current) this.current++;
    else this.current = 0;
  },
  info: function(ctx, offset, index){
    ctx.drawImage(this.sprite, this.offset.x*this.size + this.current * this.size, this.offset.y*this.size + this.direction * this.size, this.size, this.size, 0, this.h*offset, this.w, this.h);
    if(this.sequence > this.current) this.current++;
    else this.current = 0;
  },
  action: function(data){
    console.log(this.x + ":" + this.y + " " + this.sprite.src);
  }
});