
import { Truck, FileSpreadsheet, UserCheck, BarChart3 } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { FeatureCard } from '@/components/FeatureCard';
import { Navbar } from '@/components/Navbar';
import PageTransition from '@/components/transitions/PageTransition';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-16">
        <Hero className="py-16 md:py-24" />
        
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <PageTransition>
              <div className="text-center mb-16">
                <div className="inline-flex items-center px-3 py-1 border border-border rounded-full text-sm font-medium mb-4">
                  <span>Características principales</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Todo lo que necesitas para gestionar tus despachos
                </h2>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                  Nuestra plataforma ofrece herramientas intuitivas para optimizar el proceso de transporte de carga desde el origen hasta el destino.
                </p>
              </div>
            </PageTransition>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PageTransition>
                <FeatureCard
                  icon={<Truck className="w-6 h-6" />}
                  title="Gestión de Vehículos"
                  description="Administra toda la información de tu flota de vehículos, incluyendo documentación y asignación de conductores."
                />
              </PageTransition>
              
              <PageTransition>
                <FeatureCard
                  icon={<UserCheck className="w-6 h-6" />}
                  title="Gestión de Conductores"
                  description="Enrola y administra conductores con toda su información personal, documentos y observaciones."
                />
              </PageTransition>
              
              <PageTransition>
                <FeatureCard
                  icon={<FileSpreadsheet className="w-6 h-6" />}
                  title="Carga de Despachos"
                  description="Sube archivos Excel con información de despachos diarios de manera sencilla e intuitiva."
                />
              </PageTransition>
              
              <PageTransition>
                <FeatureCard
                  icon={<BarChart3 className="w-6 h-6" />}
                  title="Reportes Detallados"
                  description="Genera informes por fecha, destino, conductor o vehículo para análisis y seguimiento."
                />
              </PageTransition>
            </div>
          </div>
        </section>
        
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <PageTransition>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Simplifica la gestión logística de tus despachos
                </h2>
                <p className="text-muted-foreground mb-8">
                  Diseñado específicamente para empresas de transporte en Colombia, nuestra aplicación agiliza la comunicación entre coordinadores y conductores.
                </p>
                <button 
                  onClick={() => navigate('/coordinator')}
                  className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-apple hover:-translate-y-0.5 active:translate-y-0 btn-hover focus-ring"
                >
                  Comenzar ahora
                </button>
              </div>
            </PageTransition>
          </div>
        </section>
      </main>
      
      <footer className="bg-background border-t border-border py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 font-semibold mb-4 md:mb-0">
              <Truck className="w-5 h-5 text-primary" />
              <span>Transport App</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Transport App. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
