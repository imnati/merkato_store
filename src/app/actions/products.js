import { createServerActionClient } from "@/lib/server-client";
import { revalidatePath } from "next/cache";

const MOCK_DELAY = 400;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getProducts() {
  await delay(MOCK_DELAY);
  const { products } = await createServerActionClient();
  return products || [];
}

export async function getProductById(id) {
  await delay(MOCK_DELAY);
  const { products } = await createServerActionClient();
  return products?.find((p) => p.id === id) || null;
}

export async function createProduct(productData) {
  await delay(MOCK_DELAY);
  const { products, setProducts } = await createServerActionClient();
  const newProduct = {
    id: `p-${Date.now()}`,
    ...productData,
    images: productData.images || [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format",
    ],
    status: productData.stockQuantity <= 5 ? "Low Stock" : "In Stock",
  };
  setProducts([...(products || []), newProduct]);
  revalidatePath("/admin/products");
  revalidatePath("/");
  return newProduct;
}

export async function deleteProduct(id) {
  await delay(MOCK_DELAY);
  const { products, setProducts } = await createServerActionClient();
  const filtered = (products || []).filter((p) => p.id !== id);
  setProducts(filtered);
  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true };
}

export async function updateOrderStatus(orderId, status) {
  await delay(MOCK_DELAY);
  const { orderHistory, setOrderHistory } = await createServerActionClient();
  const updated = (orderHistory || []).map((order) =>
    order.id === orderId ? { ...order, status } : order,
  );
  setOrderHistory(updated);
  revalidatePath("/admin/orders");
  return { success: true };
}
