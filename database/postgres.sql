CREATE TABLE businesses (
  id INTEGER NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE businesses_categories_subcategories (
  id INTEGER NOT NULL,
  business_id INTEGER NOT NULL,
  category_id SMALLINT NOT NULL,
  subcategory_id SMALLINT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (business_id) REFERENCES businesses (id),
  FOREIGN KEY (category_id) REFERENCES categories (id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategories (id)
);

CREATE TABLE categories (
  id INTEGER NOT NULL,
  label VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
);

CREATE TABLE subcategories (
  id INTEGER NOT NULL,
  label VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
);

CREATE TABLE meals (
  id INTEGER NOT NULL,
  label VARCHAR(30) NOT NULL,
  meal_description VARCHAR(250),
  price SMALLINT,
  business_id INTEGER NOT NULL,
  category_id SMALLINT NOT NULL,
  subcategory_id SMALLINT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (business_id) REFERENCES businesses (id),
  FOREIGN KEY (category_id) REFERENCES categories (id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategories (id)
);
