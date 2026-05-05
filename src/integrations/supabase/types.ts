export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      guest_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          estimated_value: number | null
          guest_contact: string | null
          guest_name: string | null
          guest_note: string | null
          id: string
          request_type: string | null
          room_code_id: string | null
          service_item_id: string | null
          staff_note: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          estimated_value?: number | null
          guest_contact?: string | null
          guest_name?: string | null
          guest_note?: string | null
          id?: string
          request_type?: string | null
          room_code_id?: string | null
          service_item_id?: string | null
          staff_note?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          estimated_value?: number | null
          guest_contact?: string | null
          guest_name?: string | null
          guest_note?: string | null
          id?: string
          request_type?: string | null
          room_code_id?: string | null
          service_item_id?: string | null
          staff_note?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guest_requests_room_code_id_fkey"
            columns: ["room_code_id"]
            isOneToOne: false
            referencedRelation: "room_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_requests_service_item_id_fkey"
            columns: ["service_item_id"]
            isOneToOne: false
            referencedRelation: "service_items"
            referencedColumns: ["id"]
          },
        ]
      }
      private_feedback: {
        Row: {
          comment: string | null
          created_at: string
          guest_contact: string | null
          id: string
          rating: number | null
          room_code_id: string | null
          status: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          guest_contact?: string | null
          id?: string
          rating?: number | null
          room_code_id?: string | null
          status?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          guest_contact?: string | null
          id?: string
          rating?: number | null
          room_code_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "private_feedback_room_code_id_fkey"
            columns: ["room_code_id"]
            isOneToOne: false
            referencedRelation: "room_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      property_settings: {
        Row: {
          address: string | null
          booking_url: string | null
          checkin_time: string | null
          checkout_time: string | null
          city: string | null
          country: string | null
          created_at: string
          currency: string | null
          email: string | null
          id: string
          language_default: string | null
          logo_url: string | null
          phone: string | null
          primary_color: string | null
          property_name: string
          property_type: string | null
          secondary_color: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          booking_url?: string | null
          checkin_time?: string | null
          checkout_time?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: string
          language_default?: string | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          property_name: string
          property_type?: string | null
          secondary_color?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          booking_url?: string | null
          checkin_time?: string | null
          checkout_time?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          email?: string | null
          id?: string
          language_default?: string | null
          logo_url?: string | null
          phone?: string | null
          primary_color?: string | null
          property_name?: string
          property_type?: string | null
          secondary_color?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      room_codes: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          qr_code_slug: string
          room_label: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          qr_code_slug: string
          room_label: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          qr_code_slug?: string
          room_label?: string
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          amenities: string[] | null
          bed_type: string | null
          capacity: number | null
          created_at: string
          gallery_image_urls: string[] | null
          id: string
          is_active: boolean
          long_description: string | null
          main_image_url: string | null
          name: string
          short_description: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          bed_type?: string | null
          capacity?: number | null
          created_at?: string
          gallery_image_urls?: string[] | null
          id?: string
          is_active?: boolean
          long_description?: string | null
          main_image_url?: string | null
          name: string
          short_description?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          bed_type?: string | null
          capacity?: number | null
          created_at?: string
          gallery_image_urls?: string[] | null
          id?: string
          is_active?: boolean
          long_description?: string | null
          main_image_url?: string | null
          name?: string
          short_description?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      service_items: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_paid_extra: boolean
          price_estimate: number | null
          requires_staff_confirmation: boolean
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_paid_extra?: boolean
          price_estimate?: number | null
          requires_staff_confirmation?: boolean
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_paid_extra?: boolean
          price_estimate?: number | null
          requires_staff_confirmation?: boolean
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          content: Json
          section_key: string
          updated_at: string
        }
        Insert: {
          content?: Json
          section_key: string
          updated_at?: string
        }
        Update: {
          content?: Json
          section_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "staff", "user"],
    },
  },
} as const
