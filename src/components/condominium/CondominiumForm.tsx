
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InfoCondominio } from './form-sections/InfoCondominio';
import { InfoRepresentante } from './form-sections/InfoRepresentante';
import { PlanoContrato } from './form-sections/PlanoContrato';
import { Seguranca } from './form-sections/Seguranca';
import type { FormFields } from '@/hooks/use-condominium-form';

interface CondominiumFormProps {
  form: any;
  onSubmit: (data: FormFields) => void;
  isSubmitting: boolean;
  isExistingRecord: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleAtivoStatus: () => void;
}

export const CondominiumForm = ({
  form,
  onSubmit,
  isSubmitting,
  isExistingRecord,
  handleInputChange,
  toggleAtivoStatus
}: CondominiumFormProps) => {
  const ativo = form.watch('ativo');
  
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <InfoCondominio handleInputChange={handleInputChange} />
        <InfoRepresentante handleInputChange={handleInputChange} />
        <PlanoContrato handleInputChange={handleInputChange} />
        <Seguranca 
          handleInputChange={handleInputChange}
          isExistingRecord={isExistingRecord}
        />
        
        <div className="flex justify-end gap-4">
          {isExistingRecord && (
            <Button 
              type="button" 
              onClick={toggleAtivoStatus}
              variant={ativo ? "destructive" : "default"}
              className={ativo ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {ativo ? 'Desativar Usuário' : 'Ativar Usuário'}
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-brand-600 hover:bg-brand-700"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Salvando...' : (isExistingRecord ? 'Atualizar Cadastro' : 'Salvar Cadastro')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
