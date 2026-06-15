"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppEngine } from "@/context/AppContext";

export default function AdminProductsDesk() {
  const { products, setProducts, activeRegion } = useAppEngine();

  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formCategory, setFormCategory] = useState("Electronics");
  const [formPrice, setFormPrice] = useState("");
  const [formStock, setFormStock] = useState("");

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!formName || !formSku || !formBrand || !formPrice || !formStock) {
      alert("Please populate all required validation parameter fields.");
      return;
    }

    const stockNum = parseInt(formStock);

    const freshItem = {
      id: `p-${Date.now()}`,
      name: formName,
      sku: formSku.toUpperCase().trim(),
      brand: formBrand.trim(),
      category: formCategory,
      price: parseFloat(formPrice),
      discountPrice: null,
      images: ["📦", "⚙️", "🚚"],
      stockQuantity: stockNum,
      status: stockNum <= 5 ? "Low Stock" : "In Stock",
    };

    const currentProducts = products || [];
    setProducts([...currentProducts, freshItem]);

    setFormName("");
    setFormSku("");
    setFormBrand("");
    setFormPrice("");
    setFormStock("");
    alert("✓ Product document record created cleanly in database collection.");
  };

  const handleDestroyProduct = (id) => {
    if (
      confirm(
        "Confirm permanent destruction of this catalog listing document index?",
      )
    ) {
      const currentProducts = products || [];
      setProducts(currentProducts.filter((p) => p.id !== id));
      alert("🗑️ Document removed from active cluster storage layers.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-slate-800 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 font-mono uppercase">
            Inventory Controls Desk
          </h1>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">
            Administrative product catalog schema records additions, updates,
            modifications, and indices deletions.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-bold text-emerald-600 hover:underline font-mono bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm"
        >
          ← Operational Console Hub
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-800 font-mono tracking-wider border-b pb-2">
            ➕ Append Catalog Record
          </h3>

          <form
            onSubmit={handleCreateProduct}
            className="space-y-4 text-xs font-medium"
          >
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Product Title Naming
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. AcousticMax Wireless Pro"
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  SKU Unique ID
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
                  Brand Manufacturer
                </label>
                <input
                  type="text"
                  value={formBrand}
                  onChange={(e) => setFormBrand(e.target.value)}
                  placeholder="e.g. AlphaSonic Labs"
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                Primary Classification Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:outline-none font-bold text-slate-700 cursor-pointer"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion & clothing">Fashion & clothing</option>
                <option value="Groceries">Groceries</option>
                <option value="Beauty products">Beauty products</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                  Base Price Valuation
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
                  Physical Stock Count
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

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-center py-3.5 rounded-xl text-xs uppercase font-mono tracking-wider transition-all shadow active:scale-[0.99]"
            >
              Commit Catalog Document Entry
            </button>
          </form>
        </aside>

        {/* Right Side: Active Inventory Matrix Ledger Data Spreadsheet Table View */}
        <section className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 overflow-x-auto custom-scrollbar">
          <h3 className="text-xs font-black uppercase text-slate-800 font-mono tracking-wider border-b pb-2 mb-4">
            📊 Current Catalog Inventory Collection Matrix
          </h3>

          <table className="w-full border-collapse text-left text-xs font-medium">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-bold uppercase border-b border-gray-100">
                <th className="p-3">Product Name Details</th>
                <th className="p-3 text-center">Category Group</th>
                <th className="p-3 text-right">Pricing Scale</th>
                <th className="p-3 text-center">Warehouse Stock</th>
                <th className="p-3 text-right">CRUD Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-slate-700">
              {/* 🛠️ MODIFIED: products ዝርዝር ባዶ ቢሆንም እንኳ እንዳይከሽፍ በ Optional Chaining ተጠብቋል */}
              {products && products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    <td className="p-3">
                      <p className="font-bold text-slate-900 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-gray-400 font-mono text-[10px] uppercase font-bold mt-0.5">
                        SKU ID: {product.sku} • Brand: {product.brand}
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
                      {product.stockQuantity ?? product.stock ?? 0} units
                    </td>
                    <td className="p-3 text-right whitespace-nowrap space-x-3">
                      <button
                        type="button"
                        onClick={() =>
                          alert(
                            `Modify callback hook initialized for item ID: ${product.id}`,
                          )
                        }
                        className="text-blue-500 hover:text-blue-700 font-bold transition"
                      >
                        Modify
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDestroyProduct(product.id)}
                        className="text-red-400 hover:text-red-600 font-bold transition"
                      >
                        Destroy
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
                    No active product catalog listings mapped in active memory
                    layer.
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
