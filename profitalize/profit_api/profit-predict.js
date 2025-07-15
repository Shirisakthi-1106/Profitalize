// import { Router } from 'express';
// import { PythonShell } from 'python-shell';
// import { PYTHON_PATH } from '../server/config/env.js';

// const predictRouter = Router();

// predictRouter.post('/predict-margin', async (req, res) => {
//   try {
//     let products, discount_type, discount_value;

//     // Check if data is in req.body (JSON) or req.query (query parameters)
//     if (req.body.products && Array.isArray(req.body.products)) {
//       ({ products, discount_type, discount_value } = req.body);
//     } else if (req.query.product_id) {
//       const requiredFields = ['product_id', 'unit_price', 'cost_price', 'quantity', 'brand', 'category_id', 'shipping_cost', 'discount_type', 'discount_value'];
//       if (!requiredFields.every(field => field in req.query)) {
//         return res.status(400).json({ error: 'Missing required query parameters' });
//       }

//       products = [{
//         product_id: parseInt(req.query.product_id),
//         unit_price: parseFloat(req.query.unit_price),
//         cost_price: parseFloat(req.query.cost_price),
//         quantity: parseInt(req.query.quantity),
//         brand: req.query.brand,
//         category_id: parseInt(req.query.category_id),
//         shipping_cost: parseFloat(req.query.shipping_cost)
//       }];
//       discount_type = req.query.discount_type;
//       discount_value = parseFloat(req.query.discount_value);
//     } else {
//       return res.status(400).json({ error: 'Products array (body) or query parameters are required' });
//     }

//     // Validate input
//     if (!products || !Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({ error: 'Products array is required and cannot be empty' });
//     }
//     if (!discount_type || !['percentage', 'fixed_amount', 'free_shipping'].includes(discount_type)) {
//       return res.status(400).json({ error: 'Invalid discount_type' });
//     }
//     if (discount_value == null || isNaN(discount_value)) {
//       return res.status(400).json({ error: 'Invalid discount_value' });
//     }

//     let input, script;
//     if (products.length === 1) {
//       // Single product (regular model)
//       const p = products[0];
//       const requiredFields = ['product_id', 'unit_price', 'cost_price', 'quantity', 'brand', 'category_id', 'shipping_cost'];
//       if (!requiredFields.every(field => field in p)) {
//         return res.status(400).json({ error: 'Missing required product fields' });
//       }

//       input = {
//         product_id: p.product_id,
//         unit_price: p.unit_price,
//         cost_price: p.cost_price,
//         quantity: p.quantity,
//         discount_type,
//         discount_value,
//         shipping_cost: discount_type === 'free_shipping' ? 0 : p.shipping_cost,
//         brand: p.brand,
//         category_id: p.category_id
//       };
//       script = 'profit_api/predict_regular.py';
//     } else {
//       // Multiple products (combination model)
//       const requiredFields = ['product_id', 'unit_price', 'cost_price', 'quantity', 'brand', 'category_id', 'shipping_cost'];
//       if (!products.every(p => requiredFields.every(field => field in p))) {
//         return res.status(400).json({ error: 'Missing required product fields' });
//       }

//       const total_quantity = products.reduce((sum, p) => sum + p.quantity, 0);
//       const total_unit_price = products.reduce((sum, p) => sum + p.unit_price * p.quantity, 0);
//       const total_cost_price = products.reduce((sum, p) => sum + p.cost_price * p.quantity, 0);
//       const num_products = products.length;
//       const shipping_cost = discount_type === 'free_shipping' ? 0 : Math.max(...products.map(p => p.shipping_cost));
//       const brands = ['Laura Mercier', 'Apple', 'Samsung', 'Nike', 'KitchenAid'];
//       const categories = [2, 8, 9, 11, 12];

//       input = {
//         total_unit_price,
//         total_cost_price,
//         total_quantity,
//         discount_type,
//         discount_value,
//         shipping_cost,
//         num_products,
//         ...Object.fromEntries(brands.map(b => [`has_brand_${b}`, products.some(p => p.brand === b) ? 1 : 0])),
//         ...Object.fromEntries(categories.map(c => [`has_category_id_${c}`, products.some(p => p.category_id === c) ? 1 : 0]))
//       };
//       script = 'profit_api/predict_combination.py';
//     }

//     // Run Python script with virtual environment
//     const options = {
//       mode: 'text',
//       pythonPath: PYTHON_PATH,
//       pythonOptions: ['-u'],
//       scriptPath: './',
//       args: [JSON.stringify(input)]
//     };

//     PythonShell.run(script, options).then(results => {
//       const prediction = parseFloat(results[0]).toFixed(2); // Round to 2 decimals
//       res.json({ profit_margin: prediction });
//     }).catch(err => {
//       console.error('Python script error:', err);
//       res.status(500).json({ error: 'Prediction failed' });
//     });
//   } catch (error) {
//     console.error('Server error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// export default predictRouter;

