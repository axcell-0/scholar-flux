type AuthTabsProps = {
  activeTab: "signup" | "login";
  onTabChange: (tab: "signup" | "login") => void;
};

export function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <nav className="flex bg-[#eff4ff] p-1.5 rounded-2xl mb-10">
      <button
        type="button"
        onClick={() => onTabChange("signup")}
        className={`flex-1 py-3 text-sm font-bold font-headline rounded-xl transition-all duration-300 ${
          activeTab === "signup"
            ? "bg-white text-[#3525cd] shadow-sm"
            : "text-[#777587] hover:text-[#eaf1ff]"
        }`}
      >
        Sign Up
      </button>

      <button
        type="button"
        onClick={() => onTabChange("login")}
        className={`flex-1 py-3 text-sm font-bold font-headline rounded-xl transition-all duration-300 ${
          activeTab === "login"
            ? "bg-white text-[#3525cd] shadow-sm"
            : "text-[#777587] hover:text-[#eaf1ff]"
        }`}
      >
        Log In
      </button>
    </nav>
  );
}