# Clearmetal Distributed Workflow Orchestrator Challenge

Guidelines for the orchestrator
1. Task can be reccurring or one-time
2. Task can have dependencies.

## Execution
`npm install && npm start`

This will run a once manually triggered example and a Failed retry with rollback example.


## Model Architecture
### Classes
- Workflow
	- headTask (Task) - Required
	- isRecurring (boolean) - Default false
	- cronPattern (string) - Default "0 0 * * *" - Everyday at midnight
	- cron (Cron) * from cron library - Set based on isRecurring and cronPattern members
- Task
	- fcn (function) - Required
	- nextTasks (List<Task>) - Default []
	- retries (int) - Default 0 
	- rollback (function) - Default null


### Class Descriptions
Workflow stores the head Task node of a DAG. This level of abstraction holds workflow execution level information like if the workflow should be recurring and the subsequent cron schedule it should be executed if it is recurring. The interface also allows for manually triggering the workflow tasks execution.

Each Task has a function which is executed when called and an optional rollback function. There is a retries count member that determines how many times a Task can be executed when it fails and throws an error.


## Features
### Distributed Task Processing
Tasks can be executed on remote servers in an RPC or lambda-esque fashion but making say HTTP or some other protocol requests within the Task function. NOTE: there need to be some changes with the execute methods to support async operations with node.js.

### Complex Dependency Checking
This is accomplished by representing the Tasks relationships to each other as a DAG. You can create complex task dependency relationships.

### Graceful Failure
This is orchestrated at the Workflow level. Currently the individual rollback functions are stored at the Task level. When a Task fails to execute successfully for however many retries it is allowed to attempt, it 

### Retries
This is implemented in the Task interface where the executed function is recursively called up to a maximum number of time.


## TODOs
- Pass arguments into the Task functions to be executed.
- More complex rollback logic. Decouple it from the Task execution DAG. Potentially have a separate RollbackTask executors. Also implement retry logic for rollback executors.
- Unit and Integration Tests
- Write example for cron
- Rewrite to support async executed functions and then write example/test for it
