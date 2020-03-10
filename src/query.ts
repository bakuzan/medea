import fetch from 'node-fetch';

import { MedeaResponse } from './interfaces/MedeaResponse';
import { QueryOptions } from './interfaces/QueryOptions';

export default async function query(
  endpoint: string,
  options?: QueryOptions
): Promise<MedeaResponse> {
  const { shouldLog = true, dataFn = 'json', ...queryOptions } = options || {};

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      ...queryOptions
    });

    const result = await response[dataFn]();

    if (result.errors) {
      const error = result.errors[0];
      if (shouldLog) {
        console.log(`Bad Response.\n\r${error.message}`);
      }

      return { success: false, error };
    }

    return { success: true, data: result.data ? result.data : result };
  } catch (error) {
    if (shouldLog) {
      console.log(`Fetch failed.\n\r${error.message}`);
    }

    return { success: false, error };
  }
}
