import React, { useState } from 'react';
import { useAnnouncements, Announcement } from '@/hooks/use-announcements';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Mail, MessageCircleMore, Printer } from 'lucide-react';
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
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { jsPDF } from 'jspdf';

interface AnnouncementsListProps {
  onEdit?: (announcement: Announcement) => void;
  isResident?: boolean;
}

const ITEMS_PER_PAGE = 6;

const AnnouncementsList: React.FC<AnnouncementsListProps> = ({ onEdit, isResident = false }) => {
  const { 
    announcements, 
    isLoading, 
    error, 
    getAnnouncement,
    removeAnnouncement
  } = useAnnouncements();
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailView, setDetailView] = useState<Announcement | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
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
  
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };
  
  const confirmDelete = async () => {
    if (deleteId) {
      await removeAnnouncement(deleteId);
      setDeleteId(null);
    }
  };

  // Generate enhanced PDF for printing
  const handlePrintAnnouncement = async (id: string) => {
    const announcement = await getAnnouncement(id);
    if (announcement) {
      const doc = new jsPDF();
      
      // Add background color at the top
      doc.setFillColor(155, 135, 245); // Primary Purple from the theme
      doc.rect(0, 0, 210, 40, 'F');
      
      // Add logo or header image (if available)
      // For now, we'll use a decorative element
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(1);
      doc.line(20, 25, 190, 25);
      
      // Add the main title with white color on purple background
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("COMUNICADO OFICIAL", 105, 15, { align: "center" });
      
      // Add condominium name (placeholder - would come from user context in a real app)
      doc.setFontSize(12);
      doc.text("CONDOMÍNIO", 105, 30, { align: "center" });
      
      // Reset colors for the rest of the document
      doc.setTextColor(0, 0, 0);
      
      // Add a decorative line
      doc.setDrawColor(155, 135, 245);
      doc.setLineWidth(0.5);
      doc.line(20, 50, 190, 50);
      
      // Add information header section
      doc.setFillColor(240, 240, 250); // Light purple background
      doc.rect(20, 55, 170, 30, 'F');
      
      // Add the date
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      const dateText = announcement.created_at 
        ? `Data: ${formatDate(announcement.created_at)}` 
        : `Data: ${formatDate(new Date().toISOString())}`;
      doc.text(dateText, 30, 65);
      
      // Add reference number (using ID as reference)
      const referenceNumber = announcement.id ? 
        `Nº REF: ${announcement.id.substring(0, 8).toUpperCase()}` : 
        `Nº REF: ${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      doc.text(referenceNumber, 30, 75);
      
      // Add visual icon/decoration to separate content sections
      doc.setFillColor(155, 135, 245);
      doc.circle(105, 95, 3, 'F');
      
      // Add document title with improved styling
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text(announcement.title.toUpperCase(), 105, 110, { align: "center" });
      
      // Add a small decorative element
      doc.setLineWidth(0.5);
      doc.line(85, 115, 125, 115);
      
      // Add the content of the announcement with better formatting
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      
      // Split content to fit the page width with better margins
      const splitContent = doc.splitTextToSize(announcement.content, 150);
      doc.text(splitContent, 30, 130);
      
      // Add decorative footer line
      doc.setDrawColor(155, 135, 245);
      doc.setLineWidth(0.5);
      doc.line(20, 250, 190, 250);
      
      // Add signature area
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Administração do Condomínio", 105, 260, { align: "center" });
      
      // Add signature line
      doc.setLineWidth(0.2);
      doc.line(65, 270, 145, 270);
      
      // Add date for the signature
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Documento gerado em ${format(new Date(), 'dd/MM/yyyy', { locale: ptBR })}`, 105, 280, { align: "center" });
      
      // Add document ID at the bottom
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`ID: ${announcement.id || "NOVO COMUNICADO"}`, 105, 287, { align: "center" });
      
      // Save the PDF with proper name formatting
      const safeTitle = announcement.title
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')
        .toLowerCase();
      doc.save(`comunicado_${safeTitle}.pdf`);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);
  const paginatedAnnouncements = announcements.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
    <Card className="overflow-hidden border-t-4 border-t-brand-600 shadow-md">
      {announcements.length === 0 ? (
        <div className="bg-muted/30 border border-muted rounded-lg p-8 text-center">
          <p className="text-muted-foreground mb-4">Nenhum comunicado encontrado.</p>
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead className="text-center">Data</TableHead>
                <TableHead className="text-center">Enviado por</TableHead>
                <TableHead className="text-center w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAnnouncements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell className="font-medium">{announcement.title}</TableCell>
                  <TableCell className="text-center">{announcement.created_at ? formatDate(announcement.created_at) : '-'}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Mail 
                              className={`h-4 w-4 ${announcement.sent_by_email ? 'text-green-500' : 'text-gray-300'}`} 
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {announcement.sent_by_email ? "Enviado por e-mail" : "Não enviado por e-mail"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <MessageCircleMore 
                              className={`h-4 w-4 ${announcement.sent_by_whatsapp ? 'text-green-500' : 'text-gray-300'}`}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {announcement.sent_by_whatsapp ? "Enviado por WhatsApp" : "Não enviado por WhatsApp"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => announcement.id && handleViewAnnouncement(announcement.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {!isResident && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => announcement.id && handlePrintAnnouncement(announcement.id)}
                          >
                            <Printer className="h-4 w-4 text-blue-500" />
                          </Button>
                          
                          {onEdit && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => announcement.id && handleDeleteClick(announcement.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="py-4 border-t">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={currentPage === index + 1}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
      
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
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Enviado via</h4>
                <div className="flex space-x-4 mt-1">
                  <div className="flex items-center">
                    <Mail className={`h-4 w-4 mr-2 ${detailView.sent_by_email ? 'text-green-500' : 'text-gray-300'}`} />
                    <span>{detailView.sent_by_email ? 'E-mail' : 'Não enviado por e-mail'}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircleMore className={`h-4 w-4 mr-2 ${detailView.sent_by_whatsapp ? 'text-green-500' : 'text-gray-300'}`} />
                    <span>{detailView.sent_by_whatsapp ? 'WhatsApp' : 'Não enviado por WhatsApp'}</span>
                  </div>
                </div>
              </div>
              
              {!isResident && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => detailView.id && handlePrintAnnouncement(detailView.id)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                </div>
              )}
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
    </Card>
  );
};

export default AnnouncementsList;
