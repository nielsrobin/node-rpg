var Fog = Entity.extend({
  init: function(){
  },
  draw: function(ctx, width, height, light, size){
    var xs = width / size / 2 + 1;
    var ys = height / size / 2 + 1;
    var zero = {x: width / 2 - size / 2, y: height / 2 - size / 2}

    for(var x=0; x<xs; x++)
    {
      for(var y=0; y<ys; y++)
      {
        ctx.fillStyle = "rgba(0, 0, 0, " + (Math.round(Math.sqrt(x*x+y*y))/light-0.2) + ")";

        ctx.fillRect(
          zero.x+x*size, 
          zero.y+y*size,
          size+0.5,
          size+0.5
        );

        ctx.fillRect(
          zero.x-x*size, 
          zero.y-y*size,
          size+0.5,
          size+0.5
        );

        if(x > 0 && y > 0)
        {
          ctx.fillRect(
            zero.x+x*size, 
            zero.y-y*size,
            size+0.5,
            size+0.5
          );

          ctx.fillRect(
            zero.x-x*size, 
            zero.y+y*size,
            size+0.5,
            size+0.5
          );
        }
      }
    }
  }
});