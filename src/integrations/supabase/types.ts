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
      bookings: {
        Row: {
          confirmation_fee_paid: number | null
          created_at: string | null
          delivery_location: string | null
          deposit_amount: number
          driver_age: number
          driver_license_url: string | null
          driver_name: string
          driving_experience: number | null
          dropoff_date: string
          dropoff_location: string
          email: string | null
          first_name: string | null
          has_international_license: boolean
          id: string
          last_name: string | null
          payment_id: string | null
          payment_status: string | null
          permit_fee: number | null
          phone_number: string | null
          pickup_date: string
          pickup_location: string
          status: Database["public"]["Enums"]["booking_status"] | null
          stripe_session_id: string | null
          total_price: number
          updated_at: string | null
          user_id: string | null
          vehicle_id: string | null
          young_driver_fee: number | null
        }
        Insert: {
          confirmation_fee_paid?: number | null
          created_at?: string | null
          delivery_location?: string | null
          deposit_amount: number
          driver_age: number
          driver_license_url?: string | null
          driver_name: string
          driving_experience?: number | null
          dropoff_date: string
          dropoff_location: string
          email?: string | null
          first_name?: string | null
          has_international_license?: boolean
          id?: string
          last_name?: string | null
          payment_id?: string | null
          payment_status?: string | null
          permit_fee?: number | null
          phone_number?: string | null
          pickup_date: string
          pickup_location: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          stripe_session_id?: string | null
          total_price: number
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string | null
          young_driver_fee?: number | null
        }
        Update: {
          confirmation_fee_paid?: number | null
          created_at?: string | null
          delivery_location?: string | null
          deposit_amount?: number
          driver_age?: number
          driver_license_url?: string | null
          driver_name?: string
          driving_experience?: number | null
          dropoff_date?: string
          dropoff_location?: string
          email?: string | null
          first_name?: string | null
          has_international_license?: boolean
          id?: string
          last_name?: string | null
          payment_id?: string | null
          payment_status?: string | null
          permit_fee?: number | null
          phone_number?: string | null
          pickup_date?: string
          pickup_location?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          stripe_session_id?: string | null
          total_price?: number
          updated_at?: string | null
          user_id?: string | null
          vehicle_id?: string | null
          young_driver_fee?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_vehicle_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          accept_bookings: boolean
          company_id: string
          created_at: string | null
          damage_deposit_amount: number
          damage_deposit_type: string
          id: string
          minimum_driver_age: number
          minimum_driving_experience: number
          notification_booking_cancellation: boolean
          notification_booking_fee_collected: boolean
          notification_new_booking: boolean
          require_damage_deposit: boolean
          require_driver_license: boolean
          require_driving_experience: boolean
          require_minimum_age: boolean
          updated_at: string | null
        }
        Insert: {
          accept_bookings?: boolean
          company_id: string
          created_at?: string | null
          damage_deposit_amount?: number
          damage_deposit_type?: string
          id?: string
          minimum_driver_age?: number
          minimum_driving_experience?: number
          notification_booking_cancellation?: boolean
          notification_booking_fee_collected?: boolean
          notification_new_booking?: boolean
          require_damage_deposit?: boolean
          require_driver_license?: boolean
          require_driving_experience?: boolean
          require_minimum_age?: boolean
          updated_at?: string | null
        }
        Update: {
          accept_bookings?: boolean
          company_id?: string
          created_at?: string | null
          damage_deposit_amount?: number
          damage_deposit_type?: string
          id?: string
          minimum_driver_age?: number
          minimum_driving_experience?: number
          notification_booking_cancellation?: boolean
          notification_booking_fee_collected?: boolean
          notification_new_booking?: boolean
          require_damage_deposit?: boolean
          require_driver_license?: boolean
          require_driving_experience?: boolean
          require_minimum_age?: boolean
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "admin_company_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "rental_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ical_bookings: {
        Row: {
          created_at: string
          end_date: string
          external_event_id: string
          id: string
          source_feed_id: string | null
          start_date: string
          summary: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          end_date: string
          external_event_id: string
          id?: string
          source_feed_id?: string | null
          start_date: string
          summary?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          end_date?: string
          external_event_id?: string
          id?: string
          source_feed_id?: string | null
          start_date?: string
          summary?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ical_bookings_source_feed_id_fkey"
            columns: ["source_feed_id"]
            isOneToOne: false
            referencedRelation: "vehicle_calendar_feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ical_bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "ical_bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_vehicle_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ical_bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      rental_companies: {
        Row: {
          address: string | null
          company_name: string
          contact_person: string | null
          created_at: string | null
          description: string | null
          email: string
          id: string
          is_approved: boolean | null
          logo_url: string | null
          phone: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          company_name: string
          contact_person?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          id?: string
          is_approved?: boolean | null
          logo_url?: string | null
          phone: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          company_name?: string
          contact_person?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          id?: string
          is_approved?: boolean | null
          logo_url?: string | null
          phone?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          company_id: string | null
          created_at: string | null
          id: string
          rating: number
          user_id: string | null
          vehicle_id: string | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          rating: number
          user_id?: string | null
          vehicle_id?: string | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          company_id?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          user_id?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "admin_company_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "rental_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "reviews_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_vehicle_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_calendar_blocks: {
        Row: {
          booking_id: string | null
          created_at: string
          created_by_user_id: string | null
          end_date: string
          id: string
          reason: string | null
          start_date: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          created_by_user_id?: string | null
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_vehicle_calendar_blocks_vehicle_id"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "fk_vehicle_calendar_blocks_vehicle_id"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_vehicle_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_vehicle_calendar_blocks_vehicle_id"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_calendar_blocks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_calendar_blocks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_calendar_feeds: {
        Row: {
          created_at: string | null
          description: string | null
          feed_name: string
          feed_url: string
          id: string
          is_external: boolean
          last_synced_at: string | null
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          feed_name: string
          feed_url: string
          id?: string
          is_external?: boolean
          last_synced_at?: string | null
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          feed_name?: string
          feed_url?: string
          id?: string
          is_external?: boolean
          last_synced_at?: string | null
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_calendar_feeds_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "vehicle_calendar_feeds_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_vehicle_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_calendar_feeds_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          vehicle_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["vehicle_id"]
          },
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "admin_vehicle_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_images_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_types: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          company_id: string
          created_at: string | null
          description: string | null
          features: Json | null
          feed_token: string | null
          id: string
          is_available: boolean | null
          is_featured: boolean | null
          latitude: number | null
          location: Json
          longitude: number | null
          name: string
          price_per_day: number
          rating: number | null
          seats: number
          transmission: string
          type_id: number | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          feed_token?: string | null
          id?: string
          is_available?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location: Json
          longitude?: number | null
          name: string
          price_per_day: number
          rating?: number | null
          seats: number
          transmission: string
          type_id?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          description?: string | null
          features?: Json | null
          feed_token?: string | null
          id?: string
          is_available?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: Json
          longitude?: number | null
          name?: string
          price_per_day?: number
          rating?: number | null
          seats?: number
          transmission?: string
          type_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "admin_company_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "rental_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_bookings_view: {
        Row: {
          company_email: string | null
          company_id: string | null
          company_name: string | null
          company_phone: string | null
          created_at: string | null
          delivery_location: string | null
          deposit_amount: number | null
          driver_age: number | null
          driver_license_url: string | null
          driver_name: string | null
          driving_experience: number | null
          dropoff_date: string | null
          dropoff_location: string | null
          email: string | null
          first_name: string | null
          has_international_license: boolean | null
          id: string | null
          last_name: string | null
          phone_number: string | null
          pickup_date: string | null
          pickup_location: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number | null
          vehicle_id: string | null
          vehicle_name: string | null
        }
        Relationships: []
      }
      admin_company_stats: {
        Row: {
          address: string | null
          company_name: string | null
          contact_person: string | null
          created_at: string | null
          description: string | null
          email: string | null
          id: string | null
          is_approved: boolean | null
          logo_url: string | null
          phone: string | null
          total_bookings: number | null
          total_revenue: number | null
          updated_at: string | null
          user_id: string | null
          vehicle_count: number | null
        }
        Relationships: []
      }
      admin_vehicle_stats: {
        Row: {
          avg_booking_price: number | null
          booking_count: number | null
          company_id: string | null
          company_name: string | null
          confirmed_bookings: number | null
          created_at: string | null
          description: string | null
          features: Json | null
          feed_token: string | null
          id: string | null
          is_available: boolean | null
          is_featured: boolean | null
          latitude: number | null
          location: Json | null
          longitude: number | null
          name: string | null
          price_per_day: number | null
          rating: number | null
          seats: number | null
          transmission: string | null
          type_id: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "admin_bookings_view"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "admin_company_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "rental_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_uuid_v4: {
        Args: Record<PropertyKey, never>
        Returns: {
          uuid: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      user_role: "guest" | "rental_company" | "admin" | "renter"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      user_role: ["guest", "rental_company", "admin", "renter"],
    },
  },
} as const
