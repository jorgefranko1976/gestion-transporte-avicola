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
      bird_entries: {
        Row: {
          breed: string
          created_at: string
          created_by: string
          cycle_id: string
          entry_date: string
          farm_id: string
          id: string
          notes: string | null
          quantity: number
          shed_number: number
        }
        Insert: {
          breed: string
          created_at?: string
          created_by: string
          cycle_id: string
          entry_date: string
          farm_id: string
          id?: string
          notes?: string | null
          quantity: number
          shed_number: number
        }
        Update: {
          breed?: string
          created_at?: string
          created_by?: string
          cycle_id?: string
          entry_date?: string
          farm_id?: string
          id?: string
          notes?: string | null
          quantity?: number
          shed_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "bird_entries_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "production_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bird_entries_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_consumption: {
        Row: {
          amount_per_bird: number
          created_at: string
          day: number
          expected_weight: number | null
          id: string
          profile_id: string
          updated_at: string
          water_per_bird: number | null
        }
        Insert: {
          amount_per_bird: number
          created_at?: string
          day: number
          expected_weight?: number | null
          id?: string
          profile_id: string
          updated_at?: string
          water_per_bird?: number | null
        }
        Update: {
          amount_per_bird?: number
          created_at?: string
          day?: number
          expected_weight?: number | null
          id?: string
          profile_id?: string
          updated_at?: string
          water_per_bird?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_consumption_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "growth_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_records: {
        Row: {
          actual_consumption: number
          actual_water_consumption: number | null
          bird_count: number
          bird_weight: number | null
          concentrate_received: number
          created_at: string
          cycle_id: string
          date: string
          day: number
          expected_consumption: number
          expected_water_consumption: number | null
          id: string
          mortality: number
          notes: string | null
          updated_at: string
        }
        Insert: {
          actual_consumption: number
          actual_water_consumption?: number | null
          bird_count: number
          bird_weight?: number | null
          concentrate_received?: number
          created_at?: string
          cycle_id: string
          date: string
          day: number
          expected_consumption: number
          expected_water_consumption?: number | null
          id?: string
          mortality: number
          notes?: string | null
          updated_at?: string
        }
        Update: {
          actual_consumption?: number
          actual_water_consumption?: number | null
          bird_count?: number
          bird_weight?: number | null
          concentrate_received?: number
          created_at?: string
          cycle_id?: string
          date?: string
          day?: number
          expected_consumption?: number
          expected_water_consumption?: number | null
          id?: string
          mortality?: number
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_records_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "production_cycles"
            referencedColumns: ["id"]
          },
        ]
      }
      dispatches: {
        Row: {
          accepted_at: string | null
          bird_count: number | null
          completed_at: string | null
          concentrate_amount: number | null
          concentrate_type: string | null
          created_at: string
          days_delayed: number | null
          destination: string
          dispatch_type: string
          driver_id: string | null
          eta: string | null
          farm_id: string | null
          farm_name: string | null
          feed_type: string | null
          id: string
          loading_company: string
          modified_by: string | null
          modified_reason: string | null
          order_id: string
          packages: number
          receipt_image_url: string | null
          status: string
          updated_at: string
          vehicle_plate: string | null
          zone: string | null
        }
        Insert: {
          accepted_at?: string | null
          bird_count?: number | null
          completed_at?: string | null
          concentrate_amount?: number | null
          concentrate_type?: string | null
          created_at?: string
          days_delayed?: number | null
          destination: string
          dispatch_type: string
          driver_id?: string | null
          eta?: string | null
          farm_id?: string | null
          farm_name?: string | null
          feed_type?: string | null
          id?: string
          loading_company: string
          modified_by?: string | null
          modified_reason?: string | null
          order_id: string
          packages: number
          receipt_image_url?: string | null
          status: string
          updated_at?: string
          vehicle_plate?: string | null
          zone?: string | null
        }
        Update: {
          accepted_at?: string | null
          bird_count?: number | null
          completed_at?: string | null
          concentrate_amount?: number | null
          concentrate_type?: string | null
          created_at?: string
          days_delayed?: number | null
          destination?: string
          dispatch_type?: string
          driver_id?: string | null
          eta?: string | null
          farm_id?: string | null
          farm_name?: string | null
          feed_type?: string | null
          id?: string
          loading_company?: string
          modified_by?: string | null
          modified_reason?: string | null
          order_id?: string
          packages?: number
          receipt_image_url?: string | null
          status?: string
          updated_at?: string
          vehicle_plate?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      driver_documents: {
        Row: {
          created_at: string
          document_type: string
          document_url: string
          driver_id: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url: string
          driver_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string
          driver_id?: string
          id?: string
          updated_at?: string
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
          created_at: string
          date: string
          document_url: string | null
          driver_id: string
          id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          date?: string
          document_url?: string | null
          driver_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          date?: string
          document_url?: string | null
          driver_id?: string
          id?: string
          updated_at?: string
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
          active: boolean
          address: string
          assigned_vehicle_id: string | null
          birth_date: string
          created_at: string
          emergency_contact: string
          first_name: string
          hire_date: string
          id: string
          identification_number: string
          identification_type: string
          last_name: string
          license_expiration: string | null
          phone: string
          termination_date: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          address: string
          assigned_vehicle_id?: string | null
          birth_date: string
          created_at?: string
          emergency_contact: string
          first_name: string
          hire_date?: string
          id?: string
          identification_number: string
          identification_type: string
          last_name: string
          license_expiration?: string | null
          phone: string
          termination_date?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          address?: string
          assigned_vehicle_id?: string | null
          birth_date?: string
          created_at?: string
          emergency_contact?: string
          first_name?: string
          hire_date?: string
          id?: string
          identification_number?: string
          identification_type?: string
          last_name?: string
          license_expiration?: string | null
          phone?: string
          termination_date?: string | null
          updated_at?: string
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
      farms: {
        Row: {
          active: boolean
          chicken_capacity: number
          concentrate_capacity: number
          contact_person: string
          contact_phone: string
          created_at: string
          department: string
          id: string
          internal_id: string
          min_concentrate_reserve: number | null
          name: string
          sheds_count: number
          updated_at: string
          water_source: string
          zone: string
        }
        Insert: {
          active?: boolean
          chicken_capacity: number
          concentrate_capacity: number
          contact_person: string
          contact_phone: string
          created_at?: string
          department: string
          id?: string
          internal_id: string
          min_concentrate_reserve?: number | null
          name: string
          sheds_count: number
          updated_at?: string
          water_source: string
          zone: string
        }
        Update: {
          active?: boolean
          chicken_capacity?: number
          concentrate_capacity?: number
          contact_person?: string
          contact_phone?: string
          created_at?: string
          department?: string
          id?: string
          internal_id?: string
          min_concentrate_reserve?: number | null
          name?: string
          sheds_count?: number
          updated_at?: string
          water_source?: string
          zone?: string
        }
        Relationships: []
      }
      growth_profiles: {
        Row: {
          active: boolean
          breed: string
          created_at: string
          id: string
          is_default: boolean
          name: string
          sex: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          breed: string
          created_at?: string
          id?: string
          is_default?: boolean
          name: string
          sex: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          breed?: string
          created_at?: string
          id?: string
          is_default?: boolean
          name?: string
          sex?: string
          updated_at?: string
        }
        Relationships: []
      }
      production_cycles: {
        Row: {
          breed: string
          concentrate_reserve: number
          created_at: string
          current_bird_count: number
          end_date: string | null
          estimated_end_date: string
          farm_id: string
          growth_profile_id: string
          id: string
          initial_bird_count: number
          notes: string | null
          sex: string
          start_date: string
          status: string
          total_concentrate_consumed: number
          total_concentrate_received: number
          updated_at: string
        }
        Insert: {
          breed: string
          concentrate_reserve?: number
          created_at?: string
          current_bird_count: number
          end_date?: string | null
          estimated_end_date: string
          farm_id: string
          growth_profile_id: string
          id?: string
          initial_bird_count: number
          notes?: string | null
          sex: string
          start_date: string
          status: string
          total_concentrate_consumed?: number
          total_concentrate_received?: number
          updated_at?: string
        }
        Update: {
          breed?: string
          concentrate_reserve?: number
          created_at?: string
          current_bird_count?: number
          end_date?: string | null
          estimated_end_date?: string
          farm_id?: string
          growth_profile_id?: string
          id?: string
          initial_bird_count?: number
          notes?: string | null
          sex?: string
          start_date?: string
          status?: string
          total_concentrate_consumed?: number
          total_concentrate_received?: number
          updated_at?: string
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
      uploaded_files: {
        Row: {
          engorde_count: number | null
          file_url: string | null
          id: string
          name: string
          preview_url: string | null
          records: number | null
          repro_count: number | null
          status: string
          type: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          engorde_count?: number | null
          file_url?: string | null
          id?: string
          name: string
          preview_url?: string | null
          records?: number | null
          repro_count?: number | null
          status: string
          type: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          engorde_count?: number | null
          file_url?: string | null
          id?: string
          name?: string
          preview_url?: string | null
          records?: number | null
          repro_count?: number | null
          status?: string
          type?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          active: boolean
          created_at: string
          first_name: string
          id: string
          identification_number: string
          identification_type: string
          last_name: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          first_name: string
          id: string
          identification_number: string
          identification_type: string
          last_name: string
          phone?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          first_name?: string
          id?: string
          identification_number?: string
          identification_type?: string
          last_name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      vehicle_documents: {
        Row: {
          created_at: string
          document_type: string
          document_url: string
          expiration_date: string | null
          id: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          document_type: string
          document_url: string
          expiration_date?: string | null
          id?: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string
          expiration_date?: string | null
          id?: string
          updated_at?: string
          vehicle_id?: string
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
          brakes_ok: boolean
          created_at: string
          driver_id: string
          id: string
          inspection_date: string
          kit_ok: boolean
          kit_photo_url: string | null
          lights_ok: boolean
          mirrors_ok: boolean
          observations: string | null
          oil_ok: boolean
          tire_photo_url: string | null
          tires_ok: boolean
          vehicle_id: string
          water_ok: boolean
        }
        Insert: {
          brakes_ok: boolean
          created_at?: string
          driver_id: string
          id?: string
          inspection_date?: string
          kit_ok: boolean
          kit_photo_url?: string | null
          lights_ok: boolean
          mirrors_ok: boolean
          observations?: string | null
          oil_ok: boolean
          tire_photo_url?: string | null
          tires_ok: boolean
          vehicle_id: string
          water_ok: boolean
        }
        Update: {
          brakes_ok?: boolean
          created_at?: string
          driver_id?: string
          id?: string
          inspection_date?: string
          kit_ok?: boolean
          kit_photo_url?: string | null
          lights_ok?: boolean
          mirrors_ok?: boolean
          observations?: string | null
          oil_ok?: boolean
          tire_photo_url?: string | null
          tires_ok?: boolean
          vehicle_id?: string
          water_ok?: boolean
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
          address: string | null
          city: string | null
          created_at: string
          credit_amount: number | null
          credit_end_date: string | null
          credit_term: number | null
          email: string | null
          first_name: string | null
          has_credit: boolean | null
          id: string
          identification_number: string
          identification_type: string
          is_company: boolean
          last_name: string | null
          name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          credit_amount?: number | null
          credit_end_date?: string | null
          credit_term?: number | null
          email?: string | null
          first_name?: string | null
          has_credit?: boolean | null
          id?: string
          identification_number: string
          identification_type: string
          is_company?: boolean
          last_name?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          credit_amount?: number | null
          credit_end_date?: string | null
          credit_term?: number | null
          email?: string | null
          first_name?: string | null
          has_credit?: boolean | null
          id?: string
          identification_number?: string
          identification_type?: string
          is_company?: boolean
          last_name?: string | null
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          active: boolean
          brand: string
          cargo_length: string
          chassis_number: string
          color: string
          created_at: string
          empty_weight: string
          engine_number: string
          id: string
          line: string
          model: string
          owner_id: string | null
          pbv_runt: string
          plate: string
          power: string
          rc_policy_expiration: string | null
          soat_expiration: string | null
          status: string | null
          technical_inspection_expiration: string | null
          updated_at: string
          vehicle_type: string
        }
        Insert: {
          active?: boolean
          brand: string
          cargo_length: string
          chassis_number: string
          color: string
          created_at?: string
          empty_weight: string
          engine_number: string
          id?: string
          line: string
          model: string
          owner_id?: string | null
          pbv_runt: string
          plate: string
          power: string
          rc_policy_expiration?: string | null
          soat_expiration?: string | null
          status?: string | null
          technical_inspection_expiration?: string | null
          updated_at?: string
          vehicle_type: string
        }
        Update: {
          active?: boolean
          brand?: string
          cargo_length?: string
          chassis_number?: string
          color?: string
          created_at?: string
          empty_weight?: string
          engine_number?: string
          id?: string
          line?: string
          model?: string
          owner_id?: string | null
          pbv_runt?: string
          plate?: string
          power?: string
          rc_policy_expiration?: string | null
          soat_expiration?: string | null
          status?: string | null
          technical_inspection_expiration?: string | null
          updated_at?: string
          vehicle_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
