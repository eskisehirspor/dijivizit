import { LandingPage, landingMetadata } from "@/components/marketing/landing-page";
import { getLanding } from "@/lib/marketing/landings";

const landing = getLanding("nfc-kartvizit");

// Google ranks /kartvizit for "nfc kartvizit", which now carries this page's
// explainer and FAQ too; point the duplicate at it instead of splitting the term.
const base = landingMetadata(landing);
export const metadata = { ...base, alternates: { canonical: "/kartvizit" } };

export default function Page() {
  return <LandingPage landing={landing} />;
}
