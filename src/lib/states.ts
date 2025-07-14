
import { proxy } from 'valtio';

export const categoryState = proxy({
  selectedCategory: null as string | null,
});
