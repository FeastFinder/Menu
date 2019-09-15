const Faker = require('faker');
const Chance = require('chance');
const fs = require('fs');

// const data = require('./sampleData.js');

const chance = Chance();

const getRandomInt = (max) => Math.ceil(Math.random() * Math.floor(max));
const randomBetween = (min, max) => chance.integer({ min, max });


const categoriesOptions = ['Cocktails', 'Bar', 'Dinner', 'Brunch', 'Cheese', 'Lunch', 'Dessert'];
const subCategoriesOptions = ['Raw Bar', 'Snacks', 'Appetizers', 'Cheese', 'Absinthe Classics', 'Entrees', 'Sides', 'Small Plates', 'Soups & Salads', 'Pastries', 'Main', 'Desserts', 'After-dinner Spirits', 'Selection of Brandy', 'Selected Single-malt Scotches', 'Port, Sherry, & Madeira', 'Dessert Wines', 'Selection of Tea', 'Cocktails'];

const words = ['ducimus',
  'accusamus',
  'voluptatibus',
  'voluptas',
  'occaecati',
  'id',
  'quia',
  'sit',
  'quia',
  'molestias',
  'dolorem',
  'et',
  'quidem',
  'provident',
  'debitis',
  'voluptas',
  'deserunt',
  'aut',
  'corrupti',
  'voluptatem',
  'dolorum',
  'error',
  'totam',
  'eligendi',
  'esse',
  'nostrum',
  'aut',
  'expedita',
  'perferendis',
  'non',
  'sit',
  'qui',
  'ea',
  'est',
  'soluta',
  'omnis',
  'eum',
  'id',
  'est',
  'quos',
  'porro',
  'consequatur',
  'nemo',
  'aliquam',
  'et',
  'autem',
  'sunt',
  'unde',
  'quae',
  'pariatur',
  'eos',
  'accusamus',
  'consequatur',
  'dolore',
  'nihil',
  'debitis',
  'est',
  'nihil',
  'consectetur',
  'quod',
  'et',
  'consequatur',
  'inventore',
  'voluptas',
  'voluptatum',
  'omnis',
  'dignissimos',
  'officiis',
  'fuga',
  'sunt',
  'quia',
  'explicabo',
  'veniam',
  'delectus',
  'saepe',
  'sit',
  'modi',
  'voluptatum',
  'placeat',
  'tempora',
  'veniam',
  'et',
  'consequatur',
  'qui',
  'repudiandae',
  'sint',
  'rerum',
  'at',
  'sed',
  'labore',
  'inventore',
  'aut',
  'provident',
  'officia',
  'id',
  'vel',
  'dolore',
  'autem',
  'dignissimos',
  'alias'];


// build an object (menu)

// each menu will have an id

// attached to each menu will be an object of main categories

// attached to each category will be an object of sub categories

// attached to each sub category will be an object of meals

// meals will have prices and descriptions (name: {price: $$$, description: 'string')

