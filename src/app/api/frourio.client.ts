import type { FrourioClientOption } from '@frourio/next';
import { z } from 'zod';
import { fc_4y03fh, $fc_4y03fh } from './lecture/[lectureId]/participant/frourio.client';
import { fc_1ufjebb, $fc_1ufjebb } from './timetable/exists/frourio.client';
import { fc_ldcif4, $fc_ldcif4 } from './timetable/get/[userId]/frourio.client';
import { fc_w3uc3e, $fc_w3uc3e } from './timetable/register/frourio.client';
import { fc_15ctk2d, $fc_15ctk2d } from './users/[id]/frourio.client';
import { frourioSpec } from './frourio'

export const fc = (option?: FrourioClientOption) => ({
  'lecture/[lectureId]/participant': fc_4y03fh(option),
  'timetable/exists': fc_1ufjebb(option),
  'timetable/get/[userId]': fc_ldcif4(option),
  'timetable/register': fc_w3uc3e(option),
  'users/[id]': fc_15ctk2d(option),
  $url: $url(option),
  $build(req?: { init?: RequestInit }): [
    key: { dir: string },
    fetcher: () => Promise<NonNullable<Awaited<ReturnType<ReturnType<typeof methods>['$get']>>>>,
  ] {
    return [{ dir: '/api' }, () => fc(option).$get(req)];
  },
  ...methods(option),
});

export const $fc = (option?: FrourioClientOption) => ({
  'lecture/[lectureId]/participant': $fc_4y03fh(option),
  'timetable/exists': $fc_1ufjebb(option),
  'timetable/get/[userId]': $fc_ldcif4(option),
  'timetable/register': $fc_w3uc3e(option),
  'users/[id]': $fc_15ctk2d(option),
  $url: {
    get(): string {
      const result = $url(option).get();

      if (!result.isValid) throw result.reason;

      return result.data;
    },
  },
  $build(req?: { init?: RequestInit }): [
    key: { dir: string },
    fetcher: () => Promise<z.infer<typeof frourioSpec.get.res[200]['body']>>,
  ] {
    return [{ dir: '$/api' }, () => $fc(option).$get(req)];
  },
  async $get(req?: Parameters<ReturnType<typeof methods>['$get']>[0]): Promise<z.infer<typeof frourioSpec.get.res[200]['body']>> {
    const result = await methods(option).$get(req);

    if (!result.isValid) throw result.isValid === false ? result.reason : result.error;

    return result.data.body;
  },
});

const $url = (option?: FrourioClientOption) => ({
  get(): { isValid: true; data: string; reason?: undefined } | { isValid: false, data?: undefined; reason: z.ZodError } {
    return { isValid: true, data: `${option?.baseURL ?? ''}/api` };
  },
});

const methods = (option?: FrourioClientOption) => ({
  async $get(req?: { init?: RequestInit }): Promise<
    | { ok: true; isValid: true; data: { status: 200; headers?: undefined; body: z.infer<typeof frourioSpec.get.res[200]['body']> }; failure?: undefined; raw: Response; reason?: undefined; error?: undefined }
    | { ok: boolean; isValid: false; data?: undefined; failure?: undefined; raw: Response; reason: z.ZodError; error?: undefined }
    | { ok: boolean; isValid?: undefined; data?: undefined; failure?: undefined; raw: Response; reason?: undefined; error: unknown }
    | { ok?: undefined; isValid: false; data?: undefined; failure?: undefined; raw?: undefined; reason: z.ZodError; error?: undefined }
    | { ok?: undefined; isValid?: undefined; data?: undefined; failure?: undefined; raw?: undefined; reason?: undefined; error: unknown }
  > {
    const url = $url(option).get();

    if (url.reason) return url;

    const fetchFn = option?.fetch ?? fetch;
    const result: { success: true; res: Response } | { success: false; error: unknown } = await fetchFn(
      url.data,
      {
        method: 'GET',
        ...option?.init,
        ...req?.init,
        headers: { ...option?.init?.headers, ...req?.init?.headers },
      }
    ).then(res => ({ success: true, res } as const)).catch(error => ({ success: false, error }));

    if (!result.success) return { error: result.error };

    switch (result.res.status) {
      case 200: {
        const resBody: { success: true; data: unknown } | { success: false; error: unknown } = await result.res.json().then(data => ({ success: true, data } as const)).catch(error => ({ success: false, error }));

        if (!resBody.success) return { ok: true, raw: result.res, error: resBody.error };

        const body = frourioSpec.get.res[200].body.safeParse(resBody.data);

        if (!body.success) return { ok: true, isValid: false, raw: result.res, reason: body.error };

        return {
          ok: true,
          isValid: true,
          data: { status: 200, body: body.data },
          raw: result.res,
        };
      }
      default:
        return { ok: result.res.ok, raw: result.res, error: new Error(`Unknown status: ${result.res.status}`) };
    }
  },
});
