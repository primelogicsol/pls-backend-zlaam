# API DEVELOPMENT GUIDELINE

### 1. First you have to fork or clone this repository

```bash
    git clone git@github.com:mr-zlaam/primeLogicFreelancePlateForm-server.git
```

### 2. Installing dependencies

<span style="color:red; font-size:2rem; font-weight:bold;">Note-></span> Don't use `npm` for this project, use `yarn` instead

```bash
    yarn install
```

### 3. Database configuration

- Create `.env` file in your `Project's` root directory by using following command.

  - ```bash
    cd  primeLogicSolutionFreelancePlateform-server # check the directory name before running this command.
    ```

  - ```bash
    touch .env   # if this command didn't work for you then you can create it manually
    ```

- Copy the configurations from [.env.example](/.env.example) and paste in your new created `.env` file.
- Now change the project configuration according to your need like `DATABASE_URL` and `SERVER_EMAIL`

### 4. Run Migrations

```bash
    yarn db:generate && yarn db:push
```

### 5. Starting development server

```bash
    yarn dev
```

<h3 style="color:yellow;">Your server will run on <code> PORT:8000</code></h3>
