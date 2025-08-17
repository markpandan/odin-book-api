# odin-book-api

This repository was made as an API for the Odin Book Project: https://www.theodinproject.com/lessons/node-path-nodejs-odin-book

The frontend of this application was located on a separate GitHub repository: https://github.com/markpandan/odin-book

## Functionality

The API was made to secure messages, and uploaded images, while verifying the validity of created, and logged accounts. The following notes are highlights of the libraries and/or APIs mainly used:

- [multer](https://expressjs.com/en/resources/middleware/multer.html) middleware was utilized to receive the files from the requested resource. They are being stored on the `/tmp/` folder first before being sent to the [Cloudinary](https://cloudinary.com/) server.
- [Passport.js](https://www.passportjs.org/) was used to verify JWT tokens from the Authorization header of the request, and permit access to several key datas.

## Installation

Clone this repository, and install the necessary modules by running this command in your command line that was relative to this file directory:

```
npm install
```

Several sensitive data, including the database URI were stored under several [environment variables](https://en.wikipedia.org/wiki/Environment_variable). This is to secure the data, and integrity of the app. Therefore, a new [PostgreSQL](https://www.postgresql.org/) database must be configured. This also applies with creating a new Cloudinary account.

The following environmental variables are required to make the app running. They must be stored under an `.env` file.

- `DATABASE_URL` - the url provided by PostgreSQL that was configured to make a connection to the database.
- `CLOUDINARY_URL` - provided by Cloudinary to make an access to the cloud storage of the created account
- `CLOUDINARY_DATABASE_FOLDER` - _optional_: the folder from the cloud storage which the files are securely stored.
- `JWT_SECRET_KEY` - used to verify any incoming tokens

> **NOTE:** _The optional variables are still required to be placed on file. Just leave an empty string to avoid any potential compilation errors._

Once done, build the respective tables based on the `schema.prisma` file by migrating it to your created database. This can be easily done by running the respective code below:

```
npm run build
```

The API should be properly configured by now. To run the app, execute the following line:

```
npm run server
```

## Components

This API repository utilizes the following libraries and/or APIs:

- [Express JS](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [Passport JS](https://www.passportjs.org/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [multer](https://expressjs.com/en/resources/middleware/multer.html)
