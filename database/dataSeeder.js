/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const fs = require('fs');
const es = require('event-stream');
const { Client, Pool } = require('pg');

const sampleData = require('./sampleData.js');

const { categoryOptions, subcategoryOptions } = sampleData;

// // Shows all data at once:
// stream.pipe(through2((data, enc, cb) => {
//   const buf = Buffer.from(data);
//   const temp = JSON.parse(buf.toString());
//   console.log(temp);
// }));

// // Also shows all data at once:
// stream.on('data', (data) => {
//   const buf = Buffer.from(data);
//   const temp = JSON.parse(buf.toString());
//   console.log(temp);
// }).on('end', () => {
//   console.log('EEENNNNNNNDDDDD');
// });

const filePath = '/Users/preston/galv122/feastFinder/Menu/testSmallOutput.json';

const readObjectsFromJsonFile = (file, callback) => {
  const stream = fs.createReadStream(file, { objectMode: true, autoClose: true });
  const startTime = Date.now();
  let index = 0;
  stream.pipe(es.split(',{"id":'))
    .pipe(es.mapSync((object) => {
      stream.pause();
      let menu = `{"id":${object}`;
      if (index === 0) {
        // Handle first case
        menu = object;
      }
      index += 1;
      const parsedMenu = JSON.parse(menu);
      // console.log(parsedMenu); // To observe shape of data
      // Handle data here
      callback(parsedMenu)
        .then(() => console.log('testing then and promise')); // Use a callback here to handle either Elastic or Postgres?
      if (index % 100000 === 0) {
        console.log(`Total Time: ${((Date.now() - startTime) / 1000)} seconds`);
      }
      stream.resume();
    }))
    .on('error', (error) => console.log(error))
    .on('end', () => {
      // console log completed time
      console.log(`Total Time: ${((Date.now() - startTime) / 1000)} seconds`);
      console.log(`Total Time: ${((Date.now() - startTime) / 1000) / 60} minutes`);
      console.log('Finished');
    });
};

const seedElastic = (data) => {
  // Do elastic stuff here
};

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

    client.query('DROP TABLE IF EXISTS businesses_categories_subcategories CASCADE', (err, result) => {
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
    id INTEGER NOT NULL,
    PRIMARY KEY (id)
  );`, (err, res) => {
    if (err) {
      console.log('error:', err);
      return err;
    }
    return res;
  });

  client.query(`CREATE TABLE categories (
    id INTEGER NOT NULL,
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
    id INTEGER NOT NULL,
    subcategory_label VARCHAR(60) NOT NULL,
    PRIMARY KEY (id)
  );`, (err, res) => {
    if (err) {
      console.log('error:', err);
      return err;
    }
    return res;
  });

  client.query(`CREATE TABLE businesses_categories_subcategories (
    id INTEGER NOT NULL,
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

  client.query(`CREATE TABLE meals (
    id SERIAL NOT NULL,
    meal_label VARCHAR(60) NOT NULL,
    meal_description VARCHAR(250),
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
  // client.end(); // NOTE: this seems to break its ability to work
};

const seedPostgresDefaults = () => {
  const pool = new Pool({
    database: 'menus',
    max: 300,
  });
  // const client = new Client({
  //   database: 'menus',
  // });

  pool.connect();
  // client.connect();

  console.log("FRIST INSERT");
  for (let i = 0; i < categoryOptions.length; i += 1) {
    const category = categoryOptions[i];
    const query = `INSERT INTO categories (id, category_label) VALUES ('${i}', '${category}')`;
    pool.query(query, (err, res) => {
    // client.query(query, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  }
  console.log("SEONCDOIN OIENROEI");
  for (let i = 0; i < subcategoryOptions.length; i += 1) {
    console.log("i:", i, subcategoryOptions[i]);
    const subcategory = subcategoryOptions[i];
    const query = `INSERT INTO subcategories (id, subcategory_label) VALUES ('${i}', '${subcategory}')`;
    pool.query(query, (err, res) => {
    // client.query(query, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
      }
    });
  }

  console.log("ERJIOEJRIOEJRIEJIREREOIJREJRJE");

  // client.end();
};

const seedPostgres = (data) => {
  // Do Postgres stuff
  const pool = new Pool({
    database: 'menus',
  });

  // const client = new Client({
  //   database: 'menus',
  // });

  pool.connect();
  // client.connect();

  // client.query(`INSERT INTO businesses (id) VALUES (${data.id})`)
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
            // client.query(`INSERT INTO meals (
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

// readObjectsFromJsonFile(filePath);
// readObjectsFromJsonFile(filePath, seedElastic);

// setupPostgres('menus', true);
// seedPostgresDefaults();
readObjectsFromJsonFile(filePath, seedPostgres);
