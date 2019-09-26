/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-console */
const fs = require('fs');
const Chance = require('chance');
const data = require('./sampleData.js');

const chance = Chance();
const { categoryOptions, subcategoryOptions, words } = data;

const getRandomInt = (max) => Math.ceil(Math.random() * Math.floor(max));

const createMeal = (wordsArray) => {
  const firstValue = getRandomInt(wordsArray.length - 10);
  const length = getRandomInt(10);
  const description = wordsArray.slice(firstValue, firstValue + length).join(' ');

  const price = 25 * (getRandomInt(70) + 30);
  const meal = {
    price,
    description,
  };
  return meal;
};

const selectCategories = (array, number) => {
  const categoriesArray = chance.pickset(array, number);
  return categoriesArray;
};

// Given a subcategory, create an object with a random number of meals between 3 and 6.
const populateSubCategory = () => {
  const populatedSubCategory = {};
  const numberOfMeals = getRandomInt(3);
  for (let i = 0; i < numberOfMeals; i += 1) {
    const firstValue = getRandomInt(words.length - 3);
    const name = words.slice(firstValue, firstValue + getRandomInt(2) + 1).join(' ');
    populatedSubCategory[name] = createMeal(words);
  }
  return populatedSubCategory;
};

// Given a category, create an object with a random number of populated subcategories
const populateCategory = () => {
  const populatedCategory = {};
  const numberOfSubcategories = getRandomInt(3);
  const subcategoriesArray = selectCategories(subcategoryOptions, numberOfSubcategories);
  for (let i = 0; i < subcategoriesArray.length; i += 1) {
    const subCategory = subcategoriesArray[i];
    const populatedSubCategory = populateSubCategory(words);
    populatedCategory[subCategory] = populatedSubCategory;
  }
  return populatedCategory;
};

// Creates a menu object.
const createMenu = (index) => {
  const numberOfCategories = getRandomInt(2) + 1;
  const categoriesArray = selectCategories(categoryOptions, numberOfCategories);
  const menu = {};
  if (typeof index !== 'undefined') {
    menu.id = index;
  }
  for (let i = 0; i < categoriesArray.length; i += 1) {
    const category = categoriesArray[i];
    const populatedCategory = populateCategory();
    menu[category] = populatedCategory;
  }
  return menu;
};

// Writes meals to a CSV file based on a generated menu.
const mealsToCsv = (writer, quantity, updates, times) => {
  const startTime = Date.now();
  let countDown = quantity;
  let estimatedTimeCalculated = false;
  let estimatedTimeRemaining = 0;
  let menuCount = times * quantity;
  const divisor = Math.floor(countDown / updates);
  const header = 'meal_label,description,price,business_id,category_id,subcategory_id\n';
  writer.write(header, 'utf8');

  const write = () => {
    let ok = true;
    do {
      const menu = createMenu();
      if (countDown % divisor === 0 && menuCount > 0) {
        const transpired = Date.now() - startTime;
        if (!estimatedTimeCalculated) {
          estimatedTimeRemaining = transpired * updates;
          estimatedTimeCalculated = true;
        }
        if (transpired < 60000) {
          console.log(`Current Time: ${transpired / 1000} seconds`);
          console.log(`Estimated time remaining: ${estimatedTimeRemaining / 1000 - transpired / 1000} seconds`);
        } else {
          console.log(`Current Time: ${transpired / 1000 / 60} minutes`);
          console.log(`Estimated time remaining: ${estimatedTimeRemaining / 1000 / 60 - transpired / 1000 / 60} minutes`);
        }
        console.log('Index:', menuCount);
      }
      countDown -= 1;
      for (const categoryLabel in menu) {
        const subcategories = menu[`${categoryLabel}`];
        const categoryId = categoryOptions.indexOf(categoryLabel) + 1;
        for (const subcategoryLabel in subcategories) {
          const meals = subcategories[`${subcategoryLabel}`];
          const subcategoryId = subcategoryOptions.indexOf(subcategoryLabel) + 1;
          for (const mealLabel in meals) {
            const meal = meals[`${mealLabel}`];
            const line = `${mealLabel},${meal.description},${meal.price},${menuCount},${categoryId},${subcategoryId}\n`;
            if (countDown === 0) {
              writer.write(line, 'utf8');
            } else {
              ok = writer.write(line, 'utf8');
            }
          }
        }
      }
      menuCount -= 1;
      if (countDown === 0) {
        // Last write - output total time details;
        console.log(`Total Time: ${((Date.now() - startTime) / 1000)} seconds`);
        console.log(`Total Time: ${((Date.now() - startTime) / 1000) / 60} minutes`);
      }
    } while (countDown > 0 && ok === true);
    if (countDown > 0) {
      writer.once('drain', write);
    }
  };
  write();
};

