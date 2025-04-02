
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Copy, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { generatePixCode, generatePixQRCode } from '@/utils/pixGenerator';
import { supabase } from '@/integrations/supabase/client';

interface HistoricalDataPixSectionProps {
  matricula: string;
}

export const HistoricalDataPixSection = ({ matricula }: HistoricalDataPixSectionProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pixCode, setPixCode] = useState<string>('');
  
  const { data: pixSettings } = useQuery({
    queryKey: ['pix-key', 'historical-data'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('pix_key_meuresidencial')
          .select('tipochave, chavepix')
          .single();
          
        if (error) {
          console.error('Error fetching PIX key:', error);
          return null;
        }
        
        return data;
      } catch (err) {
        console.error('Error in PIX key fetch:', err);
        return null;
      }
    }
  });
  
  useEffect(() => {
    if (pixSettings && matricula) {
      setIsLoading(true);
      
      try {
        let keyType: 'CPF' | 'CNPJ' | 'EMAIL' | 'TELEFONE';
        switch(pixSettings.tipochave) {
          case 'CPF': keyType = 'CPF'; break;
          case 'CNPJ': keyType = 'CNPJ'; break;
          case 'EMAIL': keyType = 'EMAIL'; break; 
          case 'TELEFONE': keyType = 'TELEFONE'; break;
          default: keyType = 'CPF';
        }
        
        const code = generatePixCode({
          keyType,
          pixKey: pixSettings.chavepix,
          amount: 249.00,
          condominiumName: 'Dados Históricos',
          matricula,
          isHistorical: true
        });
        
        setPixCode(code);
        
        generatePixQRCode(code).then(url => {
          setQrCodeUrl(url);
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Error generating PIX code:', error);
        setIsLoading(false);
      }
    }
  }, [pixSettings, matricula]);
  
  const handleCopyClick = () => {
    if (!pixCode) {
      toast.error('Código PIX não disponível. Tente novamente mais tarde.');
      return;
    }
    
    navigator.clipboard.writeText(pixCode)
      .then(() => {
        toast.success('Código PIX copiado para a área de transferência');
      })
      .catch(() => {
        toast.error('Falha ao copiar. Tente copiar manualmente.');
      });
  };
  
  if (!pixSettings && !isLoading) {
    return (
      <Card className="border-t-4 border-t-amber-500 shadow-md mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-lg mb-2">Chave PIX não configurada</h3>
              <p className="text-gray-600 mb-2">
                Para disponibilizar pagamento via PIX, você precisa configurar uma chave PIX no sistema.
              </p>
              <Button variant="outline" size="sm" asChild>
                <a href="/cadastro-chave-pix">Configurar Chave PIX</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-t-4 border-t-blue-500 shadow-md mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <QrCode className="mr-2 h-5 w-5 text-blue-500" />
          Pagamento via PIX
        </CardTitle>
        <CardDescription>
          Taxa de processamento: R$ 249,00
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-2 flex justify-center">
            {isLoading ? (
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            ) : qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR Code PIX" className="h-32 w-32 object-contain" />
            ) : (
              <div className="text-center text-gray-500">
                <AlertCircle className="h-10 w-10 mx-auto mb-2" />
                <p>Não foi possível gerar o QR Code.</p>
              </div>
            )}
          </div>
          
          <div className="md:col-span-3 flex flex-col space-y-3">
            <Button 
              onClick={handleCopyClick} 
              variant="outline"
              className="border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 gap-2"
            >
              <Copy className="h-4 w-4" />
              Copiar código PIX
            </Button>
            
            <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
              <p className="text-sm text-amber-700 flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span><strong>Importante:</strong> Somente após o pagamento, preencher e enviar a solicitação abaixo.</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
