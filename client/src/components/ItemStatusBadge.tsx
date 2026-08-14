import { Badge } from "@/components/ui/badge";

const styles: Record<string, string> = {
  lost: "bg-[#fbe7de] text-[#9a482d] hover:bg-[#fbe7de]",
  found: "bg-[#e1f0e8] text-[#286244] hover:bg-[#e1f0e8]",
  resolved: "bg-[#e5edf7] text-[#31567b] hover:bg-[#e5edf7]",
  archived: "bg-[#eef0ee] text-[#6e7771] hover:bg-[#eef0ee]",
  pending: "bg-[#fff0c9] text-[#8b6410] hover:bg-[#fff0c9]",
  approved: "bg-[#dff1e6] text-[#24633e] hover:bg-[#dff1e6]",
  rejected: "bg-[#f9e2e1] text-[#9c3936] hover:bg-[#f9e2e1]",
};

export function ItemStatusBadge({ status }: { status: string }) {
  return <Badge className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold capitalize tracking-wide ${styles[status] ?? styles.archived}`}>{status}</Badge>;
}
