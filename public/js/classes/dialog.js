var Dialog = Trigger.extend({
  init: function(title, x, y, passable, w, h, size, z, dialog) {
    this._super(title, x, y, passable, w, h, size, z)
    this.dialog = dialog
    this.remove = false
  },
  draw: function(ctx, frameOffset, grid, isAdmin) {
    if(isAdmin) {     
      this._super(ctx, frameOffset)
    }
  },
  action: function(data) {
    if(!$('.dialog').is(':visible')) {
      $(".dialog").fadeIn()
      $(".dialog .text").html(this.dialog)
    }
    else {
      dialogContainer.push(this.dialog)
    }
    this.remove = true
  }
})