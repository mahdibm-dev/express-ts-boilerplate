# Express Boiler Plate: 

## 🚀 Project Structure

Inside of your Express server, you'll see the following folders and files:

```
/
├── dist/
├── src/
│   └── controllers/
|   └── models/
|   └── routes/
|   └── services/
|   └── types/
|   └── index.ts
|   └── swagger.ts
└── nodemon.json  
└── package.json
└── tsconfig.json
```

We look for `.model.ts` files in the `src/models/` directory. Each file is exposed as a model based on its file name.

the `src/controllers/`, is responsible for ...


## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:3001`      |
| `npm run build`           | Build your production server to `./dist/`        |
| `npm run start`           | start your build locally, before deploying       |

## 👀 Want to learn more?

Feel free to check the sequelize-typescript [documentation](https://github.com/sequelize/sequelize-typescript) or jump into [swagger docs](https://github.com/Surnet/swagger-jsdoc).