import { Router } from 'express';
import { PythonShell } from 'python-shell';
import { PYTHON_PATH } from '../server/config/env.js';
import fs from 'fs';
import path from 'path';

const predictRouter = Router();

predictRouter.post('/predict-margin', async (req, res) => {
  try {
    // Verify PYTHON_PATH exists
    const pythonPath = path.resolve(PYTHON_PATH);
    if (!fs.existsSync(pythonPath)) {
      console.error(`Python executable not found at: ${pythonPath}`);
      return res.status(500).json({ error: 'Server configuration error', details: `Python executable not found at ${PYTHON_PATH}` });
    }

    let products, discount_type, discount_value;
    if (req.body.products && Array.isArray(req.body.products)) {
      ({ products, discount_type, discount_value } = req.body);
    } else if (req.query.product_id) {
      const requiredFields = ['product_id', 'unit_price', 'cost_price', 'quantity', 'brand', 'category_id', 'shipping_cost', 'discount_type', 'discount_value'];
      if (!requiredFields.every(field => field in req.query)) {
        return res.status(400).json({ error: 'Missing required query parameters' });
      }
      products = [{
        product_id: parseInt(req.query.product_id),
        unit_price: parseFloat(req.query.unit_price),
        cost_price: parseFloat(req.query.cost_price),
        quantity: parseInt(req.query.quantity),
        brand: req.query.brand,
        category_id: parseInt(req.query.category_id),
        shipping_cost: parseFloat(req.query.shipping_cost)
      }];
      discount_type = req.query.discount_type;
      discount_value = parseFloat(req.query.discount_value);
    } else {
      return res.status(400).json({ error: 'Products array (body) or query parameters are required' });
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products array is required and cannot be empty' });
    }
    if (!discount_type || !['percentage', 'fixed_amount', 'free_shipping'].includes(discount_type)) {
      return res.status(400).json({ error: 'Invalid discount_type' });
    }
    if (discount_value == null || isNaN(discount_value)) {
      return res.status(400).json({ error: 'Invalid discount_value' });
    }

    let input, script;
    if (products.length === 1) {
      const p = products[0];
      const requiredFields = ['product_id', 'unit_price', 'cost_price', 'quantity', 'brand', 'category_id', 'shipping_cost'];
      if (!requiredFields.every(field => field in p)) {
        return res.status(400).json({ error: 'Missing required product fields' });
      }
      input = {
        product_id: p.product_id,
        unit_price: p.unit_price,
        cost_price: p.cost_price,
        quantity: p.quantity,
        discount_type,
        discount_value,
        shipping_cost: discount_type === 'free_shipping' ? 0 : p.shipping_cost,
        brand: p.brand,
        category_id: p.category_id
      };
      script = 'profit_api/predict_regular.py';
    } else {
      const requiredFields = ['product_id', 'unit_price', 'cost_price', 'quantity', 'brand', 'category_id', 'shipping_cost'];
      if (!products.every(p => requiredFields.every(field => field in p))) {
        return res.status(400).json({ error: 'Missing required product fields' });
      }
      const total_quantity = products.reduce((sum, p) => sum + p.quantity, 0);
      const total_unit_price = products.reduce((sum, p) => sum + p.unit_price * p.quantity, 0);
      const total_cost_price = products.reduce((sum, p) => sum + p.cost_price * p.quantity, 0);
      const num_products = products.length;
      const shipping_cost = discount_type === 'free_shipping' ? 0 : Math.max(...products.map(p => p.shipping_cost));
      const brands = ['Laura_Mercier', 'Apple', 'Samsung', 'Nike', 'KitchenAid']; // Updated brand name
      const categories = [2, 8, 9, 11, 12];
      input = {
        total_unit_price,
        total_cost_price,
        total_quantity,
        discount_type,
        discount_value,
        shipping_cost,
        num_products,
        ...Object.fromEntries(brands.map(b => [`has_brand_${b}`, products.some(p => p.brand.replace(' ', '_') === b) ? 1 : 0])), // Handle spaces in brand names
        ...Object.fromEntries(categories.map(c => [`has_category_id_${c}`, products.some(p => p.category_id === c) ? 1 : 0]))
      };
      script = 'profit_api/predict_combination.py';
    }

    console.log('Running Python script:', script, 'with PYTHON_PATH:', pythonPath, 'Input:', input);
    const options = {
      mode: 'text',
      pythonPath: pythonPath,
      pythonOptions: ['-u'],
      scriptPath: './',
      args: [JSON.stringify(input)],
      timeout: 10000
    };

    PythonShell.run(script, options).then(results => {
      console.log('Python results:', results);
      const prediction = parseFloat(results[0]).toFixed(2);
      res.json({ profit_margin: prediction });
    }).catch(err => {
      console.error('Python script error:', err);
      res.status(500).json({ error: 'Prediction failed', details: err.message });
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

export default predictRouter;