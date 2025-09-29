import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, ShieldQuestion, CheckCircle } from 'lucide-react';
interface GeolocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function GeolocationPermissionModal({ isOpen, onClose }: GeolocationPermissionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-display">
            <MapPin className="w-6 h-6 mr-2 text-blue-500" />
            Ativar Localização
          </DialogTitle>
          <DialogDescription className="pt-2">
            Para registrar o ponto, precisamos da sua permissão para acessar a localização. Isso garante a segurança e a precisão dos registros.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <p>
            Seu navegador bloqueou o acesso à localização. Siga estas etapas para ativá-la:
          </p>
          <ul className="list-decimal list-inside space-y-2 pl-2">
            <li>Procure pelo ícone de cadeado <ShieldQuestion className="inline w-4 h-4" /> na barra de endereço.</li>
            <li>Clique nele e ative a opção "Localização".</li>
            <li>Recarregue a página para aplicar as alterações.</li>
          </ul>
          <div className="flex items-start p-3 mt-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <CheckCircle className="w-5 h-5 mr-3 text-blue-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Sua privacidade é importante</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Sua localização é usada apenas no momento do registro de ponto e não é compartilhada.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">Entendi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}