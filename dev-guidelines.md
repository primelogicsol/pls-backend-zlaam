# Developer Guidelines

### 1. First you have to fork or clone this repository

```bash
    git clone git@github.com:mr-zlaam/primeLogicFreelancePlateForm-server.git
```

### 2. Installing dependencies

<span style="color:red; font-size:2rem; font-weight:bold;">Note-></span> Don't use `npm` for this project, use `yarn` instead

```bash
    yarn install
```

### 3. Run Migrations

```bash
    yarn db:generate && yarn db:push
```

### 4. Starting development server

```bash
    yarn dev
```

<h3 style="color:yellow;">Your server will run on <code> PORT:8000</code></h3>
