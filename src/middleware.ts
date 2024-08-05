export type Context = object;
export type Next = () => Promise<void> | void;
export type MiddlewareFn<T extends Context = Context> = (
  context: T,
  cb: Next
) => Promise<void>;

export class Middleware<T extends Context = Context> {
  private readonly middlewares: MiddlewareFn<T>[] = [];
  protected context: T; // Class property to hold the context

  async run(contextOrNext?: Next | T, optionalNext?: Next) {
    this.context = {} as T;
    let next: Next | undefined = undefined;

    // Determine which argument is context and which is next
    if (typeof contextOrNext === 'function') {
      next = contextOrNext;
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

  use(middleware: MiddlewareFn<T>) {
    this.middlewares.push(middleware);
    return this;
  }
}
