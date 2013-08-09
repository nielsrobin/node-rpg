var Transformation = Trigger.extend({
  init: function(title, x, y, passable, w, h, size, z, first, second) {
    this._super(title, x, y, passable, w, h, size, z)
    this.first = first
    this.second = second
  },
  draw: function(ctx, frameOffset, grid, isAdmin){
    if(isAdmin) {     
      this._super(ctx, frameOffset)
    }
  },
  action: function(data){
    var first = this.first,
        second = this.second

    _.each(map.tiles, function(tile){
      if(first.x == tile.x && first.y == tile.y) {
        tile.x = second.x
        tile.y = second.y

        console.log(tile)
        console.log(second)
      }
      else if(second.x == tile.x && second.y == tile.y) {
        tile.x = first.x
        tile.y = first.y
      }
    })
  }
})