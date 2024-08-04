export type Context = object;
export type Next = () => Promise<void> | void;
export type MiddlewareFn<T extends Context = Context> = (
  context: T,
  cb: Next
) => Promise<void>;

export class Middleware<T extends Context = Context> {
  private context: T;
  private readonly middlewares: MiddlewareFn<T>[] = [];

  async run(context: T, next: Next) {
    this.context = context;
    const stack = this.middlewares.slice().reverse(); // Create a copy and reverse

    const execute = async (index = 0) => {
      if (index >= stack.length) {
        if (next) {
          await next(); // Call the final 'next' function if provided
        }

        return;
      }

      const middleware = stack[index];
      await middleware(this.context, () => execute(index + 1));
    };

    await execute();
  }

  use(middleware: MiddlewareFn<T>) {
    this.middlewares.push(middleware);
  }
}
