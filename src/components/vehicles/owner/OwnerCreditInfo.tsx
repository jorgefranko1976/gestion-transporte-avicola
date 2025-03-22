
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { isAfter } from "date-fns";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle, Calendar, Check } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { vehicleFormSchema } from "../vehicleFormSchema";
import DocumentUploader from "../DocumentUploader";
import { OwnerDocumentsState } from "../VehicleOwnerInfo";

type OwnerCreditInfoProps = {
  form: UseFormReturn<z.infer<typeof vehicleFormSchema>>;
  ownerDocuments: OwnerDocumentsState;
  onDocumentUpload: (type: keyof OwnerDocumentsState, file: File | null) => void;
  onDocumentRemove: (type: keyof OwnerDocumentsState) => void;
};

const OwnerCreditInfo = ({ 
  form, 
  ownerDocuments, 
  onDocumentUpload, 
  onDocumentRemove 
}: OwnerCreditInfoProps) => {
  const [creditIsPaid, setCreditIsPaid] = useState<boolean | null>(null);

  const hasCredit = form.watch("ownerHasCredit");
  const creditEndDate = form.watch("ownerCreditEndDate");

  useEffect(() => {
    if (hasCredit === "si" && creditEndDate) {
      const isPaid = isAfter(new Date(), creditEndDate);
      setCreditIsPaid(isPaid);
    } else {
      setCreditIsPaid(null);
    }
  }, [hasCredit, creditEndDate]);

  return (
    <div>
      <h4 className="text-md font-medium mb-4">Información de crédito</h4>
      
      <FormField
        control={form.control}
        name="ownerHasCredit"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>¿Tiene crédito?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="si" />
                  </FormControl>
                  <FormLabel className="font-normal">Sí</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {hasCredit === "si" && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="ownerCreditAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor del crédito</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 50000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ownerCreditTerm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plazo del crédito (meses)</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 36" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="ownerCreditEndDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha finalización del crédito</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                        <Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex items-center col-span-full">
            {creditIsPaid !== null && (
              <Alert className={creditIsPaid ? "bg-green-50" : "bg-amber-50"}>
                <div className="flex items-center">
                  {creditIsPaid ? (
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  )}
                  <div>
                    <AlertTitle>
                      Estado: {creditIsPaid ? "PAGADO" : "PENDIENTE"}
                    </AlertTitle>
                    <AlertDescription>
                      {creditIsPaid 
                        ? "El crédito ya ha sido pagado según la fecha de finalización."
                        : "El crédito aún está pendiente de pago según la fecha de finalización."}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            )}
          </div>
          
          <div className="col-span-full">
            <DocumentUploader
              title="Paz y Salvo"
              description="Sube el documento Paz y Salvo del crédito"
              file={ownerDocuments.settlementCertificate}
              onUpload={(file) => onDocumentUpload('settlementCertificate', file)}
              onRemove={() => onDocumentRemove('settlementCertificate')}
            />
          </div>

          <div className="col-span-1">
            <DocumentUploader
              title="Pagaré Firmado"
              description="Sube el pagaré firmado"
              file={ownerDocuments.signedPromissoryNote}
              onUpload={(file) => onDocumentUpload('signedPromissoryNote', file)}
              onRemove={() => onDocumentRemove('signedPromissoryNote')}
            />
          </div>

          <div className="col-span-1">
            <DocumentUploader
              title="Carta Instrucciones Pagaré"
              description="Sube la carta de instrucciones pagaré en blanco"
              file={ownerDocuments.blankPromissoryInstructions}
              onUpload={(file) => onDocumentUpload('blankPromissoryInstructions', file)}
              onRemove={() => onDocumentRemove('blankPromissoryInstructions')}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerCreditInfo;
