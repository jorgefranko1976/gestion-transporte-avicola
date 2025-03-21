
import { DocumentCard } from "@/components/dashboard/document-card";
import { documentsToExpire } from "@/data/mockData";

export const DocumentsSection = () => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Documentos por Vencer</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentsToExpire.map(doc => (
          <DocumentCard key={doc.id} {...doc} />
        ))}
      </div>
    </div>
  );
};
