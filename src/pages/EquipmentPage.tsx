import { equipmentList } from "@/lib/equipment-data";
import { HealthRing } from "@/components/shared/HealthRing";
import { Badge } from "@/components/ui/badge";

export default function EquipmentPage() {
  return (
    <div className="space-y-6">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight font-display">Equipment Registry</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-fade-up animate-fade-up-delay-1">
        {equipmentList.map(eq => (
          <div key={eq.id} className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{eq.name}</h3>
                <p className="text-xs text-muted-foreground">{eq.type}</p>
              </div>
              <HealthRing score={eq.healthScore} size={56} strokeWidth={4} />
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zone:</span>
                <Badge variant="secondary" className="text-[10px]">{eq.zone}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age:</span>
                <span className="font-mono tabular-nums">{eq.age} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Serviced:</span>
                <span className="font-mono tabular-nums">{new Date(eq.lastServiced).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
