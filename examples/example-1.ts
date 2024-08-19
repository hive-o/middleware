import { Middleware } from '../dist/middleware';

interface A {
  s: string;
}

interface B {
  d: string;
}

async function bootstrap() {
  const a = new Middleware<A>();
  const b = new Middleware<B>();

  b.use(async (ctx, next) => {
    console.log('b');
    await next();
    console.log('b end');
  });

  a.use(async (context, cb) => {
    console.log('a');
    await cb();
    console.log('a end');
  });

  a.use(b.asMiddleware<A & B>());
  await a.run();
}

void bootstrap();
