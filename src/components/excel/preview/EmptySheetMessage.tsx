
interface EmptySheetMessageProps {
  sheetType: 'REPRODUCTORA' | 'ENGORDE';
}

const EmptySheetMessage = ({ sheetType }: EmptySheetMessageProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-muted-foreground">No hay datos de tipo {sheetType}</p>
    </div>
  );
};

export default EmptySheetMessage;