const businessesToCsv = (writer, quantity, updates) => {
  const startTime = Date.now();
  let countDown = quantity;
  let estimatedTimeCalculated = false;
  let estimatedTimeRemaining = 0;
  let menuCount = 0;
  const divisor = Math.floor(countDown / updates);
  const header = 'business_name\n';
  writer.write(header, 'utf8');

  const write = () => {
    let ok = true;
    do {
      if (countDown % divisor === 0 && menuCount > 0) {
        const transpired = Date.now() - startTime;
        if (!estimatedTimeCalculated) {
          estimatedTimeRemaining = transpired * updates;
          estimatedTimeCalculated = true;
        }
        if (transpired < 60000) {
          console.log(`Current Time: ${transpired / 1000} seconds`);
          console.log(`Estimated time remaining: ${estimatedTimeRemaining / 1000 - transpired / 1000} seconds`);
        } else {
          console.log(`Current Time: ${transpired / 1000 / 60} minutes`);
          console.log(`Estimated time remaining: ${estimatedTimeRemaining / 1000 / 60 - transpired / 1000 / 60} minutes`);
        }
        console.log('Index:', menuCount);
      }
      countDown -= 1;
      menuCount += 1;
      const line = `business${menuCount}\n`;
      if (countDown === 0) {
        writer.write(line, 'utf8');
      } else {
        ok = writer.write(line, 'utf8');
      }
      if (countDown === 0) {
        // Last write - output total time details;
        console.log(`Total Time: ${((Date.now() - startTime) / 1000)} seconds`);
        console.log(`Total Time: ${((Date.now() - startTime) / 1000) / 60} minutes`);
      }
    } while (countDown > 0 && ok === true);
    if (countDown > 0) {
      writer.once('drain', write);
    }
  };
  write();
};

// Writes menu objects to a JSON file
const writeToFile = (writer, quantity, index = 0, callback) => {
  let menuCount = index;
  let countDown = quantity;
  const startTime = Date.now();
  const updateEvents = 100;
  const divisor = Math.floor(countDown / updateEvents);
  let estimatedTimeCalculated = false;
  let estimatedTimeRemaining = 0;

  const write = () => {
    let ok = true;
    do {
      // This 'if' handles tracking how long the data generation takes.
      if (countDown % divisor === 0) {
        const transpired = Date.now() - startTime;
        if (!estimatedTimeCalculated) {
          estimatedTimeRemaining = transpired * 50;
          estimatedTimeCalculated = true;
        }
        if (transpired < 60000) {
          console.log(`Current Time: ${transpired / 1000} seconds`);
          console.log(`Estimated time remaining: ${estimatedTimeRemaining / 1000 - transpired / 1000} seconds`);
        } else {
          console.log(`Current Time: ${transpired / 1000 / 60} minutes`);
          console.log(`Estimated time remaining: ${estimatedTimeRemaining / 1000 / 60 - transpired / 1000 / 60} minutes`);
        }
        console.log('Index:', menuCount);
      }
      // Creates a menu and writes it to the JSON file.
      const myJson = createMenu(menuCount);
      let JSONified = JSON.stringify(myJson);
      countDown -= 1;
      if (countDown === 0) {
        // Last write - output total time details;
        console.log(`Total Time: ${((Date.now() - startTime) / 1000)} seconds`);
        console.log(`Total Time: ${((Date.now() - startTime) / 1000) / 60} minutes`);
        writer.write(JSONified, callback);
      } else {
        JSONified = `${JSONified}\n`;
        ok = writer.write(JSONified);
      }
      menuCount += 1;
    } while (countDown > 0 && ok);
    if (countDown > 0) {
      writer.once('drain', write);
    }
  };
  write();
};

const jsonWriter = fs.createWriteStream('menuElasticJSON.json');
const bizWriter = fs.createWriteStream('businesses.csv');

// This function creates a JSON file with 'x' number of menus
// writeToFile(jsonWriter, 10000000, 1, () => {
//   console.log('Write complete');
// });

// This function creates a CSV file with 'x' number of businesses
// businessesToCsv(bizWriter, 10000000, 100, () => {
//   console.log('Complete');
// });

// This function creates 'times' number of CSV files containing 'quantity' menus
const runXTimes = (times, quantity) => {
  for (let i = times; i > 0; i -= 1) {
    const csvWriter = fs.createWriteStream(`csvFile${i}.csv`);
    mealsToCsv(csvWriter, quantity, 500, i);
  }
};

// runXTimes(10, 1000000);
