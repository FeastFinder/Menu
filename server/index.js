/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
const newrelic = require('newrelic');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const db = require('../database/database');

const app = express();
const port = 3004;
const { pool } = db;

app.use(compression());
app.use(morgan());
app.use('/restaurants/:id/', express.static('public'));

app.get('/api/restaurants/:id/menu', (req, res) => {
  const { id } = req.params;
  // Returns all menus for a given business id
  const query = `
    SELECT meal_label, description, price, category_label, subcategory_label
    FROM meals
    INNER JOIN subcategories ON (meals.subcategory_id = subcategories.id)
    INNER JOIN categories ON (meals.category_id = categories.id)
    WHERE business_id=${id}`;
  pool.query(query, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const meals = result.rows;
      const menu = {};
      for (let i = 0; i < meals.length; i += 1) {
        const meal = meals[i];
        const {
          meal_label,
          description,
          price,
          category_label,
          subcategory_label,
        } = meal;
        // If the category has not been added as a key, add it
        if (!menu[category_label]) {
          menu[category_label] = {};
        }
        // If the subcategory has not been added as a key, add it
        if (menu[category_label] && !menu[category_label][subcategory_label]) {
          menu[category_label][subcategory_label] = {};
        }
        const categoriesObject = menu[category_label];
        const subcategoriesObject = categoriesObject[subcategory_label];
        subcategoriesObject[meal_label] = { price: (price / 100).toFixed(2), description };
      }
      res.send(menu);
    }
  });
});

// eslint-disable-next-line no-console
app.listen(port, () => { console.log(`server ${port} is listening...`); });

module.exports.app = app;
