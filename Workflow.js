const { CronJob } = require('cron');

class Workflow {

	/** Public Interface Methods */
	constructor(headTask, isRecurring = false, cronPattern = "0 0 * * *") {
		if (!headTask) {
			throw new Error("Workflow DAG needs to be initialized with a root task!");
		}
		this._headTask = headTask;
		this._isRecurring = isRecurring;
		this._cronPattern = cronPattern;
		this._updateCronExecution();
	}

	getHeadTask() {
		return this._headTask;
	}

	getIsRecurring() {
		return this._isRecurring;
	}

	getCronPattern() {
		return this._cronPattern;
	}

	setIsRecurring(isRecurring) {
		this._isRecurring = isRecurring;
		this._updateCronExecution();
	}

	setCronPattern(cronPattern) {
		this._cronPattern = cronPattern;
		this._updateCronExecution();
	}

	trigger() {
		return this._executeTasks();
	}

	/** Private Interface Methods */
	
	/**
	* BFS traversal of DAG starting with headTask node
	* @return isSuccessful (boolean)
	*/
	_executeTasks() {
		const tasksSet = new Set();
		const completedTasks = [];
		const queue = [];

		queue.push(this._headTask);
		tasksSet.add(this._headTask);

		while (queue.length > 0) {
			const task = queue.shift();
			try {
				task.execute();
			} catch (err) {
				this._rollbackTasks([...completedTasks, task]);
				return false;
			}

			// add task to completedTasks
			completedTasks.push(task);

			// add task's nextTasks to queue
			task
				.getNextTasks()
				.forEach(
					t => {
						if (!tasksSet.has(t)) {
							queue.push(t);
							tasksSet.add(t);
						}
					});
		}
		return true;
	}

	_rollbackTasks(completedTasks) {
		while (completedTasks.length > 0) {
			const task = completedTasks.pop();
			task.rollback();
		}
	}

	_updateCronExecution() {
		if (this._isRecurring && this._cronPattern) {
			this._cron = new CronJob(
				this._cronPattern,
				() => this._executeTasks(), // executed function at cronPattern interval
				null, // executed function when cron job stops
				false, // start the job right now
				'America/Los_Angeles'); // timezone
		} else {
			this._cron = null;
		}
	}

}

module.exports = Workflow;