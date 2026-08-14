import { ItemStatusBadge } from "@/components/ItemStatusBadge";
import { Card } from "@/components/ui/card";
import { CalendarDays, ChevronRight, MapPin } from "lucide-react";
import { Link } from "wouter";

type ItemCardProps = {
  item: { id: number; title: string; description: string; reportType: string; status: string; category: string; eventDate: string; location: string; imageUrl: string | null; reporterName?: string | null };
};

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden rounded-2xl border-[#e3e7e1] bg-white p-0 shadow-[0_2px_4px_rgba(29,50,42,.03)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_35px_rgba(29,50,42,.11)]">
        <div className="relative h-44 overflow-hidden bg-[#edf1ea]">
          {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_25%_25%,#dbe6d7,transparent_32%),linear-gradient(135deg,#f1f2ea,#e3ebdf)]"><span className="rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-xs font-medium text-[#587064]">No photo provided</span></div>}
          <div className="absolute left-3 top-3 flex gap-2"><ItemStatusBadge status={item.status} /><span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold capitalize text-[#44564e] backdrop-blur">{item.reportType} report</span></div>
        </div>
        <div className="flex flex-col gap-3 p-4.5">
          <div className="flex items-start justify-between gap-3"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#789083]">{item.category}</p><h3 className="line-clamp-1 text-base font-semibold tracking-[-0.02em] text-[#263630]">{item.title}</h3></div><ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[#94a59a] transition-transform group-hover:translate-x-0.5" /></div>
          <p className="line-clamp-2 text-sm leading-6 text-[#6b7771]">{item.description}</p>
          <div className="flex flex-col gap-1.5 border-t border-[#eef0ed] pt-3 text-xs text-[#72807a]"><span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#517566]" />{item.location}</span><span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-[#517566]" />{item.eventDate}</span></div>
        </div>
      </Card>
    </Link>
  );
}
