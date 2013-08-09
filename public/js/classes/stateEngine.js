var StateEngine = Entity.extend({
  init: function(canvas){
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');

    // fixes mouse stuff
    var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
    if (document.defaultView && document.defaultView.getComputedStyle) {
        this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10) || 0;
        this.stylePaddingTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10) || 0;
        this.styleBorderLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
        this.styleBorderTop = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10) || 0;
    }
    var html = document.body.parentNode;
    this.htmlTop = html.offsetTop;
    this.htmlLeft = html.offsetLeft;

    this.interval = 250;
    this.resume();
  },
  pause: function(){
    $(document).unbind("keydown");
    clearInterval(this.running);
    this.running = undefined;
  },
  resume: function(){
    var myState = this;

    $(document).unbind("keydown");
    $(document).bind("keydown",this.keybindings);

    if(this.running == undefined)
      {
      this.running = setInterval(function () {
          myState.collision();
          myState.draw();
      }, myState.interval);
    }
    else console.log("already running");
  },
  clear: function(){
    this.ctx.clearRect(0, 0, this.width, this.height);
  },
  load: function(){
  },
  collision: function(){
  },
  draw: function(){
  },
  keybindings: function(e){
  }
});