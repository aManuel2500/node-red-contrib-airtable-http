module.exports = function(RED) {
  const axios = require('axios');

  function AirtableHttpNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.apiKey = this.credentials.apiKey;
    node.baseId = config.baseId;
    node.tableName = config.tableName;
    node.operation = config.operation;

    node.on('input', async function(msg, send, done) {
      send = send||function() { node.send.apply(node, arguments) };
      const op = node.operation === 'variable' ? msg.operation : node.operation;
      if (!op) {
        node.error('Operation not specified', msg);
        return;
      }
      const headers = { Authorization: `Bearer ${node.apiKey}` };
      const urlBase = `https://api.airtable.com/v0/${node.baseId}/${encodeURIComponent(node.tableName)}`;

      try {
        let response;
        switch (op) {
          case 'list': {
            const params = {};
            if (config.view) params.view = config.view;
            if (config.filterByFormula) params.filterByFormula = config.filterByFormula;
            if (config.fields) params.fields = config.fields.split(',').map(f => f.trim());
            if (config.sortField) {
              params.sort = [{ field: config.sortField, direction: config.sortDirection || 'asc' }];
            }
            response = await axios.get(urlBase, { headers, params });
            msg.payload = response.data.records;
            break;
          }
          case 'get': {
            const id = config.recordId || msg.recordId;
            response = await axios.get(`${urlBase}/${id}`, { headers });
            msg.payload = response.data;
            break;
          }
          case 'create': {
            const fields = msg.payload.fields;
            response = await axios.post(urlBase, { fields }, { headers });
            msg.payload = response.data;
            break;
          }
          case 'update': {
            const id = config.recordId || msg.recordId;
            const fields = msg.payload.fields;
            response = await axios.patch(`${urlBase}/${id}`, { fields }, { headers });
            msg.payload = response.data;
            break;
          }
          case 'delete': {
            const id = config.recordId || msg.recordId;
            response = await axios.delete(`${urlBase}/${id}`, { headers });
            msg.payload = response.data;
            break;
          }
          default:
            throw new Error(`Unsupported operation: ${op}`);
        }
        send(msg);
        if (done) done();
      } catch (err) {
        node.error(err.message, msg);
        if (done) done(err);
      }
    });
  }

  RED.nodes.registerType('airtable-http', AirtableHttpNode, {
    credentials: {
      apiKey: { type: 'password' }
    }
  });
};