const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['http://localhost:7199'], keyspace: 'test01' });

const query = 'SELECT * FROM menus WHERE id = ?';
client.execute(query, ['1'])
  .then((result) => {
    console.log(result);
  });

const menus = `
create table test (
id varchar,
category varchar,
subcat varchar,
meal_name varchar,
meal_price decimal,
meal_description varchar,
PRIMARY KEY (id, category, subcat, meal_name)
);`;
