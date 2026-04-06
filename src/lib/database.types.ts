// Supabase database types - generated from schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type product_status = 'open' | 'pending' | 'sold'
export type order_status = 'pending' | 'confirmed'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          nrc_number: string
          nrc_photo_url: string[]
          is_verified: boolean
          gps_location: unknown | null
          kpay_no: string | null
          wave_no: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          nrc_number: string
          nrc_photo_url?: string[]
          is_verified?: boolean
          gps_location?: unknown | null
          kpay_no?: string | null
          wave_no?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          nrc_number?: string
          nrc_photo_url?: string[]
          is_verified?: boolean
          gps_location?: unknown | null
          kpay_no?: string | null
          wave_no?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string
          title: string
          description: string | null
          price: number
          images: string[]
          status: product_status
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          title: string
          description?: string | null
          price: number
          images?: string[]
          status?: product_status
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          title?: string
          description?: string | null
          price?: number
          images?: string[]
          status?: product_status
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          product_id: string
          buyer_id: string
          seller_id: string
          payment_screenshot: string | null
          last_4_digits: string | null
          amount: number
          down_payment_amount: number
          status: order_status
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          buyer_id: string
          seller_id: string
          payment_screenshot?: string | null
          last_4_digits?: string | null
          amount: number
          down_payment_amount: number
          status?: order_status
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          buyer_id?: string
          seller_id?: string
          payment_screenshot?: string | null
          last_4_digits?: string | null
          amount?: number
          down_payment_amount?: number
          status?: order_status
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      product_status: product_status
      order_status: order_status
    }
  }
}