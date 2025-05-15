node-red-contrib-airtable-http

This is my first repo and i also vibe coded almost all of it, so use at your own risk! 😅

A Node-RED node to interact with Airtable via direct HTTP requests (no airtable.js dependency).

Features

Operations: list, get, create, update, delete, or variable (use msg.operation)

List Options: filter by view, fields, formula, and sort

Lightweight (Axios-based)

Full control over HTTP headers, pagination, and error handling

Prerequisites

Node.js v14 or later

Node-RED v2.0 or later

An Airtable API key

Your Airtable Base ID (e.g. appXXXXXXXXXXXXXX)

Installation

# From your Node-RED user directory (~/.node-red)
npm install node-red-contrib-airtable-http

Then restart Node-RED and add the Airtable HTTP node from the palette.

Configuration

API Key: In Node-RED, go to Manage Palette → Credentials → Airtable HTTP and set your Airtable API key.

Base ID: Enter your Airtable Base ID (e.g. appXXXXXXXXXXXXXX).

Table Name: Name of the table in Airtable (e.g. Tasks).

Operation:

list: Retrieve multiple records

get: Retrieve a single record by ID

create: Create a new record (use msg.payload.fields)

update: Update an existing record by ID (use msg.payload.fields)

delete: Delete a record by ID

variable: Choose operation at runtime via msg.operation

List Operation Settings

View: (optional) name of the view to fetch

Fields: comma-separated list of fields to return (e.g. Name,Amount)

Filter By Formula: Airtable formula (e.g. {Status} = 'Done')

Sort Field & Direction: sort key and order (asc or desc)

Usage Examples

1. List Records

{
    "id": "airtable1",
    "type": "airtable-http",
    "baseId": "appXXXXXXXXXXXXXX",
    "tableName": "Tasks",
    "operation": "list",
    "view": "Grid view",
    "fields": "Name,Status,Due",
    "filterByFormula": "{Status} = 'Open'",
    "sortField": "Due",
    "sortDirection": "asc"
}

2. Get a Record

{
    "id": "airtable2",
    "type": "airtable-http",
    "baseId": "appXXXXXXXXXXXXXX",
    "tableName": "Tasks",
    "operation": "get",
    "recordId": "recXXXXXXXXXXXXXX"
}

3. Create a Record

// In a function node before airtable-http:
msg.payload = { fields: { Name: 'New Task', Status: 'Open' } };
return msg;

Set Operation to create on the Airtable HTTP node.

4. Update a Record

msg.recordId = 'recXXXXXXXXXXXXXX';
msg.payload = { fields: { Status: 'Done' } };
return msg;

Set Operation to update.

5. Delete a Record

msg.recordId = 'recXXXXXXXXXXXXXX';
return msg;

Set Operation to delete.

6. Variable Operation

msg.operation = 'create';
msg.payload = { fields: { Name: 'Dynamic Task' } };
return msg;

Select Operation = variable in the node.

Error Handling

Errors are sent to the Node-RED debug console.

HTTP status and error messages are included in msg.error.

License

MIT © Your Name

