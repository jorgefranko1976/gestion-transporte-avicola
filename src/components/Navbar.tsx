
import { cn } from '@/lib/utils';
import { Menu, Truck, User, X, Wheat, Settings, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const NavLink = ({ to, children, icon }: { to: string; children: React.ReactNode; icon?: React.ReactNode }) => {
    const isActive = location.pathname === to;

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(to);
    };

    return (
      <Link
        to={to}
        onClick={handleClick}
        className={cn(
          'relative px-3 py-2 text-sm rounded-lg transition-all duration-300 ease-apple hover:bg-muted flex items-center gap-2',
          isActive ? 'text-primary font-medium' : 'text-muted-foreground'
        )}
      >
        {icon}
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 w-1/2 h-0.5 bg-primary transform -translate-x-1/2 rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-apple py-4',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg shadow-subtle border-b border-border/50' 
          : 'bg-transparent',
        className
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-xl"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          <Truck className="w-6 h-6 text-primary" />
          <span className="animate-slide-up">Transport App</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink to="/driver" icon={<User className="w-4 h-4" />}>Panel de Conductor</NavLink>
          <NavLink to="/coordinator" icon={<User className="w-4 h-4" />}>Panel de Coordinador</NavLink>
          <NavLink to="/vehicles" icon={<Truck className="w-4 h-4" />}>Vehículos</NavLink>
          <NavLink to="/farms" icon={<Wheat className="w-4 h-4" />}>Granjas</NavLink>
          <NavLink to="/drivers" icon={<User className="w-4 h-4" />}>Conductores</NavLink>
          <NavLink to="/pesv" icon={<AlertTriangle className="w-4 h-4" />}>PESV</NavLink>
          <NavLink to="/settings" icon={<Settings className="w-4 h-4" />}>Configuración</NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ease-apple",
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div
            className={cn(
              "absolute top-0 right-0 h-full w-3/4 max-w-sm bg-card p-6 shadow-lg border-l transition-transform duration-300 ease-apple",
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center gap-2 font-semibold text-xl"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
              >
                <Truck className="w-6 h-6 text-primary" />
                <span>Transport App</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-foreground rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              <Link 
                to="/driver" 
                className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/driver');
                  setMobileMenuOpen(false);
                }}
              >
                <User className="w-4 h-4" />
                <span>Panel de Conductor</span>
              </Link>
              
              <Link 
                to="/coordinator" 
                className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/coordinator');
                  setMobileMenuOpen(false);
                }}
              >
                <User className="w-4 h-4" />
                <span>Panel de Coordinador</span>
              </Link>
              
              <Link 
                to="/vehicles" 
                className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/vehicles');
                  setMobileMenuOpen(false);
                }}
              >
                <Truck className="w-4 h-4" />
                <span>Vehículos</span>
              </Link>
              
              <Link 
                to="/farms" 
                className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/farms');
                  setMobileMenuOpen(false);
                }}
              >
                <Wheat className="w-4 h-4" />
                <span>Granjas</span>
              </Link>
              
              <Link 
                to="/drivers" 
                className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/drivers');
                  setMobileMenuOpen(false);
                }}
              >
                <User className="w-4 h-4" />
                <span>Conductores</span>
              </Link>
              
              <Link 
                to="/pesv" 
                className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/pesv');
                  setMobileMenuOpen(false);
                }}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>PESV</span>
              </Link>
              
              <Link 
                to="/settings" 
                className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/settings');
                  setMobileMenuOpen(false);
                }}
              >
                <Settings className="w-4 h-4" />
                <span>Configuración</span>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
