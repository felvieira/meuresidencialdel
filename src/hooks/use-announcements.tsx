
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAnnouncements, 
  getAnnouncementById, 
  saveAnnouncement, 
  deleteAnnouncement 
} from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';

export interface Announcement {
  id?: string;
  matricula: string;
  title: string;
  content: string;
  date?: string;
  created_at?: string;
  updated_at?: string;
  sent_email?: boolean;
  sent_whatsapp?: boolean;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useApp();

  const selectedCondominium = user?.selectedCondominium || '';

  const fetchAnnouncements = async () => {
    if (!selectedCondominium) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getAnnouncements(selectedCondominium);
      // Type assertion to ensure proper typing
      setAnnouncements(data as Announcement[] || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Falha ao carregar comunicados");
      toast({
        title: "Erro",
        description: "Falha ao carregar comunicados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAnnouncement = async (id: string) => {
    try {
      const data = await getAnnouncementById(id);
      return data as Announcement | null;
    } catch (err) {
      console.error("Error fetching announcement:", err);
      toast({
        title: "Erro",
        description: "Falha ao carregar comunicado",
        variant: "destructive"
      });
      return null;
    }
  };

  const createAnnouncement = async (announcementData: Announcement) => {
    try {
      // Create a new object without the date field for database persistence
      const { date, ...dataToSave } = announcementData;
      
      const result = await saveAnnouncement({
        ...dataToSave,
        matricula: selectedCondominium
      });
      
      toast({
        title: "Sucesso",
        description: "Comunicado criado com sucesso",
      });
      
      await fetchAnnouncements();
      return result;
    } catch (err) {
      console.error("Error creating announcement:", err);
      toast({
        title: "Erro",
        description: "Falha ao criar comunicado",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateAnnouncement = async (announcementData: Announcement) => {
    try {
      // Create a new object without the date field for database persistence
      const { date, ...dataToSave } = announcementData;
      
      const result = await saveAnnouncement(dataToSave);
      
      toast({
        title: "Sucesso",
        description: "Comunicado atualizado com sucesso",
      });
      
      // Update the local state to reflect changes
      setAnnouncements(prev => 
        prev.map(item => item.id === announcementData.id ? {...item, ...announcementData} : item)
      );
      
      return result;
    } catch (err) {
      console.error("Error updating announcement:", err);
      toast({
        title: "Erro",
        description: "Falha ao atualizar comunicado",
        variant: "destructive"
      });
      return null;
    }
  };

  const removeAnnouncement = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      
      toast({
        title: "Sucesso",
        description: "Comunicado excluído com sucesso",
      });
      
      // Update the local state to remove the deleted item
      setAnnouncements(prev => prev.filter(item => item.id !== id));
      
      return true;
    } catch (err) {
      console.error("Error deleting announcement:", err);
      toast({
        title: "Erro",
        description: "Falha ao excluir comunicado",
        variant: "destructive"
      });
      return false;
    }
  };

  // Initial load of announcements
  useEffect(() => {
    if (selectedCondominium) {
      fetchAnnouncements();
    }
  }, [selectedCondominium]);

  return {
    announcements,
    isLoading,
    error,
    fetchAnnouncements,
    getAnnouncement,
    createAnnouncement,
    updateAnnouncement,
    removeAnnouncement
  };
}
