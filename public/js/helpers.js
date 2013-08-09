function getSequence(scenes){
  var sequence = []
  var first = _.find(scenes, function(scene){ return scene.prev == undefined })

  sequence.push([])
  sequence[sequence.length-1].push(first)

  scenes = _.filter(scenes, function(scene){ return scene.prev != undefined })

  var j = 0
  while(sequence[sequence.length-1] != [] && j<30) {
    var arrays = []
    for(var i=0; i<sequence[sequence.length-1].length; i++)
    {
      var id = sequence[sequence.length-1][i].RowKey;
      arrays.push(
        _.filter(scenes, function(scene){ 
          return scene.prev.indexOf(id) == 0
        })
      )
    }
    if(arrays.length == 0) break;
    else if(arrays.length == 1) sequence.push(arrays[0])
    else if(arrays.length == 2) sequence.push(_.union(arrays[0],arrays[1]))
    else if(arrays.length == 3) sequence.push(_.union(arrays[0],arrays[1],arrays[2]))
    else if(arrays.length == 4) sequence.push(_.union(arrays[0],arrays[1],arrays[2],arrays[3]))
    j++
  }

  return sequence
}

function getXY(canvas, e)
{
    var x = canvas.relMouseCoords(e).x - center.x + map.character.x*size - size / 2;
    var y = canvas.relMouseCoords(e).y - center.y + map.character.y*size - size / 2;
    return { x: Math.round(x / size), y: Math.round(y / size)};
}

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY - $(window).scrollTop();

    return {x:canvasX, y:canvasY}
}
HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;

(function($) {
  $.fn.writeText = function(content) {
      var contentArray = content.split(""),
          current = 0,
          elem = this;
      setInterval(function() {
          if(current < contentArray.length) {
              elem.text(elem.text() + contentArray[current++]);
          }
      }, 50);
  };
})(jQuery);