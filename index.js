const Workflow = require('./Workflow');
const Task = require('./Task');

/** Synchronous Successful Execution */
console.log("\n***********************************");
console.log("Successful Triggered Execution");
console.log("***********************************\n");

const taskA = new Task(() => console.log("Executing Task A"));
const taskB = new Task(() => console.log("Executing Task B"));
const taskC = new Task(() => console.log("Executing Task C"));
const taskD = new Task(() => console.log("Executing Task D"));

taskA.setNextTasks([taskB, taskC]);
taskB.setNextTasks([taskD]);
taskC.setNextTasks([taskD]);

const successWorkflow = new Workflow(taskA);

// TODO: write text that taskD is only executed once.
const isSuccessful = successWorkflow.trigger();

console.log("Workflow success:", isSuccessful);


/** Synchronous Exception with Rollback Execution */
console.log("\n\n\n***********************************");
console.log("Failed Retry Rollback Execution");
console.log("***********************************\n");

const taskX = new Task(
	() => console.log("Executing Task X"),
	[],
	0,
	() => console.error("Rolling back Task X"));
const taskY = new Task(
	() => console.log("Executing Task Y"),
	[],
	0,
	() => console.error("Rolling back Task Y"));
const taskZ = new Task(
	() => { throw new Error("Fail Task Z") },
	[],
	1,
	() => console.error("Do nothing for rollback Task Z"));

taskX.setNextTasks([taskY]);
taskY.setNextTasks([taskZ]);

const rollbackWorkflow = new Workflow(taskX);
const rollbackSuccess = rollbackWorkflow.trigger();

console.log("Rollback Workflow success:", !rollbackSuccess);

