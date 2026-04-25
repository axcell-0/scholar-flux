type StatCardProps = {
  label: string;
  value: string;
  sublabel?: string;
  icon: string;
  accent: "primary" | "secondary" | "tertiary";
};

const accentMap: Record<
  StatCardProps["accent"],
  { bg: string; icon: string }
> = {
  primary: { bg: "bg-[#3525cd]/10", icon: "text-[#3525cd]" },
  secondary: { bg: "bg-[#006c49]/10", icon: "text-[#006c49]" },
  tertiary: { bg: "bg-tertiary/10", icon: "text-tertiary" },
};

export function StatCard({
  label,
  value,
  sublabel,
  icon,
  accent,
}: StatCardProps) {
  const accentClasses = accentMap[accent];

  return (
    <div className="bg-[#eff4ff] rounded-2xl p-4 md:p-5 border border-[#c7c4d8]/30 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentClasses.bg}`}
      >
        <span className={`material-symbols-outlined ${accentClasses.icon}`}>
          {icon}
        </span>
      </div>

      <div className="flex-1">
        <p className="text-xs text-[#777587] font-medium uppercase tracking-widest">
          {label}
        </p>
        <p className="text-xl font-headline font-bold text-[#eaf1ff]">
          {value}
        </p>
        {sublabel && (
          <p className="text-[11px] text-[#777587] mt-1">{sublabel}</p>
        )}
      </div>
    </div>
  );
}