export function serializeOption(option) {
  return {
    id: option.id,
    name: option.name,
    price: option.price,
    isActive: option.isActive,
    sortOrder: option.sortOrder,
  };
}

export function serializeProduct(product) {
  const options = (product.options ?? []).map(serializeOption);
  const prices = options.map((o) => o.price);
  const available = product.isActive && options.some((o) => o.isActive);
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category,
    description: product.description ?? null,
    imageUrl: product.imageUrl ?? null,
    isActive: product.isActive,
    sortOrder: product.sortOrder,
    options,
    minPrice: prices.length ? Math.min(...prices) : null,
    available,
  };
}

export function serializeOrderItem(item, isAdmin = false) {
  const base = {
    id: item.id,
    productName: item.productName,
    optionName: item.optionName,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
    subtotal: item.unitPrice * item.quantity,
  };
  if (isAdmin) {
    return {
      ...base,
      costPrice: item.costPrice ?? null,
      costTotal: item.costPrice != null ? item.costPrice * item.quantity : null,
      profit: item.costPrice != null ? (item.unitPrice - item.costPrice) * item.quantity : null,
    };
  }
  return base;
}

export function serializeOrder(order, isAdmin = false) {
  const items = (order.items ?? []).map((i) => serializeOrderItem(i, isAdmin));
  const base = {
    id: order.id,
    orderCode: order.orderCode,
    customerName: order.customerName,
    customerWhatsapp: order.customerWhatsapp,
    note: order.note ?? null,
    status: order.status,
    totalAmount: order.totalAmount,
    adminNote: order.adminNote ?? null,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items,
  };
  if (isAdmin) {
    const filledItems = items.filter((i) => i.costPrice != null);
    return {
      ...base,
      totalCost: filledItems.reduce((s, i) => s + i.costTotal, 0),
      totalProfit: filledItems.reduce((s, i) => s + i.profit, 0),
      missingCostItems: items.filter((i) => i.costPrice == null).length,
    };
  }
  return base;
}
