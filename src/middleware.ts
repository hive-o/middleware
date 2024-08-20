export type Context = any; // TODO add extendable typecasting
export type Next = () => Promise<void> | void;
export type MiddlewareFn = (context, cb: Next) => Promise<void>;

export class Middleware {
  private readonly middlewares: MiddlewareFn[] = [];

  protected context: Context;

  asMiddleware(): MiddlewareFn {
    return async (context: Context, next: Next) => {
      await this.run(context, next);
    };
  }

  async run(contextOrNext?: Context | Next, optionalNext?: Next) {
    this.context = {} as Context;
    let next: Next | undefined = undefined;

    // Determine which argument is context and which is next
    if (typeof contextOrNext === 'function') {
      next = contextOrNext as Next;
    } else if (contextOrNext) {
      this.context = { ...this.context, ...contextOrNext };
      next = optionalNext;
    }

    const stack = this.middlewares.slice(); // Create a copy and reverse

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
    return this;
  }

  use(middleware: MiddlewareFn) {
    this.middlewares.push(middleware);
    return this;
  }
}
