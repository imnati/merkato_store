"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppEngine } from "@/context/AppContext";
import { useTranslationEngine } from "@/context/LanguageContext";
import api from "@/lib/axios";
import { CloseIcon } from "@/components/Icons";

export default function AdminProductsDesk() {
  const { t } = useTranslationEngine();
  const { products, setProducts, activeRegion } = useAppEngine();
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("MERKATO_USER") || "null");
    if (!user || user.role !== "admin") router.replace("/");
  }, [router]);

  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formCategory, setFormCategory] = useState("Electronics");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");
  const [editingId, setEditingId] = useState(null);

  const resetForm = () => {
    setFormName(""); setFormSku(""); setFormBrand(""); setFormPrice(""); setFormStock("");
    setEditingId(null);
  };

  const handleStartEdit = (product) => {
    setEditingId(product._id || product.id);
    setFormName(product.name || "");
    setFormSku((product.sku || "").toUpperCase());
    setFormBrand(product.brand || "");
    setFormCategory(product.category || "Electronics");
    setFormPrice(String(product.price ?? ""));
    setFormStock(String(product.stockQuantity ?? product.stock ?? ""));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!formName || !formSku || !formBrand || !formPrice || !formStock) {
      alert(t.fillRequiredFields);
      return;
    }
    const stockNum = parseInt(formStock);
    const productData = {
      name: formName,
      sku: formSku.toUpperCase().trim(),
      brand: formBrand.trim(),
      category: formCategory,
      price: parseFloat(formPrice),
      stock: stockNum,
      status: stockNum <= 5 ? "Low Stock" : "In Stock",
    };
    try {
      if (editingId) {
        const { data } = await api.put(`/products/${editingId}`, productData);
        setProducts(
          (products || []).map((p) =>
            String(p._id || p.id) === String(editingId) ? data : p,
          ),
        );
      } else {
        const { data } = await api.post("/products", {
          ...productData,
          discountPrice: null,
          images: ["📦", "⚙️", "🚚"],
        });
        setProducts([...(products || []), data]);
      }
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || t.failedSaveProduct);
    }
  };

  const handleDestroyProduct = async (id) => {
    if (!confirm(t.confirmDeleteProduct)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((products || []).filter((p) => String(p._id || p.id) !== String(id)));
    } catch {
      alert(t.failedDeleteProduct);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-800 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono uppercase">
            {t.manageProductsTitle}
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            {t.manageProductsSub}
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-bold text-emerald-600 hover:underline font-mono bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm"
        >
          {t.backToDashboard}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-800 font-mono tracking-wider border-b pb-2">
            {editingId ? t.editProduct : t.addProduct}
          </h3>

          <form
            onSubmit={handleSubmitProduct}
            className="space-y-4 text-xs font-medium"
          >
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                {t.lblProductName}
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={t.phProductName}
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  {t.lblSku}
                </label>
                <input
                  type="text"
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                  placeholder="MK-EL-HDP"
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none font-mono font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  {t.lblBrand}
                </label>
                <input
                  type="text"
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  placeholder={t.phBrand}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                {t.lblCategory}
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none font-bold text-slate-700 cursor-pointer"
              >
                <option value="Electronics">{t.electronics}</option>
                <option value="Fashion & clothing">{t.fashion}</option>
                <option value="Groceries">{t.groceries}</option>
                <option value="Beauty products">{t.beauty}</option>
                <option value="Household items">{t.household}</option>
                <option value="Accessories">{t.accessories}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  {t.lblPrice}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="299.00"
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none font-mono font-black"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  {t.lblStock}
                </label>
                <input
                  type="number"
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  placeholder="15"
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none font-mono font-black"
                  required
                />
              </div>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-black text-center py-3.5 rounded-xl text-xs uppercase font-mono tracking-wider transition-all shadow active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <CloseIcon className="h-4 w-4" /> {t.cancel}
              </button>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-center py-3.5 rounded-xl text-xs uppercase font-mono tracking-wider transition-all shadow active:scale-[0.99]"
            >
              {editingId
                ? t.saveProduct
                : t.addProductCta}
            </button>
          </form>
        </aside>

        {/* Right Side: Active Inventory Matrix Ledger Data Spreadsheet Table View */}
        <section className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 overflow-x-auto custom-scrollbar">
          <h3 className="text-xs font-black uppercase text-slate-800 font-mono tracking-wider border-b pb-2 mb-4">
            {t.productCatalog}
          </h3>

          <table className="w-full border-collapse text-left text-xs font-medium">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                <th className="p-3">{t.thProduct}</th>
                <th className="p-3 text-center">{t.thCategory}</th>
                <th className="p-3 text-right">{t.thPrice}</th>
                <th className="p-3 text-center">{t.thStock}</th>
                <th className="p-3 text-right">{t.thActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-slate-700">
              {/* 🛠️ MODIFIED: products ዝርዝር ባዶ ቢሆንም እንኳ እንዳይከሽፍ በ Optional Chaining ተጠብቋል */}
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={String(product._id || product.id)}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="p-3">
                      <p className="font-bold text-slate-900 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-gray-400 font-mono text-[10px] uppercase font-bold mt-0.5">
                        {t.skuLabel} {product.sku} • {t.brandSplit} {product.brand}
                      </p>
                    </td>
                    <td className="p-3 text-center text-gray-500 font-semibold">
                      {product.category}
                    </td>
                    <td className="p-3 text-right font-mono font-black text-slate-900">
                      {activeRegion?.symbol || "$"}
                      {(product.discountPrice || product.price || 0).toFixed(2)}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-gray-500">
                      {/* 🛠️ MODIFIED: ሁለቱንም የዳታ ፎርማቶች በአግባቡ እንዲያነብ ተደርጓል */}
                      {product.stockQuantity ?? product.stock ?? 0} {t.units}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap space-x-3">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(product)}
                        className="text-blue-500 hover:text-blue-700 font-bold transition"
                      >
                        {t.edit}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDestroyProduct(product._id || product.id)}
                        className="text-red-400 hover:text-red-600 font-bold transition"
                      >
                        {t.delete}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-gray-400 font-medium"
                  >
                    {t.noProductsInCatalog}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
