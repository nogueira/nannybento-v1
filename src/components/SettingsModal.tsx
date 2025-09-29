import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/hooks/useNotifications';
interface SettingsModalProps {
  children: React.ReactNode;
}
export function SettingsModal({ children }: SettingsModalProps) {
  const { isEnabled, toggleNotifications } = useNotifications();
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>
            Gerencie suas preferências de notificação aqui.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="notifications-switch" className="text-base">
                Notificações no Navegador
              </Label>
              <p className="text-sm text-muted-foreground">
                Receba alertas sobre o fim do expediente e outras informações importantes.
              </p>
            </div>
            <Switch
              id="notifications-switch"
              checked={isEnabled}
              onCheckedChange={toggleNotifications}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}