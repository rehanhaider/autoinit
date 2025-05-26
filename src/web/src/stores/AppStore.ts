import { persistentMap } from "@nanostores/persistent";

export const $app = persistentMap<Record<string, string>>("app", {});
