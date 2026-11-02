"use client";

import { useEffect } from "react";

import { trackViewItem } from "@/lib/analytics";

/** Records a product page view (GA4 view_item, Meta ViewContent). */
export function TrackViewItem({ id, name, price }: { id: string; name: string; price: number }) {
  useEffect(() => {
    trackViewItem({ id, name, price });
  }, [id, name, price]);
  return null;
}
