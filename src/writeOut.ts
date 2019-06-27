import { writeFileAsync } from "./utils";

import { MedeaResponse } from "./interfaces/MedeaResponse";

export default async function writeOut(
  fileName: string,
  data: any,
  shouldLog = true
): Promise<MedeaResponse> {
  try {
    await writeFileAsync(fileName, data);

    if (shouldLog) {
      console.log(`Successfully written ${fileName}`);
    }

    return { success: true };
  } catch (error) {
    if (shouldLog) {
      console.error(`Failed to write ${fileName}`, error);
    }

    return { success: false, error };
  }
}
