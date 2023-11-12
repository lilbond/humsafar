type Task = () => {};

class Scheduler {
	private task: Task;
	private pollingIntervalInMillis: number;
	private intervalHandle: NodeJS.Timeout | undefined;

	constructor(task: Task, pollingIntervalInMillis: number = 500) {
		this.task = task;
		this.pollingIntervalInMillis = pollingIntervalInMillis;
	}

	stop = () => {
		if (this.intervalHandle) {
			clearInterval(this.intervalHandle);
			this.intervalHandle = undefined;
		}
	};

	start = () => {
		if (!this.intervalHandle) {
			this.intervalHandle = setInterval(
				this.execute,
				this.pollingIntervalInMillis
			);
		}
	};

	private execute = () => {
		if (!this.intervalHandle) {
			return;
		}

		this.task();
	};
}
