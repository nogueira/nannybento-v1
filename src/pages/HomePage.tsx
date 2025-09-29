import { useNavigate } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/store/userStore';
import { useEffect, useState } from 'react';
import { PasswordModal } from '@/components/PasswordModal';
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};
const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};
const DILMA_IMAGE_URL = 'https://i.ibb.co/hJHkYqDQ/dil2.jpg?q=80&w=256&h=256&auto=format&fit=crop';
export function HomePage() {
  const navigate = useNavigate();
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  useEffect(() => {
    setCurrentUser(null);
  }, [setCurrentUser]);
  const handleProfileSelect = (profile: 'dilma' | 'carla') => {
    setCurrentUser(profile);
    if (profile === 'carla') {
      navigate('/employer');
    } else {
      setIsPasswordModalOpen(true);
    }
  };
  const handlePasswordSuccess = () => {
    setIsPasswordModalOpen(false);
    navigate('/babysitter');
  };
  return (
    <>
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={handlePasswordSuccess}
      />
      <div className="flex flex-col items-center justify-center space-y-16">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 dark:text-white">
            Bem-vindo ao PontoNanny
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Selecione seu perfil para continuar. O controle de ponto inteligente e moderno para babás.
          </p>
        </motion.div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card
              onClick={() => handleProfileSelect('dilma')}
              className="text-center p-6 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:border-blue-500 dark:hover:border-blue-500"
            >
              <CardHeader className="items-center">
                <Avatar className="w-20 h-20 mb-4 border-4 border-white dark:border-gray-800">
                  <AvatarImage src={DILMA_IMAGE_URL} alt="Dilma" />
                  <AvatarFallback className="bg-blue-100 dark:bg-blue-900/50 text-blue-500 font-bold text-2xl">D</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl font-bold">Dilma</CardTitle>
                <CardDescription className="text-base text-gray-500 dark:text-gray-400">Babá</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Registre suas entradas, saídas e pausas com facilidade.</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card
              onClick={() => handleProfileSelect('carla')}
              className="text-center p-6 cursor-pointer transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:border-green-500 dark:hover:border-green-500"
            >
              <CardHeader className="items-center">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-4 border-4 border-white dark:border-gray-800">
                  <Briefcase className="w-10 h-10 text-green-500" />
                </div>
                <CardTitle className="text-2xl font-bold">Carla</CardTitle>
                <CardDescription className="text-base text-gray-500 dark:text-gray-400">Empregador</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Acesse relatórios detalhados e monitore as horas trabalhadas.</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        <div className="pt-8">
          <p className="text-sm text-gray-400 dark:text-gray-500">v1.0</p>
        </div>
      </div>
    </>
  );
}