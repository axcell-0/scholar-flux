type IconInputProps = {
  label: string;
  type?: string;
  placeholder: string;
  icon: string;
  name: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function IconInput({
  label,
  type = "text",
  placeholder,
  icon,
  name,
  value,
  onChange,
}: IconInputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-[11px] font-bold text-outline uppercase tracking-widest px-1"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-surface-container-low border-none rounded-xl py-4 px-5 text-[#423f8b] placeholder:text-outline/50 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-300 font-medium"
        />
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-outline/30">
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}