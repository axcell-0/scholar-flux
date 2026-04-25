type AuthTabsProps = {
  activeTab: "signup" | "login";
  onTabChange: (tab: "signup" | "login") => void;
};

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <nav className="flex bg-surface-container p-1.5 rounded-2xl mb-10">
      <button
        type="button"
        onClick={() => onTabChange("signup")}
        className={`flex-1 py-3 text-sm font-bold font-headline rounded-xl transition-all duration-300 ${
          activeTab === "signup"
            ? "bg-white text-primary shadow-sm"
            : "text-outline hover:bg-white/50"
        }`}
      >
        Sign Up
      </button>

      <button
        type="button"
        onClick={() => onTabChange("login")}
        className={`flex-1 py-3 text-sm font-bold font-headline rounded-xl transition-all duration-300 ${
          activeTab === "login"
            ? "bg-white text-primary shadow-sm"
            : "text-outline hover:bg-white/50"
        }`}
      >
        Log In
      </button>
    </nav>
  );
}