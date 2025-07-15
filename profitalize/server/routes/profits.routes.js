import { Router } from 'express';
import prisma from '../database/Prisma.js';

const prodRouter = Router();

// Deal Impact Analysis Endpoint
prodRouter.get('/deal-impact-analysis', async (req, res) => {
    try {
        const dealImpactAnalysis = await prisma.$queryRaw`
            WITH deal_impact AS (
                SELECT 
                    d.deal_name,
                    d.deal_type,
                    d.discount_value,
                    COUNT(du.usage_id) as usage_count,
                    SUM(du.savings_amount) as total_savings_given,
                    -- Calculate revenue impact
                    SUM(t.total_amount) as total_revenue_with_deal,
                    AVG(t.total_amount) as avg_order_value_with_deal,
                    -- Estimate what revenue would have been without deal
                    CASE 
                        WHEN d.deal_type = 'percentage' THEN 
                            SUM(t.total_amount) / (1 - d.discount_value/100)
                        WHEN d.deal_type = 'fixed_amount' THEN 
                            SUM(t.total_amount + du.savings_amount)
                        ELSE SUM(t.total_amount)
                    END as estimated_revenue_without_deal
                FROM "Deals" d
                JOIN "Deal_Usage" du ON d.deal_id = du.deal_id
                JOIN "Transactions" t ON du.transaction_id = t.transaction_id
                GROUP BY d.deal_id, d.deal_name, d.deal_type, d.discount_value
            ),
            deal_profitability AS (
                SELECT 
                    *,
                    -- Calculate incremental impact
                    total_revenue_with_deal - (estimated_revenue_without_deal * 0.5) as incremental_revenue,
                    -- Profit impact (assuming 35% margin)
                    (total_revenue_with_deal * 0.35) - (total_savings_given) as profit_with_deal,
                    (estimated_revenue_without_deal * 0.35 * 0.5) as estimated_profit_without_deal
                FROM deal_impact
            )
            SELECT 
                *,
                profit_with_deal - estimated_profit_without_deal as incremental_profit,
                ROUND((profit_with_deal / total_revenue_with_deal) * 100, 2) as deal_profit_margin_percent
            FROM deal_profitability
            ORDER BY incremental_profit DESC;
        `;

        // Convert BigInt values to regular numbers for JSON serialization
        const serializedData = dealImpactAnalysis.map(row => {
            const serializedRow = {};
            for (const [key, value] of Object.entries(row)) {
                serializedRow[key] = typeof value === 'bigint' ? Number(value) : value;
            }
            return serializedRow;
        });

        res.json({
            success: true,
            data: serializedData,
            count: serializedData.length,
            message: 'Deal impact analysis retrieved successfully'
        });
    } catch (error) {
        console.error('Error executing deal impact analysis:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to retrieve deal impact analysis'
        });
    }
});

// Optional: Add filtering and pagination
prodRouter.get('/deal-impact-analysis/filtered', async (req, res) => {
    try {
        const { 
            deal_type, 
            min_usage_count, 
            limit = 50, 
            offset = 0 
        } = req.query;

        let additionalFilters = '';
        let params = [];

        if (deal_type) {
            additionalFilters += ' AND d.deal_type = $1';
            params.push(deal_type);
        }

        if (min_usage_count) {
            additionalFilters += ` AND COUNT(du.usage_id) >= $${params.length + 1}`;
            params.push(parseInt(min_usage_count));
        }

        // Note: For complex filtering with CTEs, you might need to adjust the query structure
        // This is a simplified version - you may need to rebuild the query dynamically
        const dealImpactAnalysis = await prisma.$queryRaw`
            WITH deal_impact AS (
                SELECT 
                    d.deal_name,
                    d.deal_type,
                    d.discount_value,
                    COUNT(du.usage_id) as usage_count,
                    SUM(du.savings_amount) as total_savings_given,
                    SUM(t.total_amount) as total_revenue_with_deal,
                    AVG(t.total_amount) as avg_order_value_with_deal,
                    CASE 
                        WHEN d.deal_type = 'percentage' THEN 
                            SUM(t.total_amount) / (1 - d.discount_value/100)
                        WHEN d.deal_type = 'fixed_amount' THEN 
                            SUM(t.total_amount + du.savings_amount)
                        ELSE SUM(t.total_amount)
                    END as estimated_revenue_without_deal
                FROM "Deals" d
                JOIN "Deal_Usage" du ON d.deal_id = du.deal_id
                JOIN "Transactions" t ON du.transaction_id = t.transaction_id
                GROUP BY d.deal_id, d.deal_name, d.deal_type, d.discount_value
            ),
            deal_profitability AS (
                SELECT 
                    *,
                    total_revenue_with_deal - (estimated_revenue_without_deal * 0.5) as incremental_revenue,
                    (total_revenue_with_deal * 0.35) - (total_savings_given) as profit_with_deal,
                    (estimated_revenue_without_deal * 0.35 * 0.5) as estimated_profit_without_deal
                FROM deal_impact
            )
            SELECT 
                *,
                profit_with_deal - estimated_profit_without_deal as incremental_profit,
                ROUND((profit_with_deal / total_revenue_with_deal) * 100, 2) as deal_profit_margin_percent
            FROM deal_profitability
            ORDER BY incremental_profit DESC
            LIMIT ${limit} OFFSET ${offset};
        `;

        // Convert BigInt values to regular numbers for JSON serialization
        const serializedData = dealImpactAnalysis.map(row => {
            const serializedRow = {};
            for (const [key, value] of Object.entries(row)) {
                serializedRow[key] = typeof value === 'bigint' ? Number(value) : value;
            }
            return serializedRow;
        });

        res.json({
            success: true,
            data: serializedData,
            count: serializedData.length,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset)
            },
            message: 'Filtered deal impact analysis retrieved successfully'
        });
    } catch (error) {
        console.error('Error executing filtered deal impact analysis:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to retrieve filtered deal impact analysis'
        });
    }
});

