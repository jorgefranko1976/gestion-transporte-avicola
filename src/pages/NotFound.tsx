
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Link } from "react-router-dom";
import PageTransition from "@/components/transitions/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <PageTransition>
          <div className="text-center max-w-md">
            <h1 className="text-8xl font-bold text-primary">404</h1>
            <p className="text-xl mt-4 mb-6">La página que estás buscando no existe.</p>
            <Link 
              to="/" 
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ease-apple hover:-translate-y-0.5 active:translate-y-0 btn-hover focus-ring"
            >
              Volver al inicio
            </Link>
          </div>
        </PageTransition>
      </div>
    </div>
  );
};

export default NotFound;
