type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

const defer = <T>() => {
  let resolve: (value: T) => void;
  let reject: (error: unknown) => void;
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return { promise, resolve: resolve!, reject: reject! };
};

const TaskStatus = {
  Pending: 'pending',
  InProgress: 'in-progress',
  Done: 'done',
  Error: 'error',
} as const;
type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

type PendingTaskRecord<Result> = {
  data: {
    status: typeof TaskStatus.Pending;
    deferred: Deferred<Result>;
    task: () => Promise<Result>;
  };
};

type InProgressTaskRecord<Result> = {
  data: {
    status: typeof TaskStatus.InProgress;
    promise: Promise<Result>;
    deferred: Deferred<Result>;
  };
};

type DoneTaskRecord<Result> = {
  data: {
    status: typeof TaskStatus.Done;
    result: Result;
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ErrorTaskRecord<_Result> = {
  data: {
    status: typeof TaskStatus.Error;
    error: unknown;
  };
};

type TaskRecord<Result> =
  | PendingTaskRecord<Result>
  | InProgressTaskRecord<Result>
  | DoneTaskRecord<Result>
  | ErrorTaskRecord<Result>;

type TaskRecordStatic = {
  make<Result>(task: () => Promise<Result>): PendingTaskRecord<Result>;

  isPending<Result>(
    record: TaskRecord<Result>,
  ): record is PendingTaskRecord<Result>;
  isInProgress<Result>(
    record: TaskRecord<Result>,
  ): record is InProgressTaskRecord<Result>;
  isDone<Result>(record: TaskRecord<Result>): record is DoneTaskRecord<Result>;
  isError<Result>(
    record: TaskRecord<Result>,
  ): record is ErrorTaskRecord<Result>;

  start<Result>(
    record: TaskRecord<Result>,
  ): asserts record is InProgressTaskRecord<Result>;
  finish<Result>(
    record: TaskRecord<Result>,
    result: Result,
  ): asserts record is DoneTaskRecord<Result>;
  fail<Result>(
    record: TaskRecord<Result>,
    error: unknown,
  ): asserts record is ErrorTaskRecord<Result>;
};

const TaskRecord: TaskRecordStatic = {
  make: <Result>(task: () => Promise<Result>): PendingTaskRecord<Result> => ({
    data: {
      status: TaskStatus.Pending,
      deferred: defer<Result>(),
      task,
    },
  }),

  isPending: <Result>(
    record: TaskRecord<Result>,
  ): record is PendingTaskRecord<Result> =>
    record.data.status === TaskStatus.Pending,
  isInProgress: <Result>(
    record: TaskRecord<Result>,
  ): record is InProgressTaskRecord<Result> =>
    record.data.status === TaskStatus.InProgress,
  isDone: <Result>(
    record: TaskRecord<Result>,
  ): record is DoneTaskRecord<Result> => record.data.status === TaskStatus.Done,
  isError: <Result>(
    record: TaskRecord<Result>,
  ): record is ErrorTaskRecord<Result> =>
    record.data.status === TaskStatus.Error,

  start: <Result>(
    record: TaskRecord<Result>,
  ): asserts record is InProgressTaskRecord<Result> => {
    if (!TaskRecord.isPending(record)) {
      throw new Error('Cannot start a task that is not pending');
    }
    (record.data as unknown as InProgressTaskRecord<Result>['data']) = {
      status: TaskStatus.InProgress,
      promise: record.data.task(),
      deferred: record.data.deferred,
    };
  },

  finish: <Result>(
    record: TaskRecord<Result>,
    result: Result,
  ): asserts record is DoneTaskRecord<Result> => {
    if (!TaskRecord.isInProgress(record)) {
      throw new Error('Cannot finish a task that is not in progress');
    }
    record.data.deferred.resolve(result);
    (record.data as unknown as DoneTaskRecord<Result>['data']) = {
      status: TaskStatus.Done,
      result,
    };
  },

  fail: <Result>(
    record: TaskRecord<Result>,
    error: unknown,
  ): asserts record is ErrorTaskRecord<Result> => {
    if (!TaskRecord.isInProgress(record)) {
      throw new Error('Cannot fail a task that is not in progress');
    }
    record.data.deferred.reject(error);
    (record.data as unknown as ErrorTaskRecord<Result>['data']) = {
      status: TaskStatus.Error,
      error,
    };
  },
};
export class TaskQueue<Result> {
  private queue: Map<string, TaskRecord<Result>> = new Map();
  private subscriberMap: Map<string, Set<(status: TaskStatus) => void>> =
    new Map();
  private processing = false;

  private notify(id: string) {
    const record = this.queue.get(id);
    if (record) {
      const subscribers = this.subscriberMap.get(id);
      if (subscribers) {
        subscribers.forEach((subscriber) => subscriber(record.data.status));
      }
    }
  }

  private async processQueue() {
    this.processing = true;
    while (this.queue.size > 0) {
      const [id, record] = this.queue.entries().next().value as [
        string,
        TaskRecord<Result>,
      ];
      try {
        TaskRecord.start(record);
        console.log('Starting task', id);
        const result = await record.data.promise;
        console.log('Finishing task', id);
        TaskRecord.finish(record, result);
      } catch (e) {
        console.log('Failing task', id);
        TaskRecord.fail(record, e);
      } finally {
        this.notify(id);
        this.queue.delete(id);
      }
    }
    this.processing = false;
  }

  async add<T extends Result>(id: string, task: () => Promise<T>): Promise<T> {
    if (this.queue.has(id)) {
      console.log('Task already in queue', id);
      return (this.queue.get(id) as
        | PendingTaskRecord<Result>
        | InProgressTaskRecord<Result>)!.data.deferred.promise as Promise<T>;
    }

    const record = TaskRecord.make(task);
    const promise = record.data.deferred.promise;

    console.log('Adding task to queue', id);

    this.queue.set(id, record as any);
    this.notify(id);
    if (!this.processing) {
      this.processQueue();
    }
    return promise;
  }

  getStatus(id: string): TaskStatus | undefined {
    const record = this.queue.get(id);
    if (record) {
      return record.data.status;
    }
  }

  subscribe(id: string, subscriber: (status: TaskStatus) => void) {
    let subscribers = this.subscriberMap.get(id);
    if (!subscribers) {
      subscribers = new Set();
      this.subscriberMap.set(id, subscribers);
    }
    subscribers.add(subscriber);
    return () => {
      subscribers!.delete(subscriber);
    };
  }
}
