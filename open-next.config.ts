// OpenNext adapter config for Cloudflare Workers.
// No incremental cache binding: the app renders per request (auth, cookies)
// and revalidatePath only needs to drop in-process cache entries.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
