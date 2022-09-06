var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var formEl = document.querySelector('#searchForm');
var searchEl = document.querySelector('#search');
var selectedResultEl = document.querySelector('#selectedResult');
var currentTemperatureEl = document.querySelector('#currentTemperature');
var currentFeelsEl = document.querySelector('#currentFeels');
var currentSkyEl = document.querySelector('#currentSky');
var currentAreaEl = document.querySelector('#currentArea');
var currentImgEl = document.querySelector('#currentImg');
var forecastWrapperEl = document.querySelector('#forecastWrapper');
var theWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
var defaultLocation = 'albuquerque, new mexico';
// -------- end of interfaces
formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    manageSearchRequest(searchEl.value);
    searchEl.value = '';
});
function manageSearchRequest(userInput) {
    return __awaiter(this, void 0, void 0, function () {
        var inputParts, locationUrl, locations, coords, currentWeatherUrl, currentWeather, weatherForecastUrl, weatherForecast, forecastGrouped, forecastEdited;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    inputParts = processUserInput(userInput);
                    locationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=".concat(inputParts[0], "&limit=5&appid=6ce73d6a3439c019a705955d1e4d518d");
                    return [4 /*yield*/, fetchData(locationUrl)];
                case 1:
                    locations = _a.sent();
                    if (!locations[0])
                        return [2 /*return*/, manageNoSearchResults()];
                    coords = getPreciseCoords(inputParts, locations);
                    currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat=".concat(coords[0], "&lon=").concat(coords[1], "&units=metric&appid=6ce73d6a3439c019a705955d1e4d518d");
                    return [4 /*yield*/, fetchData(currentWeatherUrl)
                        // get 5 days weather forecast & process it
                    ];
                case 2:
                    currentWeather = _a.sent();
                    weatherForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=".concat(coords[0], "&lon=").concat(coords[1], "&units=metric&appid=6ce73d6a3439c019a705955d1e4d518d");
                    return [4 /*yield*/, fetchData(weatherForecastUrl)];
                case 3:
                    weatherForecast = _a.sent();
                    forecastGrouped = groupForecastData(weatherForecast);
                    forecastEdited = editForecastData(forecastGrouped);
                    // display weather info
                    displayCurrentInfo(currentWeather, coords[2]);
                    displayForecastElements(forecastEdited);
                    return [2 /*return*/];
            }
        });
    });
}
manageSearchRequest(defaultLocation);
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    err_1 = _a.sent();
                    alert("\n         ".concat(err_1, " \n         Failed connecting with the server. Refresh page\n      "));
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function processUserInput(userInput) {
    var userInputEdited = userInput.split(', ')
        .filter(function (word) { return word.length > 1; })
        .map(function (word) { return word.replace(/[^A-Za-z\s]/, '').toLowerCase(); });
    // format and render "selected" message content
    var selectedMsgContent = userInputEdited.map(function (exp) {
        return exp.split(' ').map(function (word) {
            return capitalizeStr(word);
        }).join(' ');
    });
    selectedResultEl.innerHTML = selectedMsgContent.join(', ');
    return userInputEdited;
}
function getPreciseCoords(userInput, searchResult) {
    // filter locations if 3d expression is a valid country acronym
    if (searchResult.length > 1 && userInput[2]) {
        if (userInput[2].length === 2) {
            searchResult = searchResult.filter(function (location) { return location.country === userInput[2].toUpperCase(); });
        }
    }
    // filter locations if 2d expression is a valid country acronym or a valid state name
    // also gives at least one search result if user's input is improper
    if (searchResult.length > 1 && userInput[1]) {
        if (userInput[1].length === 2) {
            searchResult = searchResult.filter(function (location) { return location.country === userInput[1].toUpperCase(); });
        }
        else {
            var utilityArr_1 = [];
            searchResult = searchResult.filter(function (location) { return location.state
                ? location.state.split(' ')[0] === capitalizeStr(userInput[1].split(' ')[0])
                : location; });
            searchResult.forEach(function (location) {
                if (location.state) {
                    utilityArr_1.unshift(location);
                }
                else {
                    utilityArr_1.push(location);
                }
            });
            searchResult = __spreadArray([], utilityArr_1, true);
        }
    }
    return [searchResult[0].lat, searchResult[0].lon, searchResult[0].name];
}
function groupForecastData(data) {
    var dataArr = __spreadArray([], data.list, true);
    // maping to keep only usefull info
    var tempArr = dataArr.map(function (timestamp) { return ({
        date: timestamp.dt_txt.split(' ')[0],
        icon: timestamp.weather[0].icon,
        desc: capitalizeStr(timestamp.weather[0].description),
        temp_min: Math.floor(timestamp.main.temp_min),
        temp_max: Math.floor(timestamp.main.temp_max)
    }); });
    // group to have daily forecasts with categoriezed info 
    // adapted categorywise (date) grouping method from stackoverflow
    var result = tempArr.reduce(function (r, item) {
        var current = r.hash[item.date];
        if (!current) {
            r.hash[item.date] = {
                date: item.date,
                icons: [],
                descs: [],
                temp_mins: [],
                temp_maxes: []
            };
            current = r.hash[item.date];
            r.arr.push(current);
        }
        current.icons.push(item.icon);
        current.descs.push(item.desc);
        current.temp_mins.push(item.temp_min);
        current.temp_maxes.push(item.temp_max);
        return r;
    }, { hash: {}, arr: [] }).arr;
    return result;
}
// figueres out what wheather type dominates
function editForecastData(data) {
    return data.map(function (piece) { return ({
        date: formatDate(piece.date),
        icon: findMostFrequentEl(piece.icons),
        desc: findMostFrequentEl(piece.descs),
        temp_min: piece.temp_mins.sort(function (a, b) { return a - b; })[0],
        temp_max: piece.temp_maxes.sort(function (a, b) { return b - a; })[0]
    }); });
}
// ------------- display functions
function displayCurrentInfo(info, name) {
    currentTemperatureEl.innerHTML = Math.floor(info.main.temp) + '°C';
    currentFeelsEl.innerHTML = 'Feels like ' + Math.floor(info.main.feels_like) + '°C';
    currentSkyEl.innerHTML = info.weather[0].main;
    currentAreaEl.innerHTML = name + ', ' + info.sys.country;
    currentImgEl.src = "http://openweathermap.org/img/wn/".concat(info.weather[0].icon, "@2x.png");
}
function displayForecastElements(forecastInfo) {
    var content = forecastInfo.map(function (day, i) { return ("\n\n      <article class=\"row valign-wrapper article\">\n         <div class=\"col s3 center-align\">\n            <h4 class=\"week-day\">".concat(i === 0 ? 'Today' : getWeekday(day.date), "</h4>\n         </div>\n         <div class=\"col s3\">\n            <img src=http://openweathermap.org/img/wn/").concat(day.icon, "@2x.png alt=\"weather type\">\n         </div>\n         <div class=\"col s4 valign-wrapper desc-container\">\n            <p>").concat(day.desc, "</p>\n         </div>\n         <div class=\"col s2 center-align\">\n            <p>").concat(day.temp_max, "</p>\n            <p>").concat(day.temp_min, "</p>\n         </div>\n      </article>\n         \n   ")); }).join('');
    forecastWrapperEl.innerHTML = content;
}
// ------------------ utility functions
function manageNoSearchResults() {
    selectedResultEl.innerHTML += "\n      <span class=\"red-text\"> - No Matching Results Found</span>\n   ";
}
function capitalizeStr(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function formatDate(date) {
    var dateArr = date.split('-');
    var year = dateArr[0];
    var month = dateArr[1];
    var day = dateArr[2];
    dateArr[0] = month;
    dateArr[1] = day;
    dateArr[2] = year;
    return dateArr.join(', ');
}
function findMostFrequentEl(arr) {
    return arr.sort(function (a, b) {
        return arr.filter(function (v) { return v === a; }).length
            - arr.filter(function (v) { return v === b; }).length;
    }).pop();
}
function getWeekday(date) {
    var dateObj = new Date(date);
    var weekday = dateObj.getDay();
    return theWeek[weekday];
}
