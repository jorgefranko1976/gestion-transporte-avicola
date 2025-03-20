
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageTransition from './transitions/PageTransition';

interface HeroProps {
  className?: string;
}

export const Hero = ({ className }: HeroProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-transport-100/30 to-transparent -z-10" />
      
      <div 
        className={cn(
          'absolute top-1/2 right-1/4 w-96 h-96 bg-transport-200/20 rounded-full blur-3xl -z-10 transition-opacity duration-1000',
          isLoaded ? 'opacity-70' : 'opacity-0'
        )} 
      />
      
      <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-6">
            <PageTransition>
              <div className="inline-flex items-center px-3 py-1.5 border border-border bg-background/50 rounded-full text-sm font-medium mb-6 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-transport-500 mr-2 animate-pulse-subtle" />
                <span>Sistema de gestión para transporte en Colombia</span>
              </div>
            </PageTransition>

            <PageTransition>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Gestiona tus despachos con 
                <span className="text-transport-600 block">simplicidad y eficiencia</span>
              </h1>
            </PageTransition>

            <PageTransition>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Plataforma integral para conductores y coordinadores de despacho, optimizando la logística de transporte de carga con un diseño intuitivo y funcionalidades avanzadas.
              </p>
            </PageTransition>

            <PageTransition>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Link 
                  to="/login"
                  className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-apple hover:-translate-y-0.5 active:translate-y-0 flex-1 sm:flex-none btn-hover focus-ring"
                >
                  Comenzar ahora
                </Link>
                <Link 
                  to="/about"
                  className="px-6 py-3 bg-secondary text-foreground font-medium rounded-lg hover:bg-secondary/80 transition-all duration-300 ease-apple flex-1 sm:flex-none btn-hover focus-ring"
                >
                  Conocer más
                </Link>
              </div>
            </PageTransition>
          </div>
        </div>

        {/* Features Preview */}
        <PageTransition className="mt-20 w-full">
          <div className="relative mx-auto max-w-5xl glass-morphism rounded-2xl shadow-glass overflow-hidden transform transition-all duration-500 ease-apple hover:shadow-lg">
            <div className="h-[360px] sm:h-[420px] bg-transport-50 p-6 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-full bg-transport-100 mb-4">
                  <svg className="w-8 h-8 text-transport-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Plataforma cargando...</h3>
                <p className="text-muted-foreground max-w-md">
                  Optimiza la gestión de despachos de carga con nuestra solución integral.
                </p>
              </div>
            </div>
          </div>
        </PageTransition>
      </div>
    </div>
  );
};

export default Hero;
