
import { DocumentsSection } from "./DocumentsSection";
import { QuickAccessSection } from "./QuickAccessSection";

export const DocumentAndQuickAccessSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="col-span-2">
        <DocumentsSection />
      </div>
      
      <div>
        <QuickAccessSection />
      </div>
    </div>
  );
};
