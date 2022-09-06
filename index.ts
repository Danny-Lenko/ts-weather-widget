const formEl = document.querySelector('#searchForm') as HTMLFormElement
const searchEl = document.querySelector('#search') as HTMLInputElement
const selectedResultEl = document.querySelector('#selectedResult') as HTMLElement
const currentTemperatureEl = document.querySelector('#currentTemperature') as HTMLElement
const currentFeelsEl = document.querySelector('#currentFeels') as HTMLElement
const currentSkyEl = document.querySelector('#currentSky') as HTMLElement
const currentAreaEl = document.querySelector('#currentArea') as HTMLElement
const currentImgEl = document.querySelector('#currentImg') as HTMLImageElement
const forecastWrapperEl = document.querySelector('#forecastWrapper') as HTMLElement
const theWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const defaultLocation = 'albuquerque, new mexico'

// ---------- interfaces

interface Location {
   country: string;
   lat: number;
   local_names: Record<string, string>[];
   lon: number;
   name: string;
   state?: string;
}

interface CurrentWeather {
   base: string;
   clouds: Record<string, unknown>;
   cod: number;
   coord: Record<string, unknown>;
   dt: number;
   id: number;
   main: {
      feels_like: number;
      humidity: number;
      pressure: number;
      temp: number;
      temp_max: number;
      temp_min: number;
   }
   name: string;
   sys: {
      country: string;
      id: number;
      sunrise: number;
      sunset: number;
      type: number;
   };
   timezone: number;
   visibility: number;
   weather: {
      description: string;
      icon: string;
      id: number;
      main: string;
   }[];
   wind: Record<string, unknown>;
}

interface ForecastData {
   city: Record<string, unknown>;
   cnt: number;
   cod: string;
   list: TimestampForecast[];
   message: number;
}

interface TimestampForecast {
   clouds: Record<string, unknown>;
   dt: number;
   dt_txt: string;
   main: {
      feels_like: number;
      grnd_level: number;
      humidity: number;
      pressure: number;
      sea_level: number;
      temp: number;
      temp_kf: number;
      temp_max: number;
      temp_min: number;
   };
   pop: number;
   sys: Record<string, unknown>;
   visibility: number;
   weather: {
      description: string;
      icon: string;
      id: number;
      main: string;
   }[];
   wind: Record<string, unknown>;
}

interface GroupedData {
   date: string;
   icons: string[];
   descs: string[];
   temp_mins: number[];
   temp_maxes: number[];
}

// -------- end of interfaces

formEl.addEventListener('submit', (e) => {
   e.preventDefault()
   manageSearchRequest(searchEl.value)
   searchEl.value = ''
})

