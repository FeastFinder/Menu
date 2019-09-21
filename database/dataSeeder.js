/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const { Client, Pool } = require('pg');

const sampleData = require('./sampleData.js');

const pool = new Pool({
  database: 'menus',
  max_connections: 10000,
});

const { categoryOptions, subcategoryOptions } = sampleData;

const setupPostgres = (database = 'menus', dropTables = false) => {
  const client = new Client({
    database,
  });

  client.connect();

  // Drop tables if dropTables param set to true
  if (dropTables) {
    client.query('DROP TABLE IF EXISTS businesses CASCADE', (err, result) => {
      if (err) {
        console.log(err);
        return err;
      }
      return result;
    });
    client.query('DROP TABLE IF EXISTS categories CASCADE', (err, result) => {
      if (err) {
        console.log(err);
        return err;
      }
      return result;
    });
    client.query('DROP TABLE IF EXISTS subcategories CASCADE', (err, result) => {
      if (err) {
        console.log(err);
        return err;
      }
      return result;
    });
    client.query('DROP TABLE IF EXISTS meals CASCADE', (err, result) => {
      if (err) {
        console.log(err);
        return err;
      }
      return result;
    });
  }

  // Create Tables
  client.query(`CREATE TABLE businesses (
    id SERIAL,
    business_name VARCHAR(60),
    PRIMARY KEY (id)
  );`, (err, res) => {
    if (err) {
      console.log('error:', err);
      return err;
    }
    return res;
  });

  client.query(`CREATE TABLE categories (
    id SERIAL,
    category_label VARCHAR(60) NOT NULL,
    PRIMARY KEY (id)
  );`, (err, res) => {
    if (err) {
      console.log('error:', err);
      return err;
    }
    return res;
  });

  client.query(`CREATE TABLE subcategories (
    id SERIAL,
    subcategory_label VARCHAR(60) NOT NULL,
    PRIMARY KEY (id)
  );`, (err, res) => {
    if (err) {
      console.log('error:', err);
      return err;
    }
    return res;
  });

  client.query(`CREATE TABLE meals (
    id SERIAL,
    meal_label VARCHAR(60) NOT NULL,
    description VARCHAR(250),
    price SMALLINT,
    business_id INTEGER NOT NULL,
    category_id SMALLINT NOT NULL,
    subcategory_id SMALLINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (business_id) REFERENCES businesses (id),
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories (id)
  );`, (err, res) => {
    if (err) {
      console.log('error:', err);
      return err;
    }
    return res;
  });
  /* NOTE: this seems to break its ability to work,
  * but not having it requires me to end the process manually
  * client.end();
  */
};

const seedPostgresDefaults = () => {
  for (let i = 0; i < categoryOptions.length; i += 1) {
    const category = categoryOptions[i];
    const query = `INSERT INTO categories (category_label) VALUES ('${category}')`;
    pool.query(query, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  }

  for (let i = 0; i < subcategoryOptions.length; i += 1) {
    console.log('i:', i, subcategoryOptions[i]);
    const subcategory = subcategoryOptions[i];
    const query = `INSERT INTO subcategories (subcategory_label) VALUES ('${subcategory}')`;
    pool.query(query, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  }
  /* NOTE: this seems to break its ability to work,
  * but not having it requires me to end the process manually
  * client.end();
  */
};

const seedPostgres = (data) => {
  pool.query(`INSERT INTO businesses (id) VALUES (${data.id})`)
    .then(() => {
      for (const categoryName in data) {
        const category = data[categoryName];
        const categoryId = categoryOptions.indexOf(categoryName);
        for (const subcategoryName in category) {
          const subcategory = category[subcategoryName];
          const subcategoryId = subcategoryOptions.indexOf(subcategoryName);
          for (const mealName in subcategory) {
            const meal = subcategory[mealName];
            pool.query(`INSERT INTO meals (
              meal_label, meal_description, price, business_id, category_id, subcategory_id
              ) VALUES (
              '${mealName}', '${meal.description}', '${meal.price}', '${data.id}', '${categoryId}', '${subcategoryId}'
              )`)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// This function resets the database (USE WITH CAUTION)
// setupPostgres('menus', true);
// This function seeds the database with all table details && seeds cats and subs
// seedPostgresDefaults();
