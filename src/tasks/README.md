## Tasks

Use Tasks module to populate the database with date from eFile.

The following data tables can be populated using tasks.
* Elections
* Committees
* Candidates
* Filings
* Transactions


Prerequisites
* Docker (see setup elsewhere)
* Postman or similar tool for making http requests.

Start all of the containers
  * postgres_dev
  * pgAdmin
  * redis

Run the npm task 'start:dev'
* To test the connection to the task processor :
* POST a request to: http://localhost:3000/tasks/check-tasks
* The response should be
{
    "check": "task checked"
}

And the console running the npm task 'start:dev' should show:
'Connection to task processor working.'

## Running the tasks
The default host of the webserver is set to localhost:3000. I a different host and port ar used then the urls below will need to be adjusted. All requests are of POST type and start with the /tasks endpoint. Some of the requests require a body to specify date ranges.

For each update task there will be no response but the console running the npm task 'start:dev' should show that the task started and completed.

### Elections
* POST: http://localhost:3000/tasks/update-elections

### Committees
* POST: http://localhost:3000/tasks/update-committees

### Candidates
Determine which election to get the candidates. Get the list of elections. Then use the `election_id` from one of the items in the POST to the update-candidates task.
* GET: http://localhost:3000/elections

Example of one item in the response
```
{
    "election_date": "11/03/2020",
    "election_id": "c0cd8d33-f9d7-0ab4-1dab-d1a37216b7b3",
    "election_type": "General",
    "internal": false,
    "createdAt": "2021-09-07T03:03:06.010Z",
    "updatedAt": "2021-09-07T03:03:06.010Z"
}
```
* POST: http://localhost:3000/tasks/update-candidates/c0cd8d33-f9d7-0ab4-1dab-d1a37216b7b3

### Filings
To add filings to the database specify the date range in the request body of the POST request.

POST: http://localhost:3000/tasks/update-filings

Example body:
```
{
    "oldestDate": "2021-07-01",
    "newestDate": "2021-09-05"
}
```
In Postman set the Body to raw and type to JSON.

### Transactions
Adding transactions is similar to adding filings.
To add transactions to the database specify the date range in the request body of the POST request.

POST: http://localhost:3000/tasks/update-transactions

Example body:
```
{
    "oldestDate": "2021-07-01",
    "newestDate": "2021-09-05"
}
```
In Postman set the Body to raw and type to JSON.
The add transactions task will show some additional detail in the console. The add transactions task will take more time to complete based on the size of the date range. 

## Viewing results be using GET requests
To see the results use pgAdmin or make GET requests using the following URLs  

* http://localhost:3000/elections
* http://localhost:3000/committees
* http://localhost:3000/candidates
* http://localhost:3000/filings
* http://localhost:3000/transactions

## Notes:
