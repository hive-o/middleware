import { Middleware } from '../dist/middleware';

async function bootstrap() {
  const a = new Middleware();
  const b = new Middleware();

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

  a.use(b.asMiddleware());
  await a.run();
}

void bootstrap();