const createMeal = (wordsArray) => {
  // const description = Faker.lorem.sentences(getRandomInt(2)); // TODO
  // const description = 'description';
  // const firstValue = randomBetween(0, wordsArray.length - 3);
  const firstValue = getRandomInt(wordsArray.length - 10);
  const length = getRandomInt(10);
  const description = wordsArray.slice(firstValue, firstValue + length).join(' ');

  // console.log(description);
  // const description = chance.pickset(wordsArray, 15);

  const price = 25 * (getRandomInt(70) + 30);
  // const price = 25 * randomBetween(30, 100); // TODO
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

const populateSubCategory = (array) => {
  // given a subcategory, create an object with a random number of meals between 4 and 12
  const populatedSubCategory = {};
  const numberOfMeals = getRandomInt(4);
  // const numberOfMeals = randomBetween(4, 8); // TODO
  for (let i = 0; i < numberOfMeals; i += 1) {
    // const name = chance.pickset(array, 3);
    const firstValue = getRandomInt(words.length - 3);

    const name = words.slice(firstValue, firstValue + 3).join(' ');

    // const name = `herberkerb`; // TODO
    // const name = `${Faker.lorem.words(3)}`; // TODO
    // const name = `${Faker.lorem.words(1)} ${Faker.lorem.words(getRandomInt(2))}`; // TODO
    // populatedSubCategory[name] = createMeal(); // TODO
    populatedSubCategory[name] = createMeal(words);
  }
  // console.log(populatedSubCategory);
  return populatedSubCategory;
};

const populateCategory = () => {
  // given a category, create an object with a random number of populated subcategories
  const populatedCategory = {};
  const numberOfSubCategories = getRandomInt(4) + 1;
  // const numberOfSubCategories = (randomBetween(5, subCategoriesOptions.length / 2)); // TODO
  const subCategoriesArray = selectCategories(subCategoriesOptions, numberOfSubCategories);
  for (let i = 0; i < subCategoriesArray.length; i += 1) {
    const subCategory = subCategoriesArray[i];
    const populatedSubCategory = populateSubCategory(words);
    populatedCategory[subCategory] = populatedSubCategory;
    // console.log("TYPEOF", typeof populatedSubCategory);
    // console.log(populatedCategory);
  }
  return populatedCategory;
};

const createMenu = (id) => {
  const random = 4;
  // const random = (randomBetween(2, categoriesOptions.length)); // TODO
  const numberOfCategories = random;
  const categoriesArray = selectCategories(categoriesOptions, numberOfCategories);
  const menu = { id };
  for (let i = 0; i < categoriesArray.length; i += 1) {
    const category = categoriesArray[i];
    const populatedCategory = populateCategory();
    menu[category] = populatedCategory;
  }
  // console.log(menu.id);
  return menu;
};

// use a for loop to create JSON menu objects and insert into JSON file;
// for the first iteration, add a '[' to the start
// for every iteration (except last) add a ','
// for the last iteration, add a ']'

const jsonWriter = fs.createWriteStream('testJsonOutput.json');

const createMenusJSONFile = (quantity) => {
  const divisor = quantity / 10;
  const start = Date.now();
  for (let i = 0; i < quantity; i += 1) {
    if (i % divisor === 0) {
      console.log(`Current Time: ${(Date.now() - start) / 1000} seconds`);
      console.log(i);
    }
    const myJson = createMenu(i);
    // console.log(myJson);
    let JSONified = JSON.stringify(myJson);
    if (i === 0) {
      JSONified = `[${JSONified},`;
    } else if (i === quantity - 1) {
      console.log(`Regular End: ${Date.now()}`);
      console.log(`Total Time: ${((Date.now() - start) / 1000)} seconds`);
      console.log(`Total Time: ${((Date.now() - start) / 1000) / 60} minutes`);
      JSONified = `${JSONified}]`;
    }
    // jsonWriter.write(myJson);
    // jsonWriter.write(JSONified); // TODO -- CURRENT WORKING, BUT LAGS OUT AT HALFWAY 5MIL
    // fs.appendFile('test.json', JSONified, (err) => {
    //   if (err) {
    //     // console.log(err);
    //   }
    // });
  }
};

// NOT IN USE:
const writeToFile = (writer, quantity, start = 0, callback) => {
  const startTime = Date.now();
  const updateEvents = 50;
  const divisor = quantity / updateEvents;
  const write = () => {
    let ok = true;
    do {
      if (quantity % divisor === 0) {
        console.log(`Current Time: ${(Date.now() - startTime) / 1000} seconds`);
        console.log(quantity);
      }
      const myJson = createMenu(start);
      let JSONified = JSON.stringify(myJson);
      start += 1;
      quantity -= 1;

      if (quantity === 0) {
        // last time
        console.log(`Total Time: ${((Date.now() - startTime) / 1000)} seconds`);
        console.log(`Total Time: ${((Date.now() - startTime) / 1000) / 60} minutes`);
        JSONified = `${JSONified}]`;
        writer.write(JSONified, callback);
      } else if (start === 0) {
        JSONified = `[${JSONified},`;
        ok = writer.write(JSONified);
      } else {
        JSONified = `${JSONified},`;
        ok = writer.write(JSONified);
      }
    } while (quantity > 0 && ok);
    if (quantity > 0) {
      writer.once('drain', write);
    }
  };
  write();
};

// NOTE: Maximum callstack exceeded
// const createMenusJSONFileRecursively = (limit, start = 0) => {
//   if (limit === 0) {
//     return;
//   }
//   if (limit % 1000 === 0) {
//     console.log(limit);
//   }
//   const myJSON = createMenu(start);
//   let JSONified = JSON.stringify(myJSON);
//   if (start === 0) {
//     console.log(`Recursive Start: ${Date.now()}`);
//     JSONified = `[${JSONified},`;
//   } else if (limit === 1) {
//     console.log(`Recursive End: ${Date.now()}`);
//     JSONified = `${JSONified}]`;
//   }
//   fs.appendFile('testRecurseive.json', JSONified, (err) => {
//     if (err) {
//       console.log(err);
//     }
//   });
//   createMenusJSONFileRecursively(limit - 1, start + 1);
// };

writeToFile(jsonWriter, 10000000, 0, () => {
  console.log("OY, CALLBACK TRIGGGGGGGERED");
});
// createMenusJSONFile(10000000);

// createMenusJSONFileRecursively(5000);


// console.log(Faker.lorem.words(100).split(' '));
