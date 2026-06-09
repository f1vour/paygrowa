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
      bank_details: {
        Row: {
          account_name: string
          account_number: string
          bank_name: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_name: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_name?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_submissions: {
        Row: {
          category: string
          created_at: string
          gps_captured_at: string | null
          gps_lat: number | null
          gps_lng: number | null
          id: string
          observations: Json
          photos: string[] | null
          reward: number
          status: Database["public"]["Enums"]["community_status"]
          submitted_at: string
          task_id: string
          task_title: string
          updated_at: string
          user_id: string
          videos: string[] | null
        }
        Insert: {
          category: string
          created_at?: string
          gps_captured_at?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          observations?: Json
          photos?: string[] | null
          reward?: number
          status?: Database["public"]["Enums"]["community_status"]
          submitted_at?: string
          task_id: string
          task_title: string
          updated_at?: string
          user_id: string
          videos?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string
          gps_captured_at?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          observations?: Json
          photos?: string[] | null
          reward?: number
          status?: Database["public"]["Enums"]["community_status"]
          submitted_at?: string
          task_id?: string
          task_title?: string
          updated_at?: string
          user_id?: string
          videos?: string[] | null
        }
        Relationships: []
      }
      identity_submissions: {
        Row: {
          created_at: string
          doc_url: string | null
          id: string
          id_number: string
          reviewer_notes: string | null
          selfie_url: string | null
          status: Database["public"]["Enums"]["identity_status"]
          submitted_at: string
          type: Database["public"]["Enums"]["identity_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          doc_url?: string | null
          id?: string
          id_number: string
          reviewer_notes?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["identity_status"]
          submitted_at?: string
          type: Database["public"]["Enums"]["identity_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          doc_url?: string | null
          id?: string
          id_number?: string
          reviewer_notes?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["identity_status"]
          submitted_at?: string
          type?: Database["public"]["Enums"]["identity_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      organization_members: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["org_member_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role?: Database["public"]["Enums"]["org_member_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["org_member_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          contact_person: string | null
          country: string | null
          created_at: string
          created_by: string | null
          documents: Json
          email: string | null
          id: string
          name: string
          org_type: string | null
          phone: string | null
          status: Database["public"]["Enums"]["org_status"]
          updated_at: string
        }
        Insert: {
          contact_person?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          documents?: Json
          email?: string | null
          id?: string
          name: string
          org_type?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["org_status"]
          updated_at?: string
        }
        Update: {
          contact_person?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          documents?: Json
          email?: string | null
          id?: string
          name?: string
          org_type?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["org_status"]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          country: string | null
          created_at: string
          dob: string | null
          education: string | null
          email: string | null
          first_name: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          languages: string[] | null
          last_name: string | null
          phone: string | null
          photo_url: string | null
          profile_completed: boolean
          savings_balance: number
          savings_percentage: number | null
          state: string | null
          trust_score: number
          updated_at: string
          wallet_balance: number
        }
        Insert: {
          country?: string | null
          created_at?: string
          dob?: string | null
          education?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id: string
          languages?: string[] | null
          last_name?: string | null
          phone?: string | null
          photo_url?: string | null
          profile_completed?: boolean
          savings_balance?: number
          savings_percentage?: number | null
          state?: string | null
          trust_score?: number
          updated_at?: string
          wallet_balance?: number
        }
        Update: {
          country?: string | null
          created_at?: string
          dob?: string | null
          education?: string | null
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          languages?: string[] | null
          last_name?: string | null
          phone?: string | null
          photo_url?: string | null
          profile_completed?: boolean
          savings_balance?: number
          savings_percentage?: number | null
          state?: string | null
          trust_score?: number
          updated_at?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      project_submissions: {
        Row: {
          answers: Json
          created_at: string
          id: string
          project_id: string
          reward: number
          status: Database["public"]["Enums"]["community_status"]
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json
          created_at?: string
          id?: string
          project_id: string
          reward?: number
          status?: Database["public"]["Enums"]["community_status"]
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json
          created_at?: string
          id?: string
          project_id?: string
          reward?: number
          status?: Database["public"]["Enums"]["community_status"]
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_public"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          age_range: string | null
          budget_used: number
          country: string | null
          created_at: string
          created_by: string | null
          deadline: string | null
          description: string | null
          estimated_minutes: number
          gender: string | null
          id: string
          language: string | null
          objective: string | null
          organization_id: string
          questions: Json
          reporting: Json | null
          responses_collected: number
          responses_required: number
          reward_per_response: number
          state: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          type: Database["public"]["Enums"]["project_type"]
          updated_at: string
        }
        Insert: {
          age_range?: string | null
          budget_used?: number
          country?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          estimated_minutes?: number
          gender?: string | null
          id?: string
          language?: string | null
          objective?: string | null
          organization_id: string
          questions?: Json
          reporting?: Json | null
          responses_collected?: number
          responses_required?: number
          reward_per_response?: number
          state?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          type: Database["public"]["Enums"]["project_type"]
          updated_at?: string
        }
        Update: {
          age_range?: string | null
          budget_used?: number
          country?: string | null
          created_at?: string
          created_by?: string | null
          deadline?: string | null
          description?: string | null
          estimated_minutes?: number
          gender?: string | null
          id?: string
          language?: string | null
          objective?: string | null
          organization_id?: string
          questions?: Json
          reporting?: Json | null
          responses_collected?: number
          responses_required?: number
          reward_per_response?: number
          state?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          type?: Database["public"]["Enums"]["project_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      savings_goals: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          saved_amount: number
          target_amount: number
          target_date: string | null
          timeframe: Database["public"]["Enums"]["savings_timeframe"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          saved_amount?: number
          target_amount: number
          target_date?: string | null
          timeframe?: Database["public"]["Enums"]["savings_timeframe"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          saved_amount?: number
          target_amount?: number
          target_date?: string | null
          timeframe?: Database["public"]["Enums"]["savings_timeframe"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          bank_name: string | null
          created_at: string
          goal_name: string | null
          id: string
          status: Database["public"]["Enums"]["tx_status"]
          title: string
          type: Database["public"]["Enums"]["tx_type"]
          updated_at: string
          user_id: string
          verify_at: string | null
        }
        Insert: {
          amount: number
          bank_name?: string | null
          created_at?: string
          goal_name?: string | null
          id?: string
          status: Database["public"]["Enums"]["tx_status"]
          title: string
          type: Database["public"]["Enums"]["tx_type"]
          updated_at?: string
          user_id: string
          verify_at?: string | null
        }
        Update: {
          amount?: number
          bank_name?: string | null
          created_at?: string
          goal_name?: string | null
          id?: string
          status?: Database["public"]["Enums"]["tx_status"]
          title?: string
          type?: Database["public"]["Enums"]["tx_type"]
          updated_at?: string
          user_id?: string
          verify_at?: string | null
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
      projects_public: {
        Row: {
          age_range: string | null
          country: string | null
          created_at: string | null
          deadline: string | null
          description: string | null
          estimated_minutes: number | null
          gender: string | null
          id: string | null
          language: string | null
          objective: string | null
          organization_id: string | null
          responses_required: number | null
          reward_per_response: number | null
          state: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          title: string | null
          type: Database["public"]["Enums"]["project_type"] | null
        }
        Insert: {
          age_range?: string | null
          country?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          estimated_minutes?: number | null
          gender?: string | null
          id?: string | null
          language?: string | null
          objective?: string | null
          organization_id?: string | null
          responses_required?: number | null
          reward_per_response?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["project_type"] | null
        }
        Update: {
          age_range?: string | null
          country?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          estimated_minutes?: number | null
          gender?: string | null
          id?: string | null
          language?: string | null
          objective?: string | null
          organization_id?: string | null
          responses_required?: number | null
          reward_per_response?: number | null
          state?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          title?: string | null
          type?: Database["public"]["Enums"]["project_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_org_admin: { Args: { _org: string; _user: string }; Returns: boolean }
      is_org_member: { Args: { _org: string; _user: string }; Returns: boolean }
    }
    Enums: {
      app_role: "contributor" | "client" | "admin"
      community_status:
        | "Submitted"
        | "Under Review"
        | "Approved"
        | "Rejected"
        | "Paid"
      gender_type: "Male" | "Female" | "Prefer Not To Say"
      identity_status:
        | "Not Verified"
        | "Pending Review"
        | "Verified"
        | "Rejected"
      identity_type:
        | "NIN"
        | "Voters Card"
        | "Drivers License"
        | "International Passport"
      org_member_role: "owner" | "admin" | "member"
      org_status:
        | "Not Submitted"
        | "Pending Verification"
        | "Verified Organization"
        | "Rejected"
      project_status:
        | "Draft"
        | "Under Review"
        | "Approved"
        | "Live"
        | "Paused"
        | "Completed"
        | "Rejected"
      project_type: "Survey" | "Community Reporting"
      savings_timeframe: "weekly" | "monthly"
      tx_status: "earning" | "verifying" | "paid" | "completed"
      tx_type: "task" | "savings" | "withdrawal"
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
      app_role: ["contributor", "client", "admin"],
      community_status: [
        "Submitted",
        "Under Review",
        "Approved",
        "Rejected",
        "Paid",
      ],
      gender_type: ["Male", "Female", "Prefer Not To Say"],
      identity_status: [
        "Not Verified",
        "Pending Review",
        "Verified",
        "Rejected",
      ],
      identity_type: [
        "NIN",
        "Voters Card",
        "Drivers License",
        "International Passport",
      ],
      org_member_role: ["owner", "admin", "member"],
      org_status: [
        "Not Submitted",
        "Pending Verification",
        "Verified Organization",
        "Rejected",
      ],
      project_status: [
        "Draft",
        "Under Review",
        "Approved",
        "Live",
        "Paused",
        "Completed",
        "Rejected",
      ],
      project_type: ["Survey", "Community Reporting"],
      savings_timeframe: ["weekly", "monthly"],
      tx_status: ["earning", "verifying", "paid", "completed"],
      tx_type: ["task", "savings", "withdrawal"],
    },
  },
} as const
