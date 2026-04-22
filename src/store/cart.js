import { supabase } from '../supabaseClient';

export const addToCart = async (productId) => {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (data) {
    // Add to local cart state
    // ... existing cart logic ...
  }
};