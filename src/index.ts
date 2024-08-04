export type Next = () => Promise<void>;
export type Context = object;
export type MiddlewareFn = <T extends Context>(context: T, cb: Next) => Promise<void>;

export class Middleware {
  private readonly middlewares: MiddlewareFn[];

  async run(context: MiddlewareFn, next: Next) {
    const stack = this.middlewares.slice().reverse(); // Create a copy and reverse

    const execute = async (index = 0) => {
      if (index >= stack.length) {
        if (next) {
          await next(); // Call the final 'next' function if provided
        }

        return;
      }

      const middleware = stack[index];
      await middleware(context, () => execute(index + 1));
    };

    await execute();
  }

  use(middleware: MiddlewareFn) {
    this.middlewares.push(middleware);
  }
}
