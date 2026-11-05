import { EmailSignatureBuilder } from "@/components/marketing/email-signature-builder";
import { ToolPage, toolMetadata } from "@/components/marketing/tool-page";
import { getTool } from "@/lib/marketing/tools";

const tool = getTool("e-posta-imzasi-olustur");

export const metadata = toolMetadata(tool);

export default function Page() {
  return (
    <ToolPage tool={tool}>
      <EmailSignatureBuilder />
    </ToolPage>
  );
}
