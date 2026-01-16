import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DbProduct {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  large_price: number | null;
  image_url: string | null;
  category_id: string | null;
  calories: number;
  is_popular: boolean;
  is_seasonal: boolean;
  is_active: boolean;
  ingredients: string[];
  created_at: string;
  updated_at: string;
}

export interface DbCategory {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface DbSize {
  id: string;
  name: string;
  price_modifier: number;
  ml: number;
  is_active: boolean;
}

export interface DbAddOn {
  id: string;
  name: string;
  price: number;
  icon: string;
  is_active: boolean;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order");
      
      if (error) throw error;
      return data as DbCategory[];
    },
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as DbProduct[];
    },
  });
};

export const useSizes = () => {
  return useQuery({
    queryKey: ["sizes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sizes")
        .select("*")
        .order("ml");
      
      if (error) throw error;
      return data as DbSize[];
    },
  });
};

export const useAddOns = () => {
  return useQuery({
    queryKey: ["add_ons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("add_ons")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as DbAddOn[];
    },
  });
};

// Mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (product: Omit<DbProduct, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("products")
        .insert(product)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create product: ${error.message}`);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<DbProduct> & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(product)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update product: ${error.message}`);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });
};

// Category mutations
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category: Omit<DbCategory, "id">) => {
      const { data, error } = await supabase
        .from("categories")
        .insert(category)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create category: ${error.message}`);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...category }: Partial<DbCategory> & { id: string }) => {
      const { data, error } = await supabase
        .from("categories")
        .update(category)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update category: ${error.message}`);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete category: ${error.message}`);
    },
  });
};

// Size mutations
export const useUpdateSize = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...size }: Partial<DbSize> & { id: string }) => {
      const { data, error } = await supabase
        .from("sizes")
        .update(size)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sizes"] });
      toast.success("Size updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update size: ${error.message}`);
    },
  });
};

// AddOn mutations
export const useCreateAddOn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (addOn: Omit<DbAddOn, "id">) => {
      const { data, error } = await supabase
        .from("add_ons")
        .insert(addOn)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["add_ons"] });
      toast.success("Add-on created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create add-on: ${error.message}`);
    },
  });
};

export const useUpdateAddOn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...addOn }: Partial<DbAddOn> & { id: string }) => {
      const { data, error } = await supabase
        .from("add_ons")
        .update(addOn)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["add_ons"] });
      toast.success("Add-on updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update add-on: ${error.message}`);
    },
  });
};

export const useDeleteAddOn = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("add_ons")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["add_ons"] });
      toast.success("Add-on deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete add-on: ${error.message}`);
    },
  });
};
