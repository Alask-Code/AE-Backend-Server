# Altered Escape 2 Backend Server

This is the backend server for the game **Altered Escape 2**, responsible for data management and integration with the game. This repository contains backend logic such as session management, unique ID generation, process monitoring, and more.

## Dependencies

### Main Dependencies

- **`uuid`** -  (8.3.2)  
  A library for generating universally unique identifiers (UUIDs). Used to create unique IDs for users, sessions, or objects within the system.

- **`ps-list`** -  (7.2.0)  
  Allows listing the processes running on the system. Used for process monitoring and management.

- **`selfsigned`** -  (1.10.7)  
  Generates self-signed SSL certificates. Useful for setting up secure connections (HTTPS) on the server.

- **`write-json-file`** -  (4.3.0)  
  Enables writing JSON data to files, making it easy to persist configurations or data.

### Development Dependencies

- **`upx`** -  (1.0.6)  
  A tool to compress executables with UPX, reducing the size of the binary for distribution.

- **`nexe`** -  (3.3.3)  
  Used to package the Node.js code into a single executable file, allowing distribution without needing Node.js installed.

- **`eslint`** -  (^8.57.1)  
  A static code analysis tool to ensure code quality and consistency. Helps avoid bugs and poor coding practices.

- **`nodemon`** -  (^3.1.7)  
  A tool that automatically restarts the server whenever changes to the code are detected, enhancing the development cycle.

- **`node-minify`** -  (3.6.0)  
  Used to minify JavaScript, CSS, and HTML files, reducing file size for better performance in production.


## Scripts

This project includes the following scripts defined in the `package.json`:

- **`dev`**  
  Starts the server in development mode using `nodemon`, which automatically restarts when code changes are detected:
  ```bash
  npm run dev
  ```

- **`start`**  
  Starts the server in production mode with Node.js, without automatic restarts:
  ```bash
  npm run start
  ```

- **`cleanCache`**  
  Runs a script to clean the cache. It executes a `.bat` file located in the `utils` folder:
  ```bash
  npm run cleanCache
  ```

- **`build`**  
  Runs a build script to compile the code, using a `.bat` file located in the `utils` folder:
  ```bash
  npm run build
  ```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Alask-Code/AE-Backend-Server.git
   ```

2. Navigate to the project directory:
   ```bash
   cd altered-escape-2-backend
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

After installation, you can start the server locally using the following command:

```bash
npm start
```

This will start the server in development mode and it will automatically restart on code changes.

## Contributing

1. Fork this repository.
2. Create a new branch for your feature (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.