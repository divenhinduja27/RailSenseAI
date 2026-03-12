import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Bell, Monitor, Database } from "lucide-react";

const SettingsPanel = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="glass-card p-6">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
          <Settings className="h-5 w-5 text-primary" /> General Settings
        </h3>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Real-time Updates</Label>
              <p className="text-xs text-muted-foreground">Receive live delay and congestion data</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Auto-refresh Dashboard</Label>
              <p className="text-xs text-muted-foreground">Refresh every 30 seconds</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label>Refresh Interval</Label>
            <Select defaultValue="30">
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="300">5 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
          <Bell className="h-5 w-5 text-primary" /> Notifications
        </h3>
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Delay Alerts</Label>
              <p className="text-xs text-muted-foreground">Notify when delays exceed threshold</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium">Cascade Warnings</Label>
              <p className="text-xs text-muted-foreground">Alert on critical cascade events</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="space-y-2">
            <Label>Delay Threshold (minutes)</Label>
            <Input type="number" defaultValue="30" className="bg-secondary border-border" />
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-6">
          <Database className="h-5 w-5 text-primary" /> API Configuration
        </h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Backend API URL</Label>
            <Input placeholder="https://api.railway-intelligence.in" className="bg-secondary border-border font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input type="password" placeholder="••••••••••••" className="bg-secondary border-border font-mono text-sm" />
          </div>
          <Button className="mt-2">Save Configuration</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
