## Populating the database with data from eFile using the tasks endpoints

The following data tables can be populated:
* Elections
* Candidates
* Committees
* Filings
* Transactions

Prerequisites
* Docker (see setup in other README)
* Postman or similar tool for making http requests.

Start all of the Docker containers
  * postgres_dev
  * pgAdmin
  * redis

Run the npm task `start:dev`
## Running the update tasks
The default host of the webserver is set to `localhost:3000`. If a different host and port are used then the urls below will need to be adjusted. All requests are of `POST` type. Some of the requests require sending date ranges in the body of the request.

For each update task there will be no response on success but the console running the npm task `start:dev` should show that the task started and completed.

### Elections
Add all of the elections from eFile.
* POST http://localhost:3000/task/update/elections

### Candidates
Add candidates for the 11/03/2020 General Election which has the election_id of `c0cd8d33-f9d7-0ab4-1dab-d1a37216b7b3`. Additional elections can also be added. To determine the `election_id` of other elections check the response from a GET request to /elections or look at the contents of the file `sample_data/elections.json`.

* POST http://localhost:3000/task/update/candidates/c0cd8d33-f9d7-0ab4-1dab-d1a37216b7b3

### Committees
Add the committee names. These are required for the process/committee task.
* POST http://localhost:3000/task/update/committees

### Filings
The filings require sending the date range in the BODY of the request. The range can be changed from what is shown here. In Postman choose the Body option in the drop down then choose raw and JSON. 

* POST http://localhost:3000/task/update/filings


BODY Examples:
```
{
    "oldestDate": "2018-01-01",
    "newestDate": "2021-09-15"
}
```
```
{
    "oldestDate": "2021-07-01",
    "newestDate": "2021-09-05"
}
```

### Transactions
Adding transactions is similar to adding filings.
To add transactions to the database specify the date range in the request body of the POST request.

* POST http://localhost:3000/task/update/transactions

Example BODY: see filings above

Running /task/update/transactions may take several minutes to complete for the date range show above. To reduce the time set the dates of the range closer to each other. This task will show some additional details in the console.

## Running the process tasks
Use POST requests to process the committees and filings

The committees task depends on the committees and candidates data. This task looks at each candidate and then looks for a committee match in committees data then adds the committee name to the candidate.

* POST http://localhost:3000/task/process/committee

The filings task depends on the filings and transactions data. This task looks at each filings and then determines if the related transactions should be used or not used for the chart calculations. This is needed so that the transactions of amended filings are not used in the chart calculations.
* POST http://localhost:3000/task/process/filing

## Viewing results be using GET requests
To see the results use pgAdmin or make GET requests using the following URLs  

* http://localhost:3000/elections
* http://localhost:3000/committees
* http://localhost:3000/candidates
* http://localhost:3000/filings
* http://localhost:3000/transactions

## Resetting the data in the tables
If there is a need to remove all of the data from the database do the following.
* Use pgAdmin to truncate each of the tables in the database.

## Notes:
