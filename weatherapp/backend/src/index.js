const debug = require('debug',)('weathermap',);

const Koa = require('koa',);
const router = require('koa-router',)();
const fetch = require('node-fetch',);
const cors = require('kcors',);

const appId = process.env.APPID || 'd93a2b0050b4ad77e55f1ae3d0a8293f';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors(),);

// small function that determines what address the apicall is made, then makes it
const fetchWeather = async (latitude = null, longitude = null,) => {
  let endpoint = '';
  if (latitude && longitude) {
    endpoint = `${mapURI}/weather?lat=${latitude}&lon=${longitude}&appid=${appId}&`;
  } else {
    endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}&`;
  }
  const response = await fetch(endpoint,);

  return response ? response.json() : {};
};

router.get('/api/weather', async (ctx,) => {
  const weatherData = await fetchWeather();
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather ? weatherData.weather[0] : {};
},);

router.get('/api/weather/:latitude/:longitude', async (ctx,) => {
  const weatherData = await fetchWeather(ctx.params.latitude, ctx.params.longitude,);
  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather ? weatherData.weather[0] : {};
},);

app.use(router.routes(),);
app.use(router.allowedMethods(),);

app.listen(port,);

console.log(`App listening on port ${port}`,);
