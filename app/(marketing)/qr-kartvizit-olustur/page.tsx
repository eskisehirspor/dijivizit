import { ToolPage, toolMetadata } from "@/components/marketing/tool-page";
import { getTool } from "@/lib/marketing/tools";

const tool = getTool("qr-kartvizit-olustur");

export const metadata = toolMetadata(tool);

export default function Page() {
  return <ToolPage tool={tool} />;
}
