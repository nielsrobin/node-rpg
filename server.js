var express = require('express')
var app = express(),
    http = require('http')
    acts = require('./api/acts.js')
    scenes = require('./api/scenes.js')
    generic = require('./api/generic.js')

app.configure(function(){
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(express.static(__dirname + '/public'))
})

// web
app.get('/', function(req, res){ 
	res.sendfile(__dirname + '/public/' + 'index.html') 
})

// api
app.get('/api/acts', acts.list)
app.put('/api/acts/:id', acts.update)
app.get('/api/acts/:id', acts.read)
app.post('/api/acts', acts.create)
app.delete('/api/acts/:id', acts.del)

app.get('/api/scenes/:actId', scenes.list)
app.put('/api/scenes/:id', scenes.update)
app.get('/api/scenes/:actId/:id', scenes.read)
app.post('/api/scenes', scenes.create)
app.delete('/api/scenes/:actId/:id', scenes.del)

app.get('/api/:table', generic.list)
app.put('/api/:table/:id', generic.update)
app.get('/api/:table/:id', generic.read)
app.post('/api/:table', generic.create)
app.delete('/api/:table/:id', generic.del)

var server = require('http').createServer(app)
server.listen(process.env.PORT || 3000)