async function manageSearchRequest(userInput:string) {
   // get user's location
   const inputParts = processUserInput(userInput)
   const locationUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${inputParts[0]}&limit=5&appid=6ce73d6a3439c019a705955d1e4d518d`
   const locations = await fetchData(locationUrl)
   if (!locations[0]) return manageNoSearchResults()
   const coords = getPreciseCoords(inputParts, locations)
   // get current weather
   const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&units=metric&appid=6ce73d6a3439c019a705955d1e4d518d`
   const currentWeather = await fetchData(currentWeatherUrl)
   // get 5 days weather forecast & process it
   const weatherForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords[0]}&lon=${coords[1]}&units=metric&appid=6ce73d6a3439c019a705955d1e4d518d`
   const weatherForecast = await fetchData(weatherForecastUrl)
   const forecastGrouped = groupForecastData(weatherForecast)
   const forecastEdited = editForecastData(forecastGrouped)
   // display weather info
   displayCurrentInfo(currentWeather, coords[2])
   displayForecastElements(forecastEdited)
}

manageSearchRequest(defaultLocation)

async function fetchData(url: string) {
   try {
      const res = await fetch(url)
      const data = await res.json()
      return data
   } catch(err) {
      alert(`
         ${err} 
         Failed connecting with the server. Refresh page
      `);
   }
}

function processUserInput(userInput:string) {
   const userInputEdited = userInput.split(', ')
      .filter(word => word.length > 1)
      .map(
         word => word.replace(/[^A-Za-z\s]/, '').toLowerCase()
      )
   // format and render "selected" message content
   const selectedMsgContent = userInputEdited.map(exp => {
      return exp.split(' ').map(word => {
         return capitalizeStr(word)
      }).join(' ')
   })   
   selectedResultEl.innerHTML = selectedMsgContent.join(', ')
   
   return userInputEdited
}

function getPreciseCoords(userInput: string[], searchResult: Location[]) {
   // filter locations if 3d expression is a valid country acronym
   if (searchResult.length > 1 && userInput[2]) {
      if (userInput[2].length === 2) {
         searchResult = searchResult.filter(
            location => location.country === userInput[2].toUpperCase()
         )
      }
   }

   // filter locations if 2d expression is a valid country acronym or a valid state name
   // also gives at least one search result if user's input is improper
   if (searchResult.length > 1 && userInput[1]) {
      if (userInput[1].length === 2) {
         searchResult = searchResult.filter(
            location => location.country === userInput[1].toUpperCase()
         )
      } else {
         const utilityArr: Location[] = []
         searchResult = searchResult.filter(
            location => location.state 
               ? location.state.split(' ')[0] === capitalizeStr(userInput[1].split(' ')[0])
               : location
         )
         searchResult.forEach(location => {
            if (location.state) {
               utilityArr.unshift(location)
            } else {
               utilityArr.push(location)
            }
         })
         searchResult = [...utilityArr]
      }
   }

   return [searchResult[0].lat, searchResult[0].lon, searchResult[0].name]
}

function groupForecastData(data: ForecastData) {
   const dataArr: TimestampForecast[] = [...data.list]
   
   // maping to keep only usefull info
   const tempArr: {
      date: string;
      icon: string;
      desc: string;
      temp_min: number;
      temp_max: number;
   }[] = dataArr.map(timestamp => ({
      date: timestamp.dt_txt.split(' ')[0],
      icon: timestamp.weather[0].icon,
      desc: capitalizeStr(timestamp.weather[0].description),
      temp_min: Math.floor(timestamp.main.temp_min),
      temp_max: Math.floor(timestamp.main.temp_max)
   }))

   // group to have daily forecasts with categoriezed info 
   // adapted categorywise (date) grouping method from stackoverflow
   const result = tempArr.reduce((
      r: {
         hash: Record<string, GroupedData>; 
         arr: GroupedData[];
      }, 
      item
   ) => {
      let current = r.hash[item.date]
      
      if(!current) {
        r.hash[item.date] = { 
          date: item.date,
          icons: [],
          descs: [],
          temp_mins: [],
          temp_maxes: []
        }

        current = r.hash[item.date]
        r.arr.push(current)
      }
    
      current.icons.push(item.icon)
      current.descs.push(item.desc)
      current.temp_mins.push(item.temp_min)
      current.temp_maxes.push(item.temp_max)
      
      return r
   }, { hash: {}, arr: [] }).arr
      
   return result
}

// figueres out what wheather type dominates
function editForecastData(data: GroupedData[]) {
   return data.map(piece => ({
      date: formatDate(piece.date),
      icon: findMostFrequentEl(piece.icons),
      desc: findMostFrequentEl(piece.descs),
      temp_min: piece.temp_mins.sort((a,b)=>a-b)[0],
      temp_max: piece.temp_maxes.sort((a,b)=>b-a)[0]
   }))
}

// ------------- display functions

function displayCurrentInfo(info: CurrentWeather, name: string | number) {
   currentTemperatureEl.innerHTML = Math.floor(info.main.temp) + '°C'
   currentFeelsEl.innerHTML = 'Feels like ' + Math.floor(info.main.feels_like) + '°C'
   currentSkyEl.innerHTML = info.weather[0].main
   currentAreaEl.innerHTML = name + ', ' + info.sys.country
   currentImgEl.src =`http://openweathermap.org/img/wn/${info.weather[0].icon}@2x.png` 
}

function displayForecastElements(forecastInfo: {
   date: string;
   icon: string | number | undefined;
   desc: string | number | undefined;
   temp_min: number;
   temp_max: number;
}[]) {
   const content = forecastInfo.map((day, i) => (`

      <article class="row valign-wrapper article">
         <div class="col s3 center-align">
            <h4 class="week-day">${i === 0 ? 'Today' : getWeekday(day.date)}</h4>
         </div>
         <div class="col s3">
            <img src=http://openweathermap.org/img/wn/${day.icon}@2x.png alt="weather type">
         </div>
         <div class="col s4 valign-wrapper desc-container">
            <p>${day.desc}</p>
         </div>
         <div class="col s2 center-align">
            <p>${day.temp_max}</p>
            <p>${day.temp_min}</p>
         </div>
      </article>
         
   `)).join('')

   forecastWrapperEl.innerHTML = content
}

// ------------------ utility functions

function manageNoSearchResults() {
   selectedResultEl.innerHTML += `
      <span class="red-text"> - No Matching Results Found</span>
   ` 
}

function capitalizeStr(str: string) {
   return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatDate(date:string) {
   const dateArr = date.split('-')
   const year = dateArr[0]
   const month = dateArr[1]
   const day = dateArr[2]
   dateArr[0] = month
   dateArr[1] = day
   dateArr[2] = year
   return dateArr.join(', ')
}

function findMostFrequentEl(arr: (string | number) []){
   return arr.sort((a,b) =>
         arr.filter(v => v===a).length
       - arr.filter(v => v===b).length
   ).pop()
}

function getWeekday(date:string) {
   const dateObj = new Date(date)
   const weekday = dateObj.getDay()
   return theWeek[weekday]
}