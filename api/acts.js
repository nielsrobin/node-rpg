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
	tableService.createTableIfNotExists('acts', function(error){
		if(!error){
			var query = azure.TableQuery
				.select()
				.from('acts');

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

	tableService.queryEntity('acts'
    , 'act'
    , rowKey
    , function(error, entity){
			if (!error) res.json(entity)
			else res.json(error);
	});
}

exports.create = function(req, res) {
	var act = req.body;
	act.RowKey = uuid();
	act.PartitionKey = 'act';
	tableService.insertEntity('acts', act, function(error){
		if (!error) res.json({ success: true })
		else res.json(error);
	});
}

exports.update = function(req, res) {
	var act = req.body;

	tableService.updateEntity('acts', act, function(error){
		if (!error) res.json({ success: true })
		else res.json(error);
	});
}

exports.del = function(req, res) {
	var entity = { PartitionKey: 'act', RowKey: req.route.params.id };
  tableService.deleteEntity('acts', entity, function (error) {
    if (!error) res.json({ success: true })
    else res.json(error);
  });
}