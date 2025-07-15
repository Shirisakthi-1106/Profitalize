import { Router } from 'express';
import prisma from '../database/Prisma.js';

const analyticsRouter = Router();

// 1. Customer Transaction Value Analysis
// GET /api/v1/analytics/customer-transactions
// Returns total spending by top customers
analyticsRouter.get('/customer-transactions', async (req, res) => {
  try {
    const transactions = await prisma.transactions.groupBy({
      by: ['customer_id'],
      _sum: { total_amount: true },
      orderBy: { _sum: { total_amount: 'desc' } },
      take: 10, // Top 10 customers
    });
    const result = transactions.map(t => ({
      customer_id: t.customer_id,
      total_spending: t._sum.total_amount,
    }));
    res.json(result);
  } catch (error) {
    console.error('Error fetching customer transactions:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// 2. Deal/Discount Usage Patterns
// GET /api/v1/analytics/deal-usage
// Returns deal usage frequency by loyalty tiers (since segment is unavailable)
analyticsRouter.get('/deal-usage', async (req, res) => {
  try {
    const dealUsage = await prisma.deal_Usage.groupBy({
      by: ['customer_id', 'deal_id'],
      _count: { deal_id: true },
    });
    const customers = await prisma.customers.findMany({
      select: { customer_id: true, loyalty_tier: true },
    });
    const tierMap = customers.reduce((acc, c) => ({ ...acc, [c.customer_id]: c.loyalty_tier || 'None' }), {});
    const tiers = [...new Set(customers.map(c => c.loyalty_tier || 'None'))];
    const deals = await prisma.deals.findMany({ select: { deal_id: true } });
    const dealIds = deals.map(d => d.deal_id);

    const heatmapData = tiers.map(tier => ({
      loyalty_tier: tier,
      deals: dealIds.map(deal_id => {
        const count = dealUsage
          .filter(du => tierMap[du.customer_id] === tier && du.deal_id === deal_id)
          .reduce((sum, du) => sum + du._count.deal_id, 0);
        return { deal_id, count };
      }),
    }));
    res.json(heatmapData);
  } catch (error) {
    console.error('Error fetching deal usage:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// 3 & 5. Customer Loyalty Metrics & Segmentation Dashboard
// GET /api/v1/analytics/loyalty-tiers
// Returns loyalty tier distribution
analyticsRouter.get('/loyalty-tiers', async (req, res) => {
  try {
    const loyaltyTiers = await prisma.customers.groupBy({
      by: ['loyalty_tier'],
      _count: { customer_id: true },
    });
    const result = loyaltyTiers.map(lt => ({
      loyalty_tier: lt.loyalty_tier || 'None',
      count: lt._count.customer_id,
    }));
    res.json(result);
  } catch (error) {
    console.error('Error fetching loyalty tiers:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// 4. Product Performance by Customer
// GET /api/v1/analytics/product-performance
// Returns product categories by customer purchase volume
analyticsRouter.get('/product-performance-with-cart', async (req, res) => {
  try {
    const dealUsage = await prisma.deal_Usage.findMany({
      include: {
        transaction: true,
        product: true,
        customer: true,
      },
    });

    // Get cart items to find quantities
    const cartItems = await prisma.add_to_Cart.findMany({
      select: {
        customer_id: true,
        product_id: true,
        quantity: true,
      },
    });

    // Create a map of customer_id + product_id to quantity
    const quantityMap = cartItems.reduce((acc, item) => {
      const key = `${item.customer_id}_${item.product_id}`;
      acc[key] = (acc[key] || 0) + item.quantity;
      return acc;
    }, {});

    const categoryVolumes = dealUsage.reduce((acc, du) => {
      const category_id = du.product.category_id;
      if (!category_id) return acc;
      
      const quantityKey = `${du.customer_id}_${du.product_id}`;
      const quantity = quantityMap[quantityKey] || 1; // Default to 1 if not found
      
      const key = `${du.customer_id}_${category_id}`;
      acc[key] = acc[key] || { 
        customer_id: du.customer_id, 
        category_id, 
        volume: 0 
      };
      acc[key].volume += quantity;
      return acc;
    }, {});

    const result = Object.values(categoryVolumes);
    res.json(result);
  } catch (error) {
    console.error('Error fetching product performance:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// 6. Cart Abandonment & Purchase Conversion
// GET /api/v1/analytics/cart-abandonment
// Returns cart-to-purchase conversion rates using Add_to_Cart and Transactions
analyticsRouter.get('/cart-abandonment', async (req, res) => {
  try {
    const cartItems = await prisma.add_to_Cart.groupBy({
      by: ['is_active'],
      _count: { cart_id: true },
      where: { is_active: true },
    });
    const transactions = await prisma.transactions.groupBy({
      by: ['payment_method'], // Using payment_method as a proxy for completed purchases
      _count: { transaction_id: true },
    });

    const result = [
      {
        stage: 'Cart Initiated',
        count: cartItems.find(c => c.is_active)?._count.cart_id || 0,
      },
      {
        stage: 'Purchase Completed',
        count: transactions.reduce((sum, t) => sum + t._count.transaction_id, 0),
      },
    ];
    res.json(result);
  } catch (error) {
    console.error('Error fetching cart abandonment:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

export default analyticsRouter;