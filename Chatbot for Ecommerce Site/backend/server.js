// File: backend/server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let products = [];
let orders = [];

fs.createReadStream('ecommerce-dataset/products.csv')
  .pipe(csv())
  .on('data', (row) => products.push(row))
  .on('end', () => console.log('Products CSV loaded.'));

fs.createReadStream('ecommerce-dataset/orders.csv')
  .pipe(csv())
  .on('data', (row) => orders.push(row))
  .on('end', () => console.log('Orders CSV loaded.'));

app.post('/api/chat', (req, res) => {
  const userMessage = req.body.message.toLowerCase();

  if (userMessage.includes('top') && userMessage.includes('sold')) {
    const topProducts = products
      .sort((a, b) => b.quantity_sold - a.quantity_sold)
      .slice(0, 5);
    const names = topProducts.map(p => p.product_name).join('\n');
    return res.json({ response: `Top 5 Sold Products:\n${names}` });

  } else if (userMessage.includes('status') && userMessage.includes('order')) {
    const orderId = userMessage.match(/\d+/);
    const order = orders.find(o => o.order_id === (orderId?.[0] || ''));
    return res.json({
      response: order
        ? `Status of Order ID ${order.order_id}: ${order.status}`
        : 'Order ID not found.'
    });

  } else if (userMessage.includes('stock') || userMessage.includes('how many')) {
    const found = products.find(p => userMessage.includes(p.product_name.toLowerCase()));
    return res.json({
      response: found
        ? `There are ${found.stock} units of '${found.product_name}' left in stock.`
        : 'Product not found in inventory.'
    });

  } else {
    return res.json({
      response: "Sorry, I didn't understand that. You can ask about top products, order status, or inventory."
    });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
