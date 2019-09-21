/* eslint-disable no-console */
const fs = require('fs');
const Chance = require('chance');
const sampleData = require('./sampleData.js');

const chance = Chance();

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
  const numberOfMeals = getRandomInt(4) + 2;
  const { words } = sampleData;
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
  const numberOfSubcategories = getRandomInt(4) + 1;
  const { subcategoryOptions, words } = sampleData;
  const subcategoriesArray = selectCategories(subcategoryOptions, numberOfSubcategories);
  for (let i = 0; i < subcategoriesArray.length; i += 1) {
    const subCategory = subcategoriesArray[i];
    const populatedSubCategory = populateSubCategory(words);
    populatedCategory[subCategory] = populatedSubCategory;
  }
  return populatedCategory;
};

// Creates a menu object.
const createMenu = (id) => {
  const random = getRandomInt(4) + 1;
  const numberOfCategories = random;
  const { categoryOptions } = sampleData;
  const categoriesArray = selectCategories(categoryOptions, numberOfCategories);
  const menu = { id };
  for (let i = 0; i < categoriesArray.length; i += 1) {
    const category = categoriesArray[i];
    const populatedCategory = populateCategory();
    menu[category] = populatedCategory;
  }
  return menu;
};

// Writes menu objects to a JSON file
const writeToFile = (writer, quantity, index = 0, callback) => {
  let menuCount = index;
  let countDown = quantity;
  const startTime = Date.now();
  const updateEvents = 50;
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
        JSONified = `${JSONified},`;
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

const jsonWriter = fs.createWriteStream('testSmallOutput.json');

writeToFile(jsonWriter, 225, 0, () => {
  console.log('Write complete');
});
