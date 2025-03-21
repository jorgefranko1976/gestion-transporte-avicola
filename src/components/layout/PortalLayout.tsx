
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import PageTransition from '@/components/transitions/PageTransition';

interface PortalLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  rightContent?: ReactNode;
}

export const PortalLayout = ({ 
  children, 
  title, 
  description, 
  rightContent 
}: PortalLayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <PageTransition>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
                {description && (
                  <p className="text-muted-foreground mt-1">
                    {description}
                  </p>
                )}
              </div>
              
              {rightContent && rightContent}
            </div>
            
            {children}
          </PageTransition>
        </div>
      </main>
    </div>
  );
};
