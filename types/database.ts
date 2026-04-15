export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      appointments: {
        Row: {
          id: string;
          clinic_id: string;
          patient_id: string;
          doctor_id: string;
          room_id: string | null;
          status: "booked" | "arrived" | "waiting" | "in_consultation" | "completed";
          scheduled_at: string;
          check_in_at: string | null;
          qr_token: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["appointments"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["appointments"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["appointments"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          clinic_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          actor_id: string | null;
          payload: Json | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at"> & Partial<Pick<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at">>;
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
      };
      clinics: {
        Row: {
          id: string;
          tenant_id: string;
          display_name: string;
          logo_url: string | null;
          primary_color: string | null;
          support_email: string | null;
          custom_domain: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["clinics"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["clinics"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["clinics"]["Insert"]>;
      };
      tenants: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          display_name: string;
          logo_url: string | null;
          primary_color: string | null;
          support_email: string | null;
          custom_domain: string | null;
          tenant_type: string;
          subscription_package: string | null;
          size: string | null;
          features: Json;
          status: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tenants"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["tenants"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["tenants"]["Insert"]>;
      };
      doctors: {
        Row: {
          id: string;
          clinic_id: string;
          user_id: string | null;
          full_name: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["doctors"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["doctors"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["doctors"]["Insert"]>;
      };
      inventory_logs: {
        Row: {
          id: string;
          clinic_id: string;
          otc_batch_id: string;
          movement_type: "in" | "out" | "adjust";
          quantity_delta: number;
          reason: string | null;
          actor_id: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["inventory_logs"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["inventory_logs"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["inventory_logs"]["Insert"]>;
      };
      otc_batches: {
        Row: {
          id: string;
          otc_product_id: string;
          quantity: number;
          expiry_date: string | null;
          batch_ref: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["otc_batches"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["otc_batches"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["otc_batches"]["Insert"]>;
      };
      otc_order_items: {
        Row: {
          id: string;
          otc_order_id: string;
          otc_batch_id: string;
          quantity: number;
          unit_price_cents: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["otc_order_items"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["otc_order_items"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["otc_order_items"]["Insert"]>;
      };
      otc_orders: {
        Row: {
          id: string;
          clinic_id: string;
          patient_id: string;
          status: string;
          total_amount_cents: number | null;
          qr_pickup_token: string | null;
          disclaimer_acknowledged_at: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["otc_orders"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["otc_orders"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["otc_orders"]["Insert"]>;
      };
      otc_products: {
        Row: {
          id: string;
          clinic_id: string;
          name: string;
          description: string | null;
          max_quantity_per_order: number | null;
          requires_disclaimer: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["otc_products"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["otc_products"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["otc_products"]["Insert"]>;
      };
      patients: {
        Row: {
          id: string;
          clinic_id: string;
          full_name: string;
          phone: string | null;
          email: string | null;
          date_of_birth: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["patients"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["patients"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["patients"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          otc_order_id: string | null;
          amount_cents: number;
          status: string;
          provider_ref: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["payments"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      profiles: {
        Row: {
          id: string;
          auth_user_id: string;
          role_id: string;
          clinic_id: string | null;
          full_name: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["profiles"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      queue_tokens: {
        Row: {
          id: string;
          clinic_id: string;
          appointment_id: string | null;
          patient_id: string | null;
          position: number;
          status: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["queue_tokens"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["queue_tokens"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["queue_tokens"]["Insert"]>;
      };
      roles: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["roles"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["roles"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["roles"]["Insert"]>;
      };
      surveys: {
        Row: {
          id: string;
          card_uuid: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          clinic_id: string | null;
          respondent_type: string;
          name: string | null;
          email: string | null;
          would_use: string;
          early_access: boolean;
          pain_intensity: number | null;
          pricing_preference: string | null;
          monthly_price_band: string | null;
          must_have_feature: string | null;
          main_concern: string | null;
          responses: Json;
        };
        Insert: Omit<Database["public"]["Tables"]["surveys"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["surveys"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["surveys"]["Insert"]>;
      };
      rooms: {
        Row: {
          id: string;
          clinic_id: string;
          name: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["rooms"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["rooms"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["rooms"]["Insert"]>;
      };
    };
    Enums: {
      appointment_status: "booked" | "arrived" | "waiting" | "in_consultation" | "completed";
      inventory_movement_type: "in" | "out" | "adjust";
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];
