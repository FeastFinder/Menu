# Project Name

> Project description

## Related Projects

  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
1. [CRUD API Routes](#crud)

## Usage

> Some usage instructions

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

## CRUD
### API Routes

### GET /api/:listing/menu
- Returns a menu for given listing id.

```sh
example output:
{id: 22,
  mealCategories: {
    dinner: {
      mealTypes: {
        appetizers: {
          foodItemOne: {
            description: 'plerbergerb sherbaderb',
            price: 11.00,
          },
          foodItemTwo: {
            description: 'terkaberb yarbersherb',
            price: 11.50,
          }
        },
        entrees: {
          foodItemThree: {
            description: 'karpaklerb derbaterb',
            price: 17.00,
          }
        }
      },
    },
    lunch: {
      mealTypes: {
        sandwiches: {
          foodItemOther: {
            description: 'hergenblerb kerpaterb',
            price: 12.00,
          },
        },
      },
    },
  },
}
```

### POST /api/:listing/menu
- Creates a menu record.
- Returns the created data object if successful.

```sh
example input:
{id: 22,
  mealCategories: {
    dinner: {
      mealTypes: {
        appetizers: {
          foodItemOne: {
            description: 'plerbergerb sherbaderb',
            price: 11.00,
          },
          foodItemTwo: {
            description: 'terkaberb yarbersherb',
            price: 11.50,
          }
        },
        entrees: {
          foodItemThree: {
            description: 'karpaklerb derbaterb',
            price: 17.00,
          }
        }
      },
    },
    lunch: {
      mealTypes: {
        sandwiches: {
          foodItemOther: {
            description: 'hergenblerb kerpaterb',
            price: 12.00,
          },
        },
      },
    },
  },
}
```

### PUT /api/:listing/menu
- Updates a menu based on listing id.
- Returns the updated data object if successful.

```sh
example input:
{id: 22,
  mealCategories: {
    dinner: {
      mealTypes: {
        appetizers: {
          foodItemOne: {
            description: 'plerbergerb sherbaderb',
            price: 11.00,
          },
          foodItemTwo: {
            description: 'terkaberb yarbersherb',
            price: 11.50,
          }
        },
        entrees: {
          foodItemThree: {
            description: 'karpaklerb derbaterb',
            price: 17.00,
          }
        }
      },
    },
    lunch: {
      mealTypes: {
        sandwiches: {
          foodItemOther: {
            description: 'hergenblerb kerpaterb',
            price: 12.00,
          },
        },
      },
    },
  },
}
```

### DELETE /api/:listing/menu
- Deletes the menu for a given listing id.
- Returns the deleted data object if successful.

```sh
example output:
{id: 22,
  mealCategories: {
    dinner: {
      mealTypes: {
        appetizers: {
          foodItemOne: {
            description: 'plerbergerb sherbaderb',
            price: 11.00,
          },
          foodItemTwo: {
            description: 'terkaberb yarbersherb',
            price: 11.50,
          }
        },
        entrees: {
          foodItemThree: {
            description: 'karpaklerb derbaterb',
            price: 17.00,
          }
        }
      },
    },
    lunch: {
      mealTypes: {
        sandwiches: {
          foodItemOther: {
            description: 'hergenblerb kerpaterb',
            price: 12.00,
          },
        },
      },
    },
  },
}
```

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

