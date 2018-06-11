class Task {

	/** Public Interface Methods */

	/**
	* Task Constructor
	* @param function (function) - function to execute
	* @param nextTasks (List<Task>) - list of tasks to execute afterwards
	* @param retries (int) - times to retry execution
	* @param rollback (function) - function to execute if failure
	*/
	constructor(fxn, nextTasks = [], retries = 0, rollback = null) {
		if (!fxn) {
			throw new Error("Task needs to be initialized with function to execute!");
		}
		this._fxn = fxn;
		this._nextTasks = nextTasks;
		this._retries = retries;
		this._rollback = rollback;
	}

	getNextTasks() {
		return this._nextTasks;
	}

	setNextTasks(tasks) {
		this._nextTasks = tasks;
	}

	execute() {
		this._execute(0);
	}

	rollback() {
		return this._rollback ? this._rollback() : null;
	}

	/** Private Interface Methods */
	_execute(count) {
		try {
			this._fxn();
		} catch (err) {
			console.error(`Error with executing task during attempt ${count + 1}.`, err);
			if (++count > this._retries) {
				throw new Error(
					`Task failed after attempting ${count} ${count > 1 ? "times" : "time"}!`,
					err);
			}
			this._execute(count);
		}
	}
}

module.exports = Task;