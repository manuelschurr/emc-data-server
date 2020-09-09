# trauma-room

## Project setup
```
npm install

npm install --save-dev @fortawesome/fontawesome-free
npm install axios
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Open Route Service
In case of an error regarding a post request to the Open Route Service API, the API-Token is probably invalid.

To fix this: 
- Generate a new API Token from: https://openrouteservice.org/dev/#/home
Use the following credentials or create your own Account
Username: kieferjan@yahoo.com
Password: G4!8CaLgvUAD

- Change the API Key in the App.vue and rtwSelectien.vue files

