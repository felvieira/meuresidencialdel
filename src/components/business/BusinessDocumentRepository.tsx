
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useBusinessDocuments } from '@/hooks/use-business-documents';
import { BusinessDocumentForm } from './BusinessDocumentForm';
import { BusinessDocumentsList } from './BusinessDocumentsList';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

const ITEMS_PER_PAGE = 6;

export const BusinessDocumentRepository = () => {
  const { 
    form, 
    documents, 
    isLoading, 
    resetForm, 
    onSubmit, 
    deleteDocument,
    isSubmitting, 
    isDeleting,
    attachments,
    existingAttachments,
    handleFileChange,
    removeFile,
    removeExistingAttachment,
    getFileUrl,
    uploadProgress,
    isUploading,
    fetchDocuments,
    fetchAttachments
  } = useBusinessDocuments();
  
  const [showForm, setShowForm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = documents ? Math.ceil(documents.length / ITEMS_PER_PAGE) : 1;
  const paginatedDocuments = documents ? documents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  ) : [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNewDocument = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditDocument = (document: any) => {
    resetForm(document);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    setShowForm(false);
  };

  const handleDeleteClick = (id: string) => {
    setDocumentToDelete(id);
  };

  const confirmDelete = () => {
    if (documentToDelete) {
      deleteDocument(documentToDelete);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Repositório de Documentos</h2>
          <p className="text-muted-foreground">
            Gerencie documentos relevantes para administração do negócio
          </p>
        </div>
        {!showForm && (
          <Button onClick={handleNewDocument} className="bg-brand-600 hover:bg-brand-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Documento
          </Button>
        )}
      </div>

      <div className="border-t pt-6">
        {showForm ? (
          <Card className="border-t-4 border-t-brand-600 shadow-md">
            <BusinessDocumentForm
              form={form}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
              isEditing={!!form.getValues().id}
              onCancel={handleCancelForm}
              attachments={attachments}
              existingAttachments={existingAttachments}
              handleFileChange={handleFileChange}
              removeFile={removeFile}
              removeExistingAttachment={removeExistingAttachment}
              getFileUrl={getFileUrl}
              uploadProgress={uploadProgress}
              isUploading={isUploading}
            />
          </Card>
        ) : (
          <BusinessDocumentsList
            documents={paginatedDocuments}
            onEdit={handleEditDocument}
            onDelete={handleDeleteClick}
            isDeleting={isDeleting}
            getFileUrl={getFileUrl}
            fetchAttachments={fetchAttachments}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <AlertDialog open={!!documentToDelete} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação de Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
