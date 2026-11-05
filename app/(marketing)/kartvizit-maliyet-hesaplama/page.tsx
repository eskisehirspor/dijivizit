import { CostCalculator } from "@/components/marketing/cost-calculator";
import { ToolPage, toolMetadata } from "@/components/marketing/tool-page";
import { getTool } from "@/lib/marketing/tools";

const tool = getTool("kartvizit-maliyet-hesaplama");

export const metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage tool={tool}>
      <CostCalculator />
    </ToolPage>
  );
}
