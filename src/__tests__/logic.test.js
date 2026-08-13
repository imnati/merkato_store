import { checkoutSchema, registerSchema, productSchema } from "@/lib/validation";

describe("Validation Schemas", () => {
  describe("checkoutSchema", () => {
    it("accepts valid checkout data", () => {
      const result = checkoutSchema.safeParse({
        consigneeName: "Abebe Kebede",
        contactPhone: "+251911234567",
        streetAddress: "Bole Sub-City, Addis Ababa",
        cityName: "Addis Ababa",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty name", () => {
      const result = checkoutSchema.safeParse({
        consigneeName: "",
        contactPhone: "+251911234567",
        streetAddress: "Bole Sub-City",
        cityName: "Addis Ababa",
      });
      expect(result.success).toBe(false);
    });

    it("rejects short phone number", () => {
      const result = checkoutSchema.safeParse({
        consigneeName: "Abebe Kebede",
        contactPhone: "123",
        streetAddress: "Bole Sub-City",
        cityName: "Addis Ababa",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("registerSchema", () => {
    it("accepts valid registration data", () => {
      const result = registerSchema.safeParse({
        fullName: "Abebe Kebede",
        identityEmail: "abebe@example.com",
        targetMarketRegion: "ET",
        securePassword: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects mismatched passwords", () => {
      const result = registerSchema.safeParse({
        fullName: "Abebe Kebede",
        identityEmail: "abebe@example.com",
        targetMarketRegion: "ET",
        securePassword: "password123",
        confirmPassword: "different",
      });
      expect(result.success).toBe(false);
    });

    it("rejects invalid email", () => {
      const result = registerSchema.safeParse({
        fullName: "Abebe Kebede",
        identityEmail: "notanemail",
        targetMarketRegion: "ET",
        securePassword: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("productSchema", () => {
    it("accepts valid product data", () => {
      const result = productSchema.safeParse({
        formName: "Test Product",
        formSku: "MK-TEST-001",
        formBrand: "TestBrand",
        formCategory: "Electronics",
        formPrice: "299.99",
        formStock: "10",
      });
      expect(result.success).toBe(true);
    });

    it("rejects negative price", () => {
      const result = productSchema.safeParse({
        formName: "Test Product",
        formSku: "MK-TEST-001",
        formBrand: "TestBrand",
        formCategory: "Electronics",
        formPrice: "-10",
        formStock: "10",
      });
      expect(result.success).toBe(false);
    });

    it("rejects non-numeric stock", () => {
      const result = productSchema.safeParse({
        formName: "Test Product",
        formSku: "MK-TEST-001",
        formBrand: "TestBrand",
        formCategory: "Electronics",
        formPrice: "299.99",
        formStock: "abc",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("Cart Calculations", () => {
  const calculateTotal = (items) =>
    items.reduce(
      (sum, item) => sum + (item.activePrice ?? item.price ?? 0) * item.quantity,
      0,
    );

  it("calculates total with discount price", () => {
    const cart = [
      { id: "1", activePrice: 289, price: 349, quantity: 2 },
    ];
    expect(calculateTotal(cart)).toBe(578);
  });

  it("falls back to regular price when discountPrice is null", () => {
    const cart = [
      { id: "2", activePrice: null, price: 4500, quantity: 1 },
    ];
    expect(calculateTotal(cart)).toBe(4500);
  });

  it("handles zero discountPrice correctly", () => {
    const cart = [
      { id: "3", activePrice: 0, price: 100, quantity: 1 },
    ];
    expect(calculateTotal(cart)).toBe(0);
  });

  it("calculates total for multiple items", () => {
    const cart = [
      { id: "1", activePrice: 289, price: 349, quantity: 2 },
      { id: "2", activePrice: null, price: 4500, quantity: 1 },
    ];
    expect(calculateTotal(cart)).toBe(5078);
  });
});

describe("Tax and Freight Calculations", () => {
  const calculateOrderTotals = (items, region) => {
    const subtotal = items.reduce(
      (sum, item) => sum + (item.activePrice ?? item.price ?? 0) * item.quantity,
      0,
    );
    const freight = items.length > 0 ? region.baseFreight || 0 : 0;
    const tax = subtotal * (region.taxRate || 0);
    const total = subtotal + freight + tax;
    return { subtotal, freight, tax, total };
  };

  it("calculates correct totals for UAE region", () => {
    const items = [{ activePrice: 289, price: 349, quantity: 1 }];
    const uae = { baseFreight: 12, taxRate: 0.05 };
    const result = calculateOrderTotals(items, uae);
    expect(result.subtotal).toBe(289);
    expect(result.freight).toBe(12);
    expect(result.tax).toBeCloseTo(14.45);
    expect(result.total).toBeCloseTo(315.45);
  });

  it("calculates correct totals for Kenya region", () => {
    const items = [{ activePrice: 289, price: 349, quantity: 1 }];
    const kenya = { baseFreight: 28, taxRate: 0.16 };
    const result = calculateOrderTotals(items, kenya);
    expect(result.subtotal).toBe(289);
    expect(result.freight).toBe(28);
    expect(result.tax).toBeCloseTo(46.24);
    expect(result.total).toBeCloseTo(363.24);
  });

  it("returns zero freight for empty cart", () => {
    const result = calculateOrderTotals([], { baseFreight: 12, taxRate: 0.05 });
    expect(result.freight).toBe(0);
    expect(result.total).toBe(0);
  });
});