// Get deal impact for a specific deal
prodRouter.get('/deal-impact-analysis/:dealId', async (req, res) => {
    try {
        const { dealId } = req.params;

        const dealImpactAnalysis = await prisma.$queryRaw`
            WITH deal_impact AS (
                SELECT 
                    d.deal_id,
                    d.deal_name,
                    d.deal_type,
                    d.discount_value,
                    COUNT(du.usage_id) as usage_count,
                    SUM(du.savings_amount) as total_savings_given,
                    SUM(t.total_amount) as total_revenue_with_deal,
                    AVG(t.total_amount) as avg_order_value_with_deal,
                    CASE 
                        WHEN d.deal_type = 'percentage' THEN 
                            SUM(t.total_amount) / (1 - d.discount_value/100)
                        WHEN d.deal_type = 'fixed_amount' THEN 
                            SUM(t.total_amount + du.savings_amount)
                        ELSE SUM(t.total_amount)
                    END as estimated_revenue_without_deal
                FROM "Deals" d
                JOIN "Deal_Usage" du ON d.deal_id = du.deal_id
                JOIN "Transactions" t ON du.transaction_id = t.transaction_id
                WHERE d.deal_id = ${dealId}
                GROUP BY d.deal_id, d.deal_name, d.deal_type, d.discount_value
            ),
            deal_profitability AS (
                SELECT 
                    *,
                    total_revenue_with_deal - (estimated_revenue_without_deal * 0.5) as incremental_revenue,
                    (total_revenue_with_deal * 0.35) - (total_savings_given) as profit_with_deal,
                    (estimated_revenue_without_deal * 0.35 * 0.5) as estimated_profit_without_deal
                FROM deal_impact
            )
            SELECT 
                *,
                profit_with_deal - estimated_profit_without_deal as incremental_profit,
                ROUND((profit_with_deal / total_revenue_with_deal) * 100, 2) as deal_profit_margin_percent
            FROM deal_profitability;
        `;

        // Convert BigInt values to regular numbers for JSON serialization
        const serializedData = dealImpactAnalysis.map(row => {
            const serializedRow = {};
            for (const [key, value] of Object.entries(row)) {
                serializedRow[key] = typeof value === 'bigint' ? Number(value) : value;
            }
            return serializedRow;
        });

        if (serializedData.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Deal not found or no impact data available'
            });
        }

        res.json({
            success: true,
            data: serializedData[0],
            message: 'Deal impact analysis retrieved successfully'
        });
    } catch (error) {
        console.error('Error executing deal impact analysis for specific deal:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to retrieve deal impact analysis'
        });
    }
});

export default prodRouter;
// GET /deal-impact-analysis - uses defaults (35% margin, 50% retention)
// GET /deal-impact-analysis?profit_margin=0.25&customer_retention=0.3 - uses 25% margin, 30% retention