import SettingsPanel from "@/components/dashboard/SettingsPanel";

const SettingsPage = () => (
  <div className="p-6 space-y-6">
    <div>
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-muted-foreground text-sm">Configure platform preferences & API connections</p>
    </div>
    <SettingsPanel />
  </div>
);

export default SettingsPage;
