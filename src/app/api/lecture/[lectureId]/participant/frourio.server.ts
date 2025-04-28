import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { frourioSpec } from './frourio';
import type { GET } from './route';

type RouteChecker = [typeof GET];

export const paramsSchema = z.object({ 'lectureId': z.string() });

type ParamsType = z.infer<typeof paramsSchema>;

type SpecType = typeof frourioSpec;

type Controller = {
  get: (
    req: {
      params: ParamsType;
    },
  ) => Promise<
    | {
        status: 200;
        body: z.infer<SpecType['get']['res'][200]['body']>;
      }
    | {
        status: 500;
        body: z.infer<SpecType['get']['res'][500]['body']>;
      }
  >;
};

type MethodHandler = (req: NextRequest | Request, option: { params: Promise<ParamsType> }) => Promise<NextResponse>;;

type ResHandler = {
  GET: MethodHandler
};

export const createRoute = (controller: Controller): ResHandler => {
  const middleware = (next: (
    args: { req: NextRequest, params: ParamsType },
  ) => Promise<NextResponse>): MethodHandler => async (originalReq, option) => {
    const req = originalReq instanceof NextRequest ? originalReq : new NextRequest(originalReq);
    const params = paramsSchema.safeParse(await option.params);

    if (params.error) return createReqErr(params.error);


      return await next({ req, params: params.data })
      
    
  };

  return {
    GET: middleware(async ({ req, params }) => {
      const res = await controller.get({ params });

      switch (res.status) {
        case 200: {
          const body = frourioSpec.get.res[200].body.safeParse(res.body);

          if (body.error) return createResErr();

          return createResponse(body.data, { status: 200 });
        }
        case 500: {
          const body = frourioSpec.get.res[500].body.safeParse(res.body);

          if (body.error) return createResErr();

          return createResponse(body.data, { status: 500 });
        }
        default:
          throw new Error(res satisfies never);
      }
    }),
  };
};

const createResponse = (body: unknown, init: ResponseInit): NextResponse => {
  if (
    ArrayBuffer.isView(body) ||
    body === undefined ||
    body === null ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    body instanceof FormData ||
    body instanceof ReadableStream ||
    body instanceof URLSearchParams ||
    typeof body === 'string'
  ) {
    return new NextResponse(body, init);
  }

  return NextResponse.json(body, init);
};

type FrourioError =
  | { status: 422; error: string; issues: { path: (string | number)[]; message: string }[] }
  | { status: 500; error: string; issues?: undefined };

const createReqErr = (err: z.ZodError) =>
  NextResponse.json<FrourioError>(
    {
      status: 422,
      error: 'Unprocessable Entity',
      issues: err.issues.map((issue) => ({ path: issue.path, message: issue.message })),
    },
    { status: 422 },
  );

const createResErr = () =>
  NextResponse.json<FrourioError>(
    { status: 500, error: 'Internal Server Error' },
    { status: 500 },
  );
