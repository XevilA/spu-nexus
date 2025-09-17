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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_whitelist: {
        Row: {
          active: boolean | null
          created_at: string | null
          created_by: string | null
          description: string | null
          email: string
          id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          email: string
          id?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          email?: string
          id?: string
        }
        Relationships: []
      }
      ai_usage_logs: {
        Row: {
          created_at: string | null
          id: string
          request_type: string
          response_length: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          request_type: string
          response_length?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          request_type?: string
          response_length?: number | null
          user_id?: string
        }
        Relationships: []
      }
      application_messages: {
        Row: {
          application_id: string
          content: string
          created_at: string | null
          id: string
          sender_id: string
          sender_name: string
          sender_role: string
        }
        Insert: {
          application_id: string
          content: string
          created_at?: string | null
          id?: string
          sender_id: string
          sender_name: string
          sender_role: string
        }
        Update: {
          application_id?: string
          content?: string
          created_at?: string | null
          id?: string
          sender_id?: string
          sender_name?: string
          sender_role?: string
        }
        Relationships: []
      }
      applications: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          declined_at: string | null
          id: string
          is_freelance: boolean | null
          job_id: string | null
          offered_at: string | null
          portfolio_version: number | null
          proposal: Json | null
          start_date: string | null
          status: string | null
          status_history: Json | null
          student_uid: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          declined_at?: string | null
          id?: string
          is_freelance?: boolean | null
          job_id?: string | null
          offered_at?: string | null
          portfolio_version?: number | null
          proposal?: Json | null
          start_date?: string | null
          status?: string | null
          status_history?: Json | null
          student_uid?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          declined_at?: string | null
          id?: string
          is_freelance?: boolean | null
          job_id?: string | null
          offered_at?: string | null
          portfolio_version?: number | null
          proposal?: Json | null
          start_date?: string | null
          status?: string | null
          status_history?: Json | null
          student_uid?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          adults: number
          booking_date: string
          children: number | null
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          slip_url: string | null
          status: string | null
          total_price: number
          tour_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          adults: number
          booking_date: string
          children?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          slip_url?: string | null
          status?: string | null
          total_price: number
          tour_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          adults?: number
          booking_date?: string
          children?: number | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          slip_url?: string | null
          status?: string | null
          total_price?: number
          tour_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          domain: string | null
          hr_owner_uid: string | null
          id: string
          name: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          hr_owner_uid?: string | null
          id?: string
          name: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          hr_owner_uid?: string | null
          id?: string
          name?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          facebook_url: string | null
          id: string
          instagram_url: string | null
          line_id: string | null
          map_embed_url: string | null
          phone: string | null
          updated_at: string | null
          working_hours: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          line_id?: string | null
          map_embed_url?: string | null
          phone?: string | null
          updated_at?: string | null
          working_hours?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          line_id?: string | null
          map_embed_url?: string | null
          phone?: string | null
          updated_at?: string | null
          working_hours?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_read: boolean | null
          message: string
          name: string
          phone: string | null
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_read?: boolean | null
          message: string
          name: string
          phone?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_read?: boolean | null
          message?: string
          name?: string
          phone?: string | null
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_sections: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          budget_or_salary: string | null
          company_id: string | null
          created_at: string | null
          deadline_at: string | null
          description: string
          hash_key: string | null
          id: string
          job_type: string
          location: string | null
          posted_at: string | null
          requirements: Json | null
          source: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_or_salary?: string | null
          company_id?: string | null
          created_at?: string | null
          deadline_at?: string | null
          description: string
          hash_key?: string | null
          id?: string
          job_type: string
          location?: string | null
          posted_at?: string | null
          requirements?: Json | null
          source?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_or_salary?: string | null
          company_id?: string | null
          created_at?: string | null
          deadline_at?: string | null
          description?: string
          hash_key?: string | null
          id?: string
          job_type?: string
          location?: string | null
          posted_at?: string | null
          requirements?: Json | null
          source?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          availability: string | null
          certificates: Json | null
          created_at: string | null
          education: Json | null
          expected_rate: number | null
          freelance_rate: number | null
          id: string
          languages: Json | null
          locations: Json | null
          portfolio_version: number | null
          projects: Json | null
          skills: Json | null
          status: string
          student_uid: string | null
          submitted_at: string | null
          updated_at: string | null
          visibility: string | null
          work_samples: Json | null
          work_types: Json | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          availability?: string | null
          certificates?: Json | null
          created_at?: string | null
          education?: Json | null
          expected_rate?: number | null
          freelance_rate?: number | null
          id?: string
          languages?: Json | null
          locations?: Json | null
          portfolio_version?: number | null
          projects?: Json | null
          skills?: Json | null
          status?: string
          student_uid?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          visibility?: string | null
          work_samples?: Json | null
          work_types?: Json | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          availability?: string | null
          certificates?: Json | null
          created_at?: string | null
          education?: Json | null
          expected_rate?: number | null
          freelance_rate?: number | null
          id?: string
          languages?: Json | null
          locations?: Json | null
          portfolio_version?: number | null
          projects?: Json | null
          skills?: Json | null
          status?: string
          student_uid?: string | null
          submitted_at?: string | null
          updated_at?: string | null
          visibility?: string | null
          work_samples?: Json | null
          work_types?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          email: string
          faculty: string | null
          first_name: string | null
          id: string
          last_name: string | null
          program: string | null
          role: string | null
          updated_at: string | null
          verified_student: boolean | null
          year: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email: string
          faculty?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          program?: string | null
          role?: string | null
          updated_at?: string | null
          verified_student?: boolean | null
          year?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string
          faculty?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          program?: string | null
          role?: string | null
          updated_at?: string | null
          verified_student?: boolean | null
          year?: number | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          code: string | null
          created_at: string | null
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          end_date: string | null
          id: string
          is_active: boolean | null
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          rating: number
          tour_id: string | null
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          rating: number
          tour_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          rating?: number
          tour_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_gallery: {
        Row: {
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_url: string
          tour_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          tour_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_gallery_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_highlights: {
        Row: {
          highlight: string
          id: string
          tour_id: string | null
        }
        Insert: {
          highlight: string
          id?: string
          tour_id?: string | null
        }
        Update: {
          highlight?: string
          id?: string
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_highlights_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_included: {
        Row: {
          id: string
          item: string
          tour_id: string | null
        }
        Insert: {
          id?: string
          item: string
          tour_id?: string | null
        }
        Update: {
          id?: string
          item?: string
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_included_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_itinerary: {
        Row: {
          day_number: number
          description: string
          id: string
          title: string
          tour_id: string | null
        }
        Insert: {
          day_number: number
          description: string
          id?: string
          title: string
          tour_id?: string | null
        }
        Update: {
          day_number?: number
          description?: string
          id?: string
          title?: string
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_itinerary_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_not_included: {
        Row: {
          id: string
          item: string
          tour_id: string | null
        }
        Insert: {
          id?: string
          item: string
          tour_id?: string | null
        }
        Update: {
          id?: string
          item?: string
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tour_not_included_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          category: string
          created_at: string | null
          description: string
          discount_price: number | null
          duration: string
          featured_order: number | null
          id: string
          image: string
          is_featured: boolean | null
          is_hot_deal: boolean | null
          location: string
          max_group_size: number
          price: number
          rating: number | null
          reviews_count: number | null
          show_price: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          discount_price?: number | null
          duration: string
          featured_order?: number | null
          id?: string
          image: string
          is_featured?: boolean | null
          is_hot_deal?: boolean | null
          location: string
          max_group_size: number
          price: number
          rating?: number | null
          reviews_count?: number | null
          show_price?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          discount_price?: number | null
          duration?: string
          featured_order?: number | null
          id?: string
          image?: string
          is_featured?: boolean | null
          is_hot_deal?: boolean | null
          location?: string
          max_group_size?: number
          price?: number
          rating?: number | null
          reviews_count?: number | null
          show_price?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      public_contact_info: {
        Row: {
          created_at: string | null
          facebook_url: string | null
          id: string | null
          instagram_url: string | null
          map_embed_url: string | null
          updated_at: string | null
          working_hours: string | null
        }
        Insert: {
          created_at?: string | null
          facebook_url?: string | null
          id?: string | null
          instagram_url?: string | null
          map_embed_url?: string | null
          updated_at?: string | null
          working_hours?: string | null
        }
        Update: {
          created_at?: string | null
          facebook_url?: string | null
          id?: string | null
          instagram_url?: string | null
          map_embed_url?: string | null
          updated_at?: string | null
          working_hours?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_admin_profile: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_admin_whitelist_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_bucket_policies: {
        Args: { bucket_name: string; is_public: boolean }
        Returns: undefined
      }
      create_profiles_table_if_not_exists: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_public_contact_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          facebook_url: string
          id: string
          instagram_url: string
          map_embed_url: string
          working_hours: string
        }[]
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
    Enums: {},
  },
} as const
