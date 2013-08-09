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
	var table = req.route.params.table

	tableService.createTableIfNotExists(table, function(error){
		if(!error){
			var query = azure.TableQuery
				.select()
				.from(table);

			tableService.queryEntities(query, function (error, entities) {
				if (!error) {
					res.json(entities);
				}
			});
		}
  });
}

exports.read = function(req, res) {
	var table = req.route.params.table
	var rowKey = req.route.params.id

	tableService.queryEntity(table
		, table
    , rowKey
    , function(error, entity){
			if (!error) res.json(entity)
			else res.json(error);
	});
}

exports.create = function(req, res) {
	var table = req.route.params.table
	var row = req.body

	row.RowKey = uuid()
	row.PartitionKey = table

	tableService.insertEntity(table, row, function(error){
		if (!error) res.json({ success: true })
		else res.json(error);
	});
}

exports.update = function(req, res) {
	var table = req.route.params.table
	var row = req.body

	tableService.updateEntity(table, row, function(error){
		if (!error) res.json({ success: true })
		else res.json(error);
	});
}

exports.del = function(req, res) {
	var table = req.route.params.table
	var rowKey = req.route.params.id
	var row = { PartitionKey: table, RowKey: rowKey };

  tableService.deleteEntity(table, row, function (error) {
    if (!error) res.json({ success: true })
    else res.json(error);
  });
}