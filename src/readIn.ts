/* tslint:disable:no-bitwise */
import fs from "fs";
import { accessAsync, readFileAsync } from "./utils";

import { MedeaResponse } from "./interfaces/MedeaResponse";
import { ReadOptions } from "./interfaces/ReadOptions";

function getAccessType(read: boolean, write: boolean) {
  if (!read && !write) {
    throw new Error("No access type provided.");
  }

  if (read && write) {
    return fs.constants.R_OK | fs.constants.W_OK;
  } else if (write) {
    return fs.constants.W_OK;
  } else {
    return fs.constants.R_OK;
  }
}

export default async function readIn(
  fileName: string,
  options?: ReadOptions
): Promise<MedeaResponse> {
  const { read = true, write = false, shouldLog = true } = options || {};

  try {
    const accessType = getAccessType(read, write);
    await accessAsync(fileName, accessType);

    const data = await readFileAsync(fileName, "utf-8");

    return { success: true, data };
  } catch (error) {
    if (shouldLog) {
      console.error(`Failed to read ${fileName}`, error);
    }

    return { success: false, error };
  }
}
