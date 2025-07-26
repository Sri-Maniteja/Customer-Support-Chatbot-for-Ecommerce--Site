const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

let products = [];
let orders = [];

// Load CSV files
fs.createReadStream('ecommerce-dataset/products.csv')
  .pipe(csv())
  .on('data', (row) => products.push(row))
  .on('end', () => console.log('✅ products.csv loaded'));

fs.createReadStream('ecommerce-dataset/orders.csv')
  .pipe(csv())
  .on('data', (row) => orders.push(row))
  .on('end', () => console.log('✅ orders.csv loaded'));

app.post('/api/chat', (req, res) => {
  const message = req.body.message.toLowerCase();

  if (message.includes('top') && message.includes('sold')) {
    const topProducts = [...products]
      .sort((a, b) => parseInt(b.quantity_sold) - parseInt(a.quantity_sold))
      .slice(0, 5)
      .map(p => p.name || p.product_name)
      .join(', ');
    return res.json({ response: `Top 5 sold products are: ${topProducts}` });

  } else if (message.includes('order') && message.includes('status')) {
    const orderId = message.match(/\d+/)?.[0];
    const order = orders.find(o => o.order_id === orderId);
    if (order) {
      return res.json({ response: `Order ID ${order.order_id} status is: ${order.status}` });
    } else {
      return res.json({ response: `Order ID ${orderId} not found.` });
    }

  } else if (message.includes('how many') || message.includes('stock')) {
    const product = products.find(p =>
      message.includes((p.name || p.product_name || '').toLowerCase())
    );
    if (product) {
      return res.json({ response: `There are ${product.stock || 'N/A'} units of ${product.name} left in stock.` });
    } else {
      return res.json({ response: `Product not found.` });
    }

  } else {
    return res.json({ response: "I can help you with order status, top products, or product stock. Try asking me one of those!" });
  }
});

app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
