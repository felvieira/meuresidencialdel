
import React, { useState } from 'react';
import { useAnnouncements, Announcement } from '@/hooks/use-announcements';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Edit } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AnnouncementsListProps {
  onEdit: (announcement: Announcement) => void;
}

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({ onEdit }) => {
  const { 
    announcements, 
    isLoading, 
    error, 
    getAnnouncement,
    removeAnnouncement
  } = useAnnouncements();
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<Announcement | null>(null);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };
  
  const handleViewAnnouncement = async (id: string) => {
    const announcement = await getAnnouncement(id);
    if (announcement) {
      setDetailView(announcement);
    }
  };
  
  const handleEditAnnouncement = async (id: string) => {
    const announcement = await getAnnouncement(id);
    if (announcement) {
      onEdit(announcement);
    }
  };
  
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };
  
  const confirmDelete = async () => {
    if (deleteId) {
      await removeAnnouncement(deleteId);
      setDeleteId(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary m-auto"></div>
          <p className="mt-4 text-gray-500">Carregando comunicados...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
        <p className="text-red-600">{error}</p>
        <Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {announcements.length === 0 ? (
        <div className="bg-muted/30 border border-muted rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">Nenhum comunicado encontrado.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell className="font-medium">{announcement.title}</TableCell>
                  <TableCell>{announcement.created_at ? formatDate(announcement.created_at) : '-'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => announcement.id && handleViewAnnouncement(announcement.id)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => announcement.id && handleEditAnnouncement(announcement.id)}
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => announcement.id && handleDeleteClick(announcement.id)}
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* View announcement details dialog */}
      <Dialog open={!!detailView} onOpenChange={(open) => !open && setDetailView(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{detailView?.title}</DialogTitle>
          </DialogHeader>
          
          {detailView && (
            <div className="space-y-4 mt-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Data</h4>
                <p>{detailView.created_at ? formatDate(detailView.created_at) : '-'}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Conteúdo</h4>
                <p className="text-sm whitespace-pre-line">{detailView.content}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este comunicado? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnnouncementsList;
