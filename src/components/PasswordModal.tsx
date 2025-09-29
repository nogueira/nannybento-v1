import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
// Hardcoded password for Dilma's profile
const CORRECT_PASSWORD = '2114';
export function PasswordModal({ isOpen, onClose, onSuccess }: PasswordModalProps) {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleVerify = () => {
    setIsLoading(true);
    setError(null);
    // Simulate a network request for better UX
    setTimeout(() => {
      if (value === CORRECT_PASSWORD) {
        toast.success('Acesso autorizado!');
        onSuccess();
      } else {
        toast.error('Senha incorreta. Tente novamente.');
        setError('Senha incorreta.');
        setValue(''); // Reset input on failure
      }
      setIsLoading(false);
    }, 500);
  };
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset state when closing
      setValue('');
      setError(null);
      setIsLoading(false);
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4 border-4 border-white dark:border-gray-800">
            <KeyRound className="w-8 h-8 text-blue-500" />
          </div>
          <DialogTitle className="text-2xl font-display">Acesso Restrito</DialogTitle>
          <DialogDescription className="pt-2">
            Por favor, insira a senha de 4 dígitos para acessar o perfil de Dilma.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 flex flex-col items-center space-y-4">
          <InputOTP
            maxLength={4}
            value={value}
            onChange={(val) => setValue(val)}
            onComplete={handleVerify}
            disabled={isLoading}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleVerify}
            disabled={isLoading || value.length < 4}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verificar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}