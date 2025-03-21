
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, FileEdit, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GrowthProfile } from "@/lib/types";
import { growthProfiles } from "@/components/farms/production-cycle/mock-data";
import GrowthProfileForm from "./growth-profiles/GrowthProfileForm";

const GrowthProfilesSettings = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<GrowthProfile[]>(growthProfiles as unknown as GrowthProfile[]);
  const [showForm, setShowForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<GrowthProfile | null>(null);

  const handleAddProfile = () => {
    setEditingProfile(null);
    setShowForm(true);
  };

  const handleEditProfile = (profile: GrowthProfile) => {
    setEditingProfile(profile);
    setShowForm(true);
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfiles(profiles.filter(p => p.id !== profileId));
    
    toast({
      title: "Perfil eliminado",
      description: "El perfil de crecimiento ha sido eliminado correctamente",
    });
  };

  const handleSaveProfile = (profile: GrowthProfile, isNew: boolean) => {
    if (isNew) {
      setProfiles([...profiles, profile]);
      toast({
        title: "Perfil creado",
        description: "El perfil de crecimiento ha sido creado correctamente",
      });
    } else {
      setProfiles(profiles.map(p => p.id === profile.id ? profile : p));
      toast({
        title: "Perfil actualizado",
        description: "El perfil de crecimiento ha sido actualizado correctamente",
      });
    }
    
    setShowForm(false);
    setEditingProfile(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProfile(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Perfiles de Crecimiento</h2>
          <p className="text-muted-foreground">
            Gestiona las curvas de alimentación para diferentes razas y sexos
          </p>
        </div>
        
        <Button onClick={handleAddProfile} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Perfil</span>
        </Button>
      </div>

      {showForm ? (
        <GrowthProfileForm 
          profile={editingProfile} 
          onSave={handleSaveProfile}
          onCancel={handleCancelForm}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Sexo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.name}</TableCell>
                  <TableCell>
                    {profile.breed === 'cobb500' ? 'Cobb 500' : 
                     profile.breed === 'ross308' ? 'Ross 308' : 
                     profile.breed === 'hubbard' ? 'Hubbard' : 
                     profile.breed === 'arbor_acres' ? 'Arbor Acres' : 'Otras'}
                  </TableCell>
                  <TableCell>
                    {profile.sex === 'macho' ? 'Machos' : 
                     profile.sex === 'hembra' ? 'Hembras' : 'Mixto'}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      profile.active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {profile.active ? (
                        <>
                          <Check className="mr-1 h-3 w-3" />
                          <span>Activo</span>
                        </>
                      ) : (
                        <>
                          <X className="mr-1 h-3 w-3" />
                          <span>Inactivo</span>
                        </>
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEditProfile(profile)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default GrowthProfilesSettings;
