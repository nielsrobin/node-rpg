var nconf = require('nconf')
  , uuid = require('node-uuid')
  , azure = require('azure');

nconf.env().file({ file: 'config.json'});

var tableName = nconf.get("TABLE_NAME")
  , partitionKey = nconf.get("PARTITION_KEY")
  , accountName = nconf.get("STORAGE_NAME")
  , accountKey = nconf.get("STORAGE_KEY");

var tableService = azure.createTableService(accountName, accountKey);

exports.list = function (req, res) {
	var partitionKey = req.route.params.actId;

	tableService.createTableIfNotExists('scenes', function(error){
		if(!error){
			var query = azure.TableQuery
				.select()
				.from('scenes')
				.where('PartitionKey eq ?', partitionKey)

			tableService.queryEntities(query, function (error, entities) {
				if (!error) {
					res.json(entities);
				}
			});
		}
  });
}

exports.read = function(req, res) {
	var rowKey = req.route.params.id;
	var partitionKey = req.route.params.actId;

	tableService.queryEntity('scenes'
    , partitionKey
    , rowKey
    , function(error, entity){
			if (!error) res.json(entity)
			else res.json(error);
	});
}

exports.create = function(req, res) {
	var scene = req.body;
	scene.RowKey = uuid();
	tableService.insertEntity('scenes', scene, function(error){
		if (!error) res.json({ success: true })
		else res.json(error);
	});
}

exports.update = function(req, res) {
	var scene = req.body;

	tableService.updateEntity('scenes', scene, function(error){
		if (!error) res.json({ success: true })
		else res.json(error);
	});
}

exports.del = function(req, res) {
	var entity = { PartitionKey: req.route.params.actId, RowKey: req.route.params.id };
  tableService.deleteEntity('scenes', entity, function (error) {
    if (!error) res.json({ success: true })
    else res.json(error);
  });
}