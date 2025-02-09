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
      api_keys: {
        Row: {
          created_at: string
          description: string | null
          id: number
          key: string | null
          price: number | null
          seller_id: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          key?: string | null
          price?: number | null
          seller_id?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          key?: string | null
          price?: number | null
          seller_id?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api-keys_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_transactions: {
        Row: {
          amount: number | null
          bill_of_landing_hash: string | null
          buyer_wallet: string | null
          carrier_wallet: string | null
          created_at: string
          escrow_address: string | null
          export_declaration_hash: string | null
          fob_shipment_id: number | null
          id: number
          seller_wallet: string | null
          status: Database["public"]["Enums"]["escrow_status"] | null
        }
        Insert: {
          amount?: number | null
          bill_of_landing_hash?: string | null
          buyer_wallet?: string | null
          carrier_wallet?: string | null
          created_at?: string
          escrow_address?: string | null
          export_declaration_hash?: string | null
          fob_shipment_id?: number | null
          id?: number
          seller_wallet?: string | null
          status?: Database["public"]["Enums"]["escrow_status"] | null
        }
        Update: {
          amount?: number | null
          bill_of_landing_hash?: string | null
          buyer_wallet?: string | null
          carrier_wallet?: string | null
          created_at?: string
          escrow_address?: string | null
          export_declaration_hash?: string | null
          fob_shipment_id?: number | null
          id?: number
          seller_wallet?: string | null
          status?: Database["public"]["Enums"]["escrow_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "escrew_transactions_api_key_id_fkey"
            columns: ["fob_shipment_id"]
            isOneToOne: false
            referencedRelation: "api_keys"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escrew_transactions_buyer_wallet_fkey"
            columns: ["buyer_wallet"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["wallet_address"]
          },
          {
            foreignKeyName: "escrew_transactions_seller_wallet_fkey"
            columns: ["seller_wallet"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["wallet_address"]
          },
          {
            foreignKeyName: "escrow_transactions_carrier_wallet_fkey"
            columns: ["carrier_wallet"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["wallet_address"]
          },
          {
            foreignKeyName: "escrow_transactions_fob_shipment_id_fkey"
            columns: ["fob_shipment_id"]
            isOneToOne: false
            referencedRelation: "fob_shipments"
            referencedColumns: ["id"]
          },
        ]
      }
      fob_shipments: {
        Row: {
          bill_of_lading_ref: string | null
          cargo_description: string | null
          carrier_id: string
          created_at: string | null
          export_declaration_ref: string | null
          fob_price: number | null
          id: number
          port_of_loading: string | null
          seller_id: string
          title: string | null
        }
        Insert: {
          bill_of_lading_ref?: string | null
          cargo_description?: string | null
          carrier_id: string
          created_at?: string | null
          export_declaration_ref?: string | null
          fob_price?: number | null
          id?: number
          port_of_loading?: string | null
          seller_id: string
          title?: string | null
        }
        Update: {
          bill_of_lading_ref?: string | null
          cargo_description?: string | null
          carrier_id?: string
          created_at?: string | null
          export_declaration_ref?: string | null
          fob_price?: number | null
          id?: number
          port_of_loading?: string | null
          seller_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fob_shipments_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fob_shipments_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          from_wallet: string
          id: number
          payment_status: string | null
          to_wallet: string
          transaction_id: number
          tx_hash: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          from_wallet: string
          id?: number
          payment_status?: string | null
          to_wallet: string
          transaction_id: number
          tx_hash?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          from_wallet?: string
          id?: number
          payment_status?: string | null
          to_wallet?: string
          transaction_id?: number
          tx_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_from_wallet_fkey"
            columns: ["from_wallet"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["wallet_address"]
          },
          {
            foreignKeyName: "payments_to_wallet_fkey"
            columns: ["to_wallet"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["wallet_address"]
          },
          {
            foreignKeyName: "payments_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "escrow_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          id: string
          nonce: string | null
          role: string | null
          wallet_address: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          nonce?: string | null
          role?: string | null
          wallet_address?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nonce?: string | null
          role?: string | null
          wallet_address?: string | null
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
      escrow_status:
        | "Created"
        | "ExportCleared"
        | "LoadedOnBoard"
        | "Completed"
        | "Refunded"
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
