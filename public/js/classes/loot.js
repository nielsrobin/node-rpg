var Loot = Trigger.extend({
  init: function(title, x, y, passable, w, h, size, z, components, wealth) {
    this._super(title, x, y, passable, w, h, size, z)
    this.remove = false
    this.components = components
    this.wealth = wealth
  },
  draw: function(ctx, frameOffset, grid, isAdmin) {
    if(isAdmin) {     
      this._super(ctx, frameOffset)
    }
  },
  action: function(data) {
    this.remove = true
    map.character.bag = map.character.bag.concat(this.components)
    map.character.wealth += this.wealth-0
  }
})