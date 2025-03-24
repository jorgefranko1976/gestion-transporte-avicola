export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dispatches: {
        Row: {
          accepted_at: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          destination: string
          driver_id: string | null
          eta: string | null
          id: string
          loading_company: string | null
          observations: string | null
          order_id: string
          receipt_image_url: string | null
          status: string | null
          vehicle_plate: string | null
        }
        Insert: {
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          destination: string
          driver_id?: string | null
          eta?: string | null
          id?: string
          loading_company?: string | null
          observations?: string | null
          order_id: string
          receipt_image_url?: string | null
          status?: string | null
          vehicle_plate?: string | null
        }
        Update: {
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          destination?: string
          driver_id?: string | null
          eta?: string | null
          id?: string
          loading_company?: string | null
          observations?: string | null
          order_id?: string
          receipt_image_url?: string | null
          status?: string | null
          vehicle_plate?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dispatches_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispatches_vehicle_plate_fkey"
            columns: ["vehicle_plate"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["plate"]
          },
        ]
      }
      driver_documents: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string
          driver_id: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url: string
          driver_id?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string
          driver_id?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_documents_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_observations: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          document_url: string | null
          driver_id: string | null
          id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          document_url?: string | null
          driver_id?: string | null
          id?: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          document_url?: string | null
          driver_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_observations_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          active: boolean | null
          address: string | null
          assigned_vehicle_id: string | null
          birth_date: string | null
          created_at: string | null
          emergency_contact: string | null
          first_name: string
          hire_date: string
          id: string
          identification_number: string
          identification_type: string
          last_name: string
          license_expiration: string | null
          phone: string | null
          termination_date: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          assigned_vehicle_id?: string | null
          birth_date?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          first_name: string
          hire_date: string
          id?: string
          identification_number: string
          identification_type: string
          last_name: string
          license_expiration?: string | null
          phone?: string | null
          termination_date?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          assigned_vehicle_id?: string | null
          birth_date?: string | null
          created_at?: string | null
          emergency_contact?: string | null
          first_name?: string
          hire_date?: string
          id?: string
          identification_number?: string
          identification_type?: string
          last_name?: string
          license_expiration?: string | null
          phone?: string | null
          termination_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_assigned_vehicle_id_fkey"
            columns: ["assigned_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      excel_files: {
        Row: {
          engorde_count: number | null
          file_url: string
          id: string
          name: string
          records: number | null
          repro_count: number | null
          status: string | null
          type: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          engorde_count?: number | null
          file_url: string
          id?: string
          name: string
          records?: number | null
          repro_count?: number | null
          status?: string | null
          type: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          engorde_count?: number | null
          file_url?: string
          id?: string
          name?: string
          records?: number | null
          repro_count?: number | null
          status?: string | null
          type?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      farms: {
        Row: {
          address: string | null
          capacity: number | null
          city: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          department: string | null
          id: string
          name: string
          status: string | null
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          city?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          id?: string
          name: string
          status?: string | null
        }
        Update: {
          address?: string | null
          capacity?: number | null
          city?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          department?: string | null
          id?: string
          name?: string
          status?: string | null
        }
        Relationships: []
      }
      production_cycles: {
        Row: {
          bird_sex: string | null
          bird_type: string
          created_at: string | null
          created_by: string | null
          current_bird_count: number | null
          end_date: string | null
          farm_id: string | null
          growth_profile_id: string | null
          id: string
          initial_bird_count: number
          notes: string | null
          start_date: string
          status: string | null
        }
        Insert: {
          bird_sex?: string | null
          bird_type: string
          created_at?: string | null
          created_by?: string | null
          current_bird_count?: number | null
          end_date?: string | null
          farm_id?: string | null
          growth_profile_id?: string | null
          id?: string
          initial_bird_count: number
          notes?: string | null
          start_date: string
          status?: string | null
        }
        Update: {
          bird_sex?: string | null
          bird_type?: string
          created_at?: string | null
          created_by?: string | null
          current_bird_count?: number | null
          end_date?: string | null
          farm_id?: string | null
          growth_profile_id?: string | null
          id?: string
          initial_bird_count?: number
          notes?: string | null
          start_date?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_cycles_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          active: boolean | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          identification_number: string | null
          identification_type: string | null
          last_name: string
          phone: string | null
          role: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id: string
          identification_number?: string | null
          identification_type?: string | null
          last_name: string
          phone?: string | null
          role?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          identification_number?: string | null
          identification_type?: string | null
          last_name?: string
          phone?: string | null
          role?: string
        }
        Relationships: []
      }
      vehicle_documents: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string
          expiry_date: string | null
          id: string
          issue_date: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_inspections: {
        Row: {
          brakes_ok: boolean | null
          created_at: string | null
          created_by: string | null
          driver_id: string | null
          id: string
          inspection_date: string | null
          kit_ok: boolean | null
          kit_photo_url: string | null
          lights_ok: boolean | null
          mirrors_ok: boolean | null
          observations: string | null
          oil_ok: boolean | null
          tire_photo_url: string | null
          tires_ok: boolean | null
          vehicle_id: string | null
          water_ok: boolean | null
        }
        Insert: {
          brakes_ok?: boolean | null
          created_at?: string | null
          created_by?: string | null
          driver_id?: string | null
          id?: string
          inspection_date?: string | null
          kit_ok?: boolean | null
          kit_photo_url?: string | null
          lights_ok?: boolean | null
          mirrors_ok?: boolean | null
          observations?: string | null
          oil_ok?: boolean | null
          tire_photo_url?: string | null
          tires_ok?: boolean | null
          vehicle_id?: string | null
          water_ok?: boolean | null
        }
        Update: {
          brakes_ok?: boolean | null
          created_at?: string | null
          created_by?: string | null
          driver_id?: string | null
          id?: string
          inspection_date?: string | null
          kit_ok?: boolean | null
          kit_photo_url?: string | null
          lights_ok?: boolean | null
          mirrors_ok?: boolean | null
          observations?: string | null
          oil_ok?: boolean | null
          tire_photo_url?: string | null
          tires_ok?: boolean | null
          vehicle_id?: string | null
          water_ok?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_inspections_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_inspections_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_owners: {
        Row: {
          active: boolean | null
          address: string | null
          city: string | null
          created_at: string | null
          credit_amount: number | null
          credit_term: number | null
          has_credit: boolean | null
          id: string
          identification_number: string
          identification_type: string
          name: string
          phone: string | null
        }
        Insert: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          credit_amount?: number | null
          credit_term?: number | null
          has_credit?: boolean | null
          id?: string
          identification_number: string
          identification_type: string
          name: string
          phone?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string | null
          city?: string | null
          created_at?: string | null
          credit_amount?: number | null
          credit_term?: number | null
          has_credit?: boolean | null
          id?: string
          identification_number?: string
          identification_type?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          active: boolean | null
          brand: string
          chassis_number: string | null
          color: string | null
          created_at: string | null
          engine_number: string | null
          id: string
          line: string | null
          model: string
          owner_id: string | null
          plate: string
          soat_expiration: string | null
          status: string | null
          technical_inspection_expiration: string | null
          vehicle_type: string
          year: number | null
        }
        Insert: {
          active?: boolean | null
          brand: string
          chassis_number?: string | null
          color?: string | null
          created_at?: string | null
          engine_number?: string | null
          id?: string
          line?: string | null
          model: string
          owner_id?: string | null
          plate: string
          soat_expiration?: string | null
          status?: string | null
          technical_inspection_expiration?: string | null
          vehicle_type: string
          year?: number | null
        }
        Update: {
          active?: boolean | null
          brand?: string
          chassis_number?: string | null
          color?: string | null
          created_at?: string | null
          engine_number?: string | null
          id?: string
          line?: string | null
          model?: string
          owner_id?: string | null
          plate?: string
          soat_expiration?: string | null
          status?: string | null
          technical_inspection_expiration?: string | null
          vehicle_type?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "vehicle_owners"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
