import AIAssistant from "@/components/dashboard/AIAssistant";

const AIAssistantPage = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-1">AI Assistant</h1>
      <p className="text-muted-foreground text-sm">Lightweight railway intelligence model for natural language insights</p>
    </div>
    <div className="max-w-3xl">
      <AIAssistant />
    </div>
  </div>
);

export default AIAssistantPage;
