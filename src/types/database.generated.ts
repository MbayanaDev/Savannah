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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      batch_movements: {
        Row: {
          batch_id: string
          created_at: string
          created_by: string | null
          id: string
          loss_reason: Database["public"]["Enums"]["loss_reason_code"] | null
          movement_type: Database["public"]["Enums"]["batch_movement_type"]
          notes: string | null
          quantity: number
          reference_id: string | null
          reference_type: Database["public"]["Enums"]["movement_reference_type"]
          unit_id: string
        }
        Insert: {
          batch_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          loss_reason?: Database["public"]["Enums"]["loss_reason_code"] | null
          movement_type: Database["public"]["Enums"]["batch_movement_type"]
          notes?: string | null
          quantity: number
          reference_id?: string | null
          reference_type: Database["public"]["Enums"]["movement_reference_type"]
          unit_id: string
        }
        Update: {
          batch_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          loss_reason?: Database["public"]["Enums"]["loss_reason_code"] | null
          movement_type?: Database["public"]["Enums"]["batch_movement_type"]
          notes?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: Database["public"]["Enums"]["movement_reference_type"]
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "batch_movements_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "batch_reconciliation"
            referencedColumns: ["batch_id"]
          },
          {
            foreignKeyName: "batch_movements_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "inventory_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_movements_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "storefront_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_movements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "batch_movements_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "sku_units"
            referencedColumns: ["id"]
          },
        ]
      }
      batch_sequences: {
        Row: {
          last_seq: number
          scope_key: string
          updated_at: string
        }
        Insert: {
          last_seq?: number
          scope_key: string
          updated_at?: string
        }
        Update: {
          last_seq?: number
          scope_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          canonical_url: string | null
          content: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          featured: boolean
          icon_url: string | null
          id: string
          image_url: string | null
          image_url_dark: string | null
          is_active: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          og_image_url: string | null
          robots: string
          search_keywords: string[]
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          featured?: boolean
          icon_url?: string | null
          id?: string
          image_url?: string | null
          image_url_dark?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          og_image_url?: string | null
          robots?: string
          search_keywords?: string[]
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          featured?: boolean
          icon_url?: string | null
          id?: string
          image_url?: string | null
          image_url_dark?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          og_image_url?: string | null
          robots?: string
          search_keywords?: string[]
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      customer_addresses: {
        Row: {
          building_house_number: string | null
          created_at: string
          delivery_instructions: string | null
          delivery_zone_id: string
          id: string
          is_default: boolean
          label: string
          landmark: string | null
          street_road: string
          updated_at: string
          user_id: string
        }
        Insert: {
          building_house_number?: string | null
          created_at?: string
          delivery_instructions?: string | null
          delivery_zone_id: string
          id?: string
          is_default?: boolean
          label: string
          landmark?: string | null
          street_road: string
          updated_at?: string
          user_id: string
        }
        Update: {
          building_house_number?: string | null
          created_at?: string
          delivery_instructions?: string | null
          delivery_zone_id?: string
          id?: string
          is_default?: boolean
          label?: string
          landmark?: string | null
          street_road?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_delivery_zone_id_fkey"
            columns: ["delivery_zone_id"]
            isOneToOne: false
            referencedRelation: "delivery_zones"
            referencedColumns: ["zone_id"]
          },
        ]
      }
      delivery_zones: {
        Row: {
          created_at: string
          delivery_fee_minor: number
          express_available: boolean
          express_fee: number
          free_threshold_minor: number
          is_active: boolean
          name: string
          updated_at: string
          zone_id: string
        }
        Insert: {
          created_at?: string
          delivery_fee_minor: number
          express_available?: boolean
          express_fee?: number
          free_threshold_minor: number
          is_active?: boolean
          name: string
          updated_at?: string
          zone_id: string
        }
        Update: {
          created_at?: string
          delivery_fee_minor?: number
          express_available?: boolean
          express_fee?: number
          free_threshold_minor?: number
          is_active?: boolean
          name?: string
          updated_at?: string
          zone_id?: string
        }
        Relationships: []
      }
      farms: {
        Row: {
          acreage: number | null
          alt_whatsapp: string | null
          code: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          deleted_at: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          origin_county: Database["public"]["Enums"]["county"] | null
          plots: Json
          region_id: string | null
          updated_at: string
          water_source: string | null
        }
        Insert: {
          acreage?: number | null
          alt_whatsapp?: string | null
          code: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          origin_county?: Database["public"]["Enums"]["county"] | null
          plots?: Json
          region_id?: string | null
          updated_at?: string
          water_source?: string | null
        }
        Update: {
          acreage?: number | null
          alt_whatsapp?: string | null
          code?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          origin_county?: Database["public"]["Enums"]["county"] | null
          plots?: Json
          region_id?: string | null
          updated_at?: string
          water_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "farms_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_banners: {
        Row: {
          admin_notes: string | null
          alt_text: string
          badge_text: string | null
          created_at: string
          deleted_at: string | null
          end_at: string | null
          id: string
          image_url: string
          image_url_dark: string | null
          is_active: boolean
          link_label: string | null
          link_url: string
          sort_order: number
          start_at: string | null
          target_section: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          alt_text: string
          badge_text?: string | null
          created_at?: string
          deleted_at?: string | null
          end_at?: string | null
          id?: string
          image_url: string
          image_url_dark?: string | null
          is_active?: boolean
          link_label?: string | null
          link_url?: string
          sort_order?: number
          start_at?: string | null
          target_section?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          alt_text?: string
          badge_text?: string | null
          created_at?: string
          deleted_at?: string | null
          end_at?: string | null
          id?: string
          image_url?: string
          image_url_dark?: string | null
          is_active?: boolean
          link_label?: string | null
          link_url?: string
          sort_order?: number
          start_at?: string | null
          target_section?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_batches: {
        Row: {
          batch_code: string
          bbb_prefix: string | null
          best_before: string | null
          cost_per_unit: number | null
          created_at: string
          created_by: string | null
          creation_rule_id: string | null
          deleted_at: string | null
          expiry_date: string | null
          harvest_date: string | null
          id: string
          is_active: boolean
          lot_id: string
          notes: string | null
          product_id: string
          quantity_received: number
          received_at: string
          schedule: number
          unit_id: string
          updated_at: string
        }
        Insert: {
          batch_code: string
          bbb_prefix?: string | null
          best_before?: string | null
          cost_per_unit?: number | null
          created_at?: string
          created_by?: string | null
          creation_rule_id?: string | null
          deleted_at?: string | null
          expiry_date?: string | null
          harvest_date?: string | null
          id?: string
          is_active?: boolean
          lot_id: string
          notes?: string | null
          product_id: string
          quantity_received: number
          received_at?: string
          schedule: number
          unit_id: string
          updated_at?: string
        }
        Update: {
          batch_code?: string
          bbb_prefix?: string | null
          best_before?: string | null
          cost_per_unit?: number | null
          created_at?: string
          created_by?: string | null
          creation_rule_id?: string | null
          deleted_at?: string | null
          expiry_date?: string | null
          harvest_date?: string | null
          id?: string
          is_active?: boolean
          lot_id?: string
          notes?: string | null
          product_id?: string
          quantity_received?: number
          received_at?: string
          schedule?: number
          unit_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_batches_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_batches_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_batches_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "lots_with_crop"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_batches_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "sku_units"
            referencedColumns: ["id"]
          },
        ]
      }
      live_feed_threads: {
        Row: {
          action_type: string
          admin_notes: string | null
          created_at: string
          deleted_at: string | null
          end_at: string | null
          highlight_text: string
          id: string
          image_url: string
          is_active: boolean
          is_live_pulse: boolean
          link_url: string | null
          prefix_text: string | null
          sort_order: number
          start_at: string | null
          suffix_text: string | null
          thread_type: string
          updated_at: string
        }
        Insert: {
          action_type?: string
          admin_notes?: string | null
          created_at?: string
          deleted_at?: string | null
          end_at?: string | null
          highlight_text: string
          id?: string
          image_url: string
          is_active?: boolean
          is_live_pulse?: boolean
          link_url?: string | null
          prefix_text?: string | null
          sort_order?: number
          start_at?: string | null
          suffix_text?: string | null
          thread_type?: string
          updated_at?: string
        }
        Update: {
          action_type?: string
          admin_notes?: string | null
          created_at?: string
          deleted_at?: string | null
          end_at?: string | null
          highlight_text?: string
          id?: string
          image_url?: string
          is_active?: boolean
          is_live_pulse?: boolean
          link_url?: string | null
          prefix_text?: string | null
          sort_order?: number
          start_at?: string | null
          suffix_text?: string | null
          thread_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      lots: {
        Row: {
          batch_alias: string | null
          certification: Json
          code: string
          created_at: string
          cycle: string | null
          deleted_at: string | null
          farm_name: string | null
          harvest_year: number
          id: string
          is_active: boolean
          name: string
          origin_county: Database["public"]["Enums"]["county"]
          plot_no: string | null
          product_id: string | null
          region: string | null
          supplier_id: string | null
          updated_at: string
        }
        Insert: {
          batch_alias?: string | null
          certification?: Json
          code: string
          created_at?: string
          cycle?: string | null
          deleted_at?: string | null
          farm_name?: string | null
          harvest_year: number
          id?: string
          is_active?: boolean
          name: string
          origin_county: Database["public"]["Enums"]["county"]
          plot_no?: string | null
          product_id?: string | null
          region?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Update: {
          batch_alias?: string | null
          certification?: Json
          code?: string
          created_at?: string
          cycle?: string | null
          deleted_at?: string | null
          farm_name?: string | null
          harvest_year?: number
          id?: string
          is_active?: boolean
          name?: string
          origin_county?: Database["public"]["Enums"]["county"]
          plot_no?: string | null
          product_id?: string | null
          region?: string | null
          supplier_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lots_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lots_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          line_total_minor: number | null
          order_id: string
          product_name_snapshot: string
          product_variant_id: string | null
          quantity: number
          sku_snapshot: string | null
          specification_allocation_id: string | null
          specification_snapshot: Json | null
          unit_price_minor: number
          variant_name_snapshot: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          line_total_minor?: number | null
          order_id: string
          product_name_snapshot: string
          product_variant_id?: string | null
          quantity: number
          sku_snapshot?: string | null
          specification_allocation_id?: string | null
          specification_snapshot?: Json | null
          unit_price_minor: number
          variant_name_snapshot?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          line_total_minor?: number | null
          order_id?: string
          product_name_snapshot?: string
          product_variant_id?: string | null
          quantity?: number
          sku_snapshot?: string | null
          specification_allocation_id?: string | null
          specification_snapshot?: Json | null
          unit_price_minor?: number
          variant_name_snapshot?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "storefront_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_email_snapshot: string | null
          customer_name_snapshot: string | null
          customer_note: string | null
          customer_phone_snapshot: string | null
          delivery_fee_minor: number
          discount_minor: number
          id: string
          order_number: string | null
          shipping_address_snapshot: Json | null
          status: string
          subtotal_minor: number
          tax_minor: number
          total_minor: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_email_snapshot?: string | null
          customer_name_snapshot?: string | null
          customer_note?: string | null
          customer_phone_snapshot?: string | null
          delivery_fee_minor?: number
          discount_minor?: number
          id?: string
          order_number?: string | null
          shipping_address_snapshot?: Json | null
          status?: string
          subtotal_minor: number
          tax_minor?: number
          total_minor?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          customer_email_snapshot?: string | null
          customer_name_snapshot?: string | null
          customer_note?: string | null
          customer_phone_snapshot?: string | null
          delivery_fee_minor?: number
          discount_minor?: number
          id?: string
          order_number?: string | null
          shipping_address_snapshot?: Json | null
          status?: string
          subtotal_minor?: number
          tax_minor?: number
          total_minor?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          event_type: string
          id: string
          payload: Json | null
          payment_id: string | null
          processed_at: string | null
          processing_error: string | null
          processing_status: string
          provider: string
          provider_event_id: string | null
          received_at: string
        }
        Insert: {
          event_type: string
          id?: string
          payload?: Json | null
          payment_id?: string | null
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string
          provider?: string
          provider_event_id?: string | null
          received_at?: string
        }
        Update: {
          event_type?: string
          id?: string
          payload?: Json | null
          payment_id?: string | null
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string
          provider?: string
          provider_event_id?: string | null
          received_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_minor: number
          completed_at: string | null
          created_at: string
          currency: string
          failure_code: string | null
          failure_message: string | null
          id: string
          idempotency_key: string
          initiated_at: string | null
          order_id: string
          provider: string
          provider_reference: string | null
          provider_transaction_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_minor: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          idempotency_key: string
          initiated_at?: string | null
          order_id: string
          provider?: string
          provider_reference?: string | null
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_minor?: number
          completed_at?: string | null
          created_at?: string
          currency?: string
          failure_code?: string | null
          failure_message?: string | null
          id?: string
          idempotency_key?: string
          initiated_at?: string | null
          order_id?: string
          provider?: string
          provider_reference?: string | null
          provider_transaction_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      product_specifications: {
        Row: {
          code: string
          created_at: string
          deleted_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          label: string
          sort_order: number
          type: Database["public"]["Enums"]["product_specification_type"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          label: string
          sort_order?: number
          type: Database["public"]["Enums"]["product_specification_type"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          label?: string
          sort_order?: number
          type?: Database["public"]["Enums"]["product_specification_type"]
          updated_at?: string
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          approx_count: number | null
          barcode: string | null
          compare_at_price: number | null
          cost_price: number | null
          created_at: string
          deleted_at: string | null
          est_weight_grams: number | null
          id: string
          image_url: string | null
          is_active: boolean
          is_default: boolean
          name: string
          packaging: string | null
          packaging_unit: string | null
          price: number
          product_id: string
          short_name: string | null
          sku: string
          sku_unit_id: string | null
          sort_order: number
          specifications: Json
          stock_quantity: number
          unit_quantity: number | null
          updated_at: string
        }
        Insert: {
          approx_count?: number | null
          barcode?: string | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          deleted_at?: string | null
          est_weight_grams?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_default?: boolean
          name: string
          packaging?: string | null
          packaging_unit?: string | null
          price: number
          product_id: string
          short_name?: string | null
          sku: string
          sku_unit_id?: string | null
          sort_order?: number
          specifications?: Json
          stock_quantity?: number
          unit_quantity?: number | null
          updated_at?: string
        }
        Update: {
          approx_count?: number | null
          barcode?: string | null
          compare_at_price?: number | null
          cost_price?: number | null
          created_at?: string
          deleted_at?: string | null
          est_weight_grams?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_default?: boolean
          name?: string
          packaging?: string | null
          packaging_unit?: string | null
          price?: number
          product_id?: string
          short_name?: string | null
          sku?: string
          sku_unit_id?: string | null
          sort_order?: number
          specifications?: Json
          stock_quantity?: number
          unit_quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_sku_unit_id_fkey"
            columns: ["sku_unit_id"]
            isOneToOne: false
            referencedRelation: "sku_units"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          canonical_url: string | null
          content: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          image_url: string | null
          image_url_dark: string | null
          is_bundle: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          og_image_url: string | null
          product_code: string | null
          robots: string
          search_keywords: string[]
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["product_status"]
          subcategory_id: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          image_url_dark?: string | null
          is_bundle?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          og_image_url?: string | null
          product_code?: string | null
          robots?: string
          search_keywords?: string[]
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          subcategory_id: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          image_url_dark?: string | null
          is_bundle?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          og_image_url?: string | null
          product_code?: string | null
          robots?: string
          search_keywords?: string[]
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["product_status"]
          subcategory_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          mpesa_phone: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          mpesa_phone?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          mpesa_phone?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      regions: {
        Row: {
          code: string
          counties: Database["public"]["Enums"]["county"][]
          created_at: string
          deleted_at: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          code: string
          counties?: Database["public"]["Enums"]["county"][]
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          counties?: Database["public"]["Enums"]["county"][]
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sku_units: {
        Row: {
          code: string
          created_at: string
          deleted_at: string | null
          dimension: Database["public"]["Enums"]["unit_dimension"]
          id: string
          is_active: boolean
          name: string
          to_base_factor: number
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          deleted_at?: string | null
          dimension: Database["public"]["Enums"]["unit_dimension"]
          id?: string
          is_active?: boolean
          name: string
          to_base_factor?: number
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          deleted_at?: string | null
          dimension?: Database["public"]["Enums"]["unit_dimension"]
          id?: string
          is_active?: boolean
          name?: string
          to_base_factor?: number
          updated_at?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          canonical_url: string | null
          category_id: string
          content: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          image_url: string | null
          image_url_dark: string | null
          is_active: boolean
          is_bundle_subcategory: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          og_image_url: string | null
          robots: string
          search_keywords: string[]
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          category_id: string
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          image_url_dark?: string | null
          is_active?: boolean
          is_bundle_subcategory?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          og_image_url?: string | null
          robots?: string
          search_keywords?: string[]
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          category_id?: string
          content?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          image_url?: string | null
          image_url_dark?: string | null
          is_active?: boolean
          is_bundle_subcategory?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          og_image_url?: string | null
          robots?: string
          search_keywords?: string[]
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          alt_whatsapp: string | null
          code: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          deleted_at: string | null
          farm_id: string | null
          id: string
          is_active: boolean
          name: string
          notes: string | null
          origin_county: Database["public"]["Enums"]["county"] | null
          region_id: string | null
          supplier_type: Database["public"]["Enums"]["supplier_type"]
          updated_at: string
        }
        Insert: {
          alt_whatsapp?: string | null
          code: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          deleted_at?: string | null
          farm_id?: string | null
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          origin_county?: Database["public"]["Enums"]["county"] | null
          region_id?: string | null
          supplier_type: Database["public"]["Enums"]["supplier_type"]
          updated_at?: string
        }
        Update: {
          alt_whatsapp?: string | null
          code?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          deleted_at?: string | null
          farm_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          origin_county?: Database["public"]["Enums"]["county"] | null
          region_id?: string | null
          supplier_type?: Database["public"]["Enums"]["supplier_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
        ]
      }
      ui_user_options: {
        Row: {
          created_at: string
          description: string
          id: number
          name: string
          options: Json[]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: number
          name: string
          options: Json[]
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          name?: string
          options?: Json[]
          updated_at?: string | null
        }
        Relationships: []
      }
      user_cart_items: {
        Row: {
          created_at: string
          quantity: number
          specification_allocation_id: string
          updated_at: string
          user_id: string
          variant_id: string
        }
        Insert: {
          created_at?: string
          quantity: number
          specification_allocation_id: string
          updated_at?: string
          user_id: string
          variant_id: string
        }
        Update: {
          created_at?: string
          quantity?: number
          specification_allocation_id?: string
          updated_at?: string
          user_id?: string
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "storefront_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          deleted_at: string | null
          email: string
          email_verified: boolean
          first_name: string
          id: string
          last_login_at: string | null
          mpesa_phone: string | null
          mpesa_phone_verified: boolean
          oauth_provider: Database["public"]["Enums"]["oauth_provider"]
          oauth_subject: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          saved_addresses: Json
          theme_preference: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          email: string
          email_verified?: boolean
          first_name: string
          id?: string
          last_login_at?: string | null
          mpesa_phone?: string | null
          mpesa_phone_verified?: boolean
          oauth_provider: Database["public"]["Enums"]["oauth_provider"]
          oauth_subject: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          saved_addresses?: Json
          theme_preference?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          email?: string
          email_verified?: boolean
          first_name?: string
          id?: string
          last_login_at?: string | null
          mpesa_phone?: string | null
          mpesa_phone_verified?: boolean
          oauth_provider?: Database["public"]["Enums"]["oauth_provider"]
          oauth_subject?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          saved_addresses?: Json
          theme_preference?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      batch_reconciliation: {
        Row: {
          adjusted_qty: number | null
          allocated_qty: number | null
          batch_code: string | null
          batch_id: string | null
          deallocated_qty: number | null
          product_id: string | null
          quantity_received: number | null
          received_qty: number | null
          remaining_qty: number | null
          returned_qty: number | null
          sold_qty: number | null
          sorting_loss_qty: number | null
          spoiled_qty: number | null
          status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      lots_with_crop: {
        Row: {
          batch_alias: string | null
          certification: Json | null
          code: string | null
          created_at: string | null
          crop: string | null
          cycle: string | null
          deleted_at: string | null
          farm_id: string | null
          farm_name: string | null
          id: string | null
          is_active: boolean | null
          name: string | null
          origin_county: Database["public"]["Enums"]["county"] | null
          plot_no: string | null
          product_code: string | null
          product_id: string | null
          product_slug: string | null
          supplier_id: string | null
          supplier_name: string | null
          supplier_type: Database["public"]["Enums"]["supplier_type"] | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lots_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lots_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_farm_id_fkey"
            columns: ["farm_id"]
            isOneToOne: false
            referencedRelation: "farms"
            referencedColumns: ["id"]
          },
        ]
      }
      storefront_batches: {
        Row: {
          best_before: string | null
          certification: Json | null
          expiry_date: string | null
          farm_name: string | null
          harvest_date: string | null
          harvest_year: number | null
          id: string | null
          origin_county: Database["public"]["Enums"]["county"] | null
          product_id: string | null
          region: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      storefront_variants: {
        Row: {
          barcode: string | null
          compare_at_price: number | null
          created_at: string | null
          est_weight_grams: number | null
          id: string | null
          image_url: string | null
          is_active: boolean | null
          is_default: boolean | null
          name: string | null
          price: number | null
          product_id: string | null
          sku: string | null
          sku_unit_id: string | null
          sort_order: number | null
          specifications: Json | null
          stock_quantity: number | null
          unit_quantity: number | null
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          compare_at_price?: number | null
          created_at?: string | null
          est_weight_grams?: number | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string | null
          price?: number | null
          product_id?: string | null
          sku?: string | null
          sku_unit_id?: string | null
          sort_order?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          unit_quantity?: number | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          compare_at_price?: number | null
          created_at?: string | null
          est_weight_grams?: number | null
          id?: string | null
          image_url?: string | null
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string | null
          price?: number | null
          product_id?: string | null
          sku?: string | null
          sku_unit_id?: string | null
          sort_order?: number | null
          specifications?: Json | null
          stock_quantity?: number | null
          unit_quantity?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_sku_unit_id_fkey"
            columns: ["sku_unit_id"]
            isOneToOne: false
            referencedRelation: "sku_units"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      create_order: {
        Args: {
          p_customer_note?: string
          p_items: Json
          p_shipping_address?: Json
        }
        Returns: string
      }
      create_payment_attempt: {
        Args: { p_idempotency_key: string; p_order_id: string }
        Returns: string
      }
      fn_allocate_batch_to_variant: {
        Args: {
          p_batch_id: string
          p_created_by?: string
          p_notes?: string
          p_units: number
          p_variant_id: string
        }
        Returns: {
          batch_code: string
          batch_remaining: number
          batch_status: string
          grams_allocated: number
          movement_id: string
          units_allocated: number
          variant_sku: string
        }[]
      }
      fn_generate_batch_code: {
        Args: {
          p_at: string
          p_bbb_prefix: string
          p_lot_id: string
          p_product_id: string
          p_schedule: number
        }
        Returns: string
      }
      fn_generate_lot_alias: { Args: never; Returns: string }
      fn_get_hero_banners: {
        Args: never
        Returns: {
          admin_notes: string | null
          alt_text: string
          badge_text: string | null
          created_at: string
          deleted_at: string | null
          end_at: string | null
          id: string
          image_url: string
          image_url_dark: string | null
          is_active: boolean
          link_label: string | null
          link_url: string
          sort_order: number
          start_at: string | null
          target_section: string | null
          title: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "hero_banners"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      fn_lot_has_certification: {
        Args: { p_certification: Json; p_type: string }
        Returns: boolean
      }
      fn_reallocate_variant: {
        Args: {
          p_batch_id: string
          p_created_by?: string
          p_loss_grams?: number
          p_loss_reason?: Database["public"]["Enums"]["loss_reason_code"]
          p_notes?: string
          p_source_quantity: number
          p_source_variant_id: string
          p_target_variant_id: string
        }
        Returns: {
          loss_reason: string
          movement_id: string
          movement_type: string
          notes: string
          quantity_grams: number
          variant_id: string
        }[]
      }
      fn_refresh_all_variant_stock: {
        Args: never
        Returns: {
          new_stock: number
          old_stock: number
          sku: string
          variant_id: string
        }[]
      }
      fn_refresh_variant_stock_for_batch: {
        Args: { p_batch_id: string }
        Returns: {
          new_stock: number
          old_stock: number
          sku: string
          variant_id: string
        }[]
      }
      fn_refresh_variant_stock_for_product: {
        Args: { p_product_id: string }
        Returns: {
          new_stock: number
          old_stock: number
          sku: string
          variant_id: string
        }[]
      }
      fn_valid_farm_plots: { Args: { p_plots: Json }; Returns: boolean }
      fn_valid_lot_certifications: { Args: { p_certs: Json }; Returns: boolean }
      fn_valid_variant_specifications: {
        Args: { specs: Json }
        Returns: boolean
      }
      fn_variant_available_stock: {
        Args: { p_variant_id: string }
        Returns: number
      }
      is_valid_address: { Args: { a: Json }; Returns: boolean }
      valid_saved_addresses: { Args: { a: Json }; Returns: boolean }
    }
    Enums: {
      batch_movement_type:
        | "received"
        | "sold"
        | "spoiled"
        | "adjusted"
        | "returned"
        | "allocated"
        | "sorting_loss"
        | "deallocated"
      batch_source: "farm_direct" | "market" | "import" | "internal_prep"
      county:
        | "Baringo"
        | "Bomet"
        | "Bungoma"
        | "Busia"
        | "Elgeyo-Marakwet"
        | "Embu"
        | "Garissa"
        | "Homa Bay"
        | "Isiolo"
        | "Kajiado"
        | "Kakamega"
        | "Kericho"
        | "Kiambu"
        | "Kilifi"
        | "Kirinyaga"
        | "Kisii"
        | "Kisumu"
        | "Kitui"
        | "Kwale"
        | "Laikipia"
        | "Lamu"
        | "Machakos"
        | "Makueni"
        | "Mandera"
        | "Marsabit"
        | "Meru"
        | "Migori"
        | "Mombasa"
        | "Muranga"
        | "Nairobi"
        | "Nakuru"
        | "Nandi"
        | "Narok"
        | "Nyamira"
        | "Nyandarua"
        | "Nyeri"
        | "Samburu"
        | "Siaya"
        | "Taita-Taveta"
        | "Tana River"
        | "Tharaka-Nithi"
        | "Trans Nzoia"
        | "Turkana"
        | "Uasin Gishu"
        | "Vihiga"
        | "Wajir"
        | "West Pokot"
      creator_role: "admin" | "staff" | "system"
      loss_reason_code:
        | "damaged"
        | "overripe"
        | "contaminated"
        | "scale_error"
        | "moisture_loss"
        | "sorting_reject"
        | "other"
      lot_certification:
        | "none"
        | "organic"
        | "fair_trade"
        | "rainforest_alliance"
        | "global_gap"
      marketing_channel: "retail" | "wholesale" | "export" | "subscription"
      movement_reference_type:
        | "order_item"
        | "manual_adjustment"
        | "spoilage_report"
        | "return"
        | "variant_deallocation"
        | "variant_transform"
        | "variant_allocation"
        | "sorting_report"
      oauth_provider: "google" | "apple" | "facebook" | "github"
      product_specification:
        | "ripe"
        | "half_ripe"
        | "mature_unripe"
        | "staged_ripeness"
      product_specification_type:
        | "ripeness"
        | "color"
        | "variety"
        | "sourcing_method"
      product_status: "draft" | "active" | "archived" | "out_of_stock"
      supplier_type:
        | "partner_farm"
        | "outer_farm"
        | "trader"
        | "cooperative"
        | "market"
        | "import"
        | "other"
      unit_dimension: "weight" | "volume" | "count"
      user_role: "customer" | "staff" | "admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      batch_movement_type: [
        "received",
        "sold",
        "spoiled",
        "adjusted",
        "returned",
        "allocated",
        "sorting_loss",
        "deallocated",
      ],
      batch_source: ["farm_direct", "market", "import", "internal_prep"],
      county: [
        "Baringo",
        "Bomet",
        "Bungoma",
        "Busia",
        "Elgeyo-Marakwet",
        "Embu",
        "Garissa",
        "Homa Bay",
        "Isiolo",
        "Kajiado",
        "Kakamega",
        "Kericho",
        "Kiambu",
        "Kilifi",
        "Kirinyaga",
        "Kisii",
        "Kisumu",
        "Kitui",
        "Kwale",
        "Laikipia",
        "Lamu",
        "Machakos",
        "Makueni",
        "Mandera",
        "Marsabit",
        "Meru",
        "Migori",
        "Mombasa",
        "Muranga",
        "Nairobi",
        "Nakuru",
        "Nandi",
        "Narok",
        "Nyamira",
        "Nyandarua",
        "Nyeri",
        "Samburu",
        "Siaya",
        "Taita-Taveta",
        "Tana River",
        "Tharaka-Nithi",
        "Trans Nzoia",
        "Turkana",
        "Uasin Gishu",
        "Vihiga",
        "Wajir",
        "West Pokot",
      ],
      creator_role: ["admin", "staff", "system"],
      loss_reason_code: [
        "damaged",
        "overripe",
        "contaminated",
        "scale_error",
        "moisture_loss",
        "sorting_reject",
        "other",
      ],
      lot_certification: [
        "none",
        "organic",
        "fair_trade",
        "rainforest_alliance",
        "global_gap",
      ],
      marketing_channel: ["retail", "wholesale", "export", "subscription"],
      movement_reference_type: [
        "order_item",
        "manual_adjustment",
        "spoilage_report",
        "return",
        "variant_deallocation",
        "variant_transform",
        "variant_allocation",
        "sorting_report",
      ],
      oauth_provider: ["google", "apple", "facebook", "github"],
      product_specification: [
        "ripe",
        "half_ripe",
        "mature_unripe",
        "staged_ripeness",
      ],
      product_specification_type: [
        "ripeness",
        "color",
        "variety",
        "sourcing_method",
      ],
      product_status: ["draft", "active", "archived", "out_of_stock"],
      supplier_type: [
        "partner_farm",
        "outer_farm",
        "trader",
        "cooperative",
        "market",
        "import",
        "other",
      ],
      unit_dimension: ["weight", "volume", "count"],
      user_role: ["customer", "staff", "admin"],
    },
  },
} as const
