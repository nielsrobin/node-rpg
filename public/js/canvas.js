var keyboard = new Keyboard(),
    map,
    size = 64,
    center = { x: 0, y: 0 }
    sprites = ['64x64.png','angband_terrain_tiles_02.png','dungeon_old_style_01_64.jpg','mockup_128_pixel_tiles_01.png','tileset_base_preview.jpg']

function startMap(canvas, tiles, character, isAdminMode) {
    center = {x: (canvas.width-size)/2, y: (canvas.height-size)/2 };
    if(map != undefined) map.pause();

    if(isAdminMode) map = new AdminMapStateEngine(canvas)
    else map = new MapStateEngine(canvas);

    map.load(tiles, character);
}

function setMapSize(canvas) {
    canvas.attr("width", $("body").width());
    canvas.attr("height", $(document).height()-40);
}

function initEditor(cs){
    cs.each(function(){
        canvasToTile($(this), {size: 32})
    });
}

function canvasToTile(canvas, tile) {
    canvas.attr("width", tile.size);
    canvas.attr("height", tile.size);
    var x = canvas.attr("data-x");
    var y = canvas.attr("data-y");
    var ctx = canvas[0].getContext('2d')

    var img = new Image();
    img.onload = function(){
        ctx.drawImage(img,x*size,y*size,size,size,0,0,tile.size,tile.size);
    };
    img.src = canvas.attr("data-src");
}