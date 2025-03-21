
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExcelPreviewData } from '@/lib/types';
import ReproductoraSheetPreview from './ReproductoraSheetPreview';
import EngordeSheetPreview from './EngordeSheetPreview';
import EmptySheetMessage from './EmptySheetMessage';

interface PreviewTabsProps {
  previewData: ExcelPreviewData;
}

const PreviewTabs = ({ previewData }: PreviewTabsProps) => {
  const [activeSheet, setActiveSheet] = useState<'reproductora' | 'engorde'>('reproductora');

  return (
    <Tabs 
      value={activeSheet} 
      onValueChange={(v) => setActiveSheet(v as 'reproductora' | 'engorde')}
      className="flex-1 flex flex-col"
    >
      <TabsList className="mb-2">
        <TabsTrigger value="reproductora" className="flex items-center gap-1">
          <span>REPRODUCTORA</span>
          <span className="bg-primary/10 text-primary text-xs py-0.5 px-1.5 rounded-full">
            {previewData.reproductora.length}
          </span>
        </TabsTrigger>
        <TabsTrigger value="engorde" className="flex items-center gap-1">
          <span>ENGORDE</span>
          <span className="bg-primary/10 text-primary text-xs py-0.5 px-1.5 rounded-full">
            {previewData.engorde.length}
          </span>
        </TabsTrigger>
      </TabsList>
      
      <div className="flex-1 overflow-auto border rounded-md">
        <TabsContent value="reproductora" className="m-0 h-full">
          {previewData.reproductora.length > 0 ? (
            <ReproductoraSheetPreview data={previewData.reproductora} />
          ) : (
            <EmptySheetMessage sheetType="REPRODUCTORA" />
          )}
        </TabsContent>
        
        <TabsContent value="engorde" className="m-0 h-full">
          {previewData.engorde.length > 0 ? (
            <EngordeSheetPreview data={previewData.engorde} />
          ) : (
            <EmptySheetMessage sheetType="ENGORDE" />
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default PreviewTabs;
