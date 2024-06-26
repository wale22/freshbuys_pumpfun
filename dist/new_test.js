"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var api_1 = require("./api");
var param_1 = require("./param");
var grammy_1 = require("grammy");
var puppeteer = require('puppeteer-extra');
var StealthPlugin = require('puppeteer-extra-plugin-stealth');
var bot_token = "7351592175:AAHRKoYsnrMIEKM_qbw4BTFc6UCiajZl0TQ";
var bot = new grammy_1.Bot(bot_token);
var channel_id = '-1002214628234';
puppeteer.use(StealthPlugin());
var url = "\nhttps://photon-sol.tinyastro.io/api/discover/search?buys_from=&buys_to=&dexes=pump&freeze_authority=false&lp_burned_perc=false&mint_authority=false&mkt_cap_from=&mkt_cap_to=&one_social=false&order_by=created_at&order_dir=desc&sells_from=&sells_to=&top_holders_perc=false&txns_from=&txns_to=&usd_liq_from=&usd_liq_to=&volume_from=&volume_to=";
var loggedone = null;
function formatTimeElapsed(currentTimeInSeconds, previousTimeInSeconds) {
    var elapsedTime = currentTimeInSeconds - previousTimeInSeconds;
    var hours = Math.floor(elapsedTime / 3600);
    var minutes = Math.floor((elapsedTime % 3600) / 60);
    var seconds = elapsedTime % 60;
    var formattedTime = hours + "hr " + minutes + "min " + seconds + "sec";
    return formattedTime;
}
var sendtoTg = function (filterData, creator, topOne) { return __awaiter(void 0, void 0, void 0, function () {
    var filled, launch, nonFilled, tis, message, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filled = filterData.filter(function (token) { return token.complete === true; });
                launch = topOne.attributes;
                nonFilled = filterData.length - filled.length;
                tis = Date.now() / 1000;
                if (!(nonFilled - filled < 3)) return [3 /*break*/, 4];
                if (!(topOne.attributes.socials === null)) return [3 /*break*/, 2];
                message = "\uD83C\uDF1F\uD83D\uDC8A New Good Creator Creation Detected \uD83D\uDC8A\uD83C\uDF1F\n\n\uD83C\uDFF7 *".concat(launch.name, " (").concat(launch.symbol, "-sol)*\n`").concat(launch.tokenAddress, "`\n\n\uD83D\uDD0D*Creator:*[").concat(creator.substring(0, 5), "](https://pump.fun/profile/").concat(creator, ")\n\uD83D\uDCB0 *Market cap:* $").concat(Math.floor(launch.fdv), "\n\n\uD83C\uDF1F*Best Previous:*").concat(filterData[0].name, "\n*ATH:*$").concat(Math.floor(filterData[0].usd_market_cap), "\n\n*Non-filled:*").concat(nonFilled, "\n*filled:*").concat(filled.length, "\n*score:*").concat(Math.floor((filled.length / filterData.length) * 100), "%\n\n*No socials yet*\n\n\u23F2 time elapsed since creation:").concat(formatTimeElapsed(tis, launch.created_timestamp), "\n");
                return [4 /*yield*/, bot.api.sendMessage(channel_id, message, { parse_mode: "Markdown" })];
            case 1:
                _a.sent();
                return [3 /*break*/, 4];
            case 2:
                message = "\uD83C\uDF1F\uD83D\uDC8A New Good Creator Creation Detected \uD83D\uDC8A\uD83C\uDF1F\n\n\uD83C\uDFF7 *".concat(launch.name, " (").concat(launch.symbol, "-sol)*\n`").concat(launch.tokenAddress, "`\n\n\uD83D\uDD0D*Creator:*[").concat(creator.substring(0, 5), "](https://pump.fun/profile/").concat(creator, ")\n\uD83D\uDCB0 *Market cap:* $").concat(Math.floor(launch.fdv), "\n\n\uD83C\uDF1F*Best Previous:*").concat(filterData[0].name, "\n*ATH:*$").concat(Math.floor(filterData[0].usd_market_cap), "\n\n*Non-filled:*").concat(nonFilled, "\n*filled:*").concat(filled.length, "\n*score:*").concat(Math.floor((filled.length / filterData.length) * 100), "%\n\n\n*Telegram:* ").concat(launch.socials.telegram !== null ? launch.socials.telegram : '', "\n*Twitter(X):* ").concat(launch.socials.twitter !== null ? launch.socials.twitter : '', "\n*Website:* ").concat(launch.socials.website !== null ? launch.socials.website : '', "\n\n\u23F2 time elapsed since creation:").concat(formatTimeElapsed(tis, launch.created_timestamp), "\n");
                return [4 /*yield*/, bot.api.sendMessage(channel_id, message, { parse_mode: "Markdown", reply_parameters: { message_id: 1 } })];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
var filterData = function (creator) { return __awaiter(void 0, void 0, void 0, function () {
    var filtered_previous, res, previous, filteredTokens, seenAddresses, index, token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filtered_previous = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.get("https://frontend-api.pump.fun/coins/user-created-coins/".concat(creator, "?offset=0&limit=50&includeNsfw=false"))];
            case 2:
                res = _a.sent();
                previous = res.data;
                filteredTokens = previous.filter(function (token) { return token.usd_market_cap > 100000; });
                if (filteredTokens.length !== 0) {
                    previous.sort(function (a, b) { return b.usd_market_cap - a.usd_market_cap; });
                    seenAddresses = new Set();
                    for (index = 0; index < previous.length; index++) {
                        token = previous[index];
                        if (!seenAddresses.has(token.mint)) {
                            filtered_previous.push(token);
                            seenAddresses.add(token.mint);
                        }
                    }
                    return [2 /*return*/, filtered_previous];
                }
                else {
                    return [2 /*return*/, false];
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error fetching data:", error_1);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
var startBrowser = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        puppeteer.launch({ headless: true }).then(function (browser) { return __awaiter(void 0, void 0, void 0, function () {
            var page, apiResponseJson, reloadPage, reloadInterval;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Running tests..');
                        return [4 /*yield*/, browser.newPage()];
                    case 1:
                        page = _a.sent();
                        return [4 /*yield*/, page.setExtraHTTPHeaders(param_1.params.xtraheaders)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, page.setCookie.apply(page, param_1.params.cookies)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, page.setRequestInterception(true)];
                    case 4:
                        _a.sent();
                        apiResponseJson = null;
                        page.on('request', function (request) {
                            if (request.url().includes('/api/discover')) {
                                request.continue();
                            }
                            else {
                                request.continue();
                            }
                        });
                        page.on('response', function (response) { return __awaiter(void 0, void 0, void 0, function () {
                            var topOne_1, launch, other_data, creator_1, launch, other_data, creator_2, error_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!response.url().includes('/api/discover')) return [3 /*break*/, 10];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 9, , 10]);
                                        return [4 /*yield*/, response.json()];
                                    case 2:
                                        apiResponseJson = _a.sent();
                                        topOne_1 = apiResponseJson.data[0];
                                        if (!(loggedone !== null)) return [3 /*break*/, 6];
                                        if (!(loggedone.attributes.tokenAddress !== topOne_1.attributes.tokenAddress)) return [3 /*break*/, 4];
                                        loggedone = topOne_1;
                                        launch = topOne_1.attributes;
                                        return [4 /*yield*/, (0, api_1.getCoinData)(launch.tokenAddress)];
                                    case 3:
                                        other_data = _a.sent();
                                        creator_1 = other_data.creator;
                                        filterData(creator_1).then(function (filter_arr) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!filter_arr) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, sendtoTg(filter_arr, creator_1, topOne_1)];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        console.log('scaning...');
                                        console.log(topOne_1.attributes.tokenAddress, '\n');
                                        return [3 /*break*/, 5];
                                    case 4:
                                        console.log('seen');
                                        console.log(topOne_1.attributes.tokenAddress, '\n');
                                        _a.label = 5;
                                    case 5: return [3 /*break*/, 8];
                                    case 6:
                                        loggedone = topOne_1;
                                        launch = topOne_1.attributes;
                                        return [4 /*yield*/, (0, api_1.getCoinData)(launch.tokenAddress)];
                                    case 7:
                                        other_data = _a.sent();
                                        creator_2 = other_data.creator;
                                        filterData(creator_2).then(function (filter_arr) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!filter_arr) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, sendtoTg(filter_arr, creator_2, topOne_1)];
                                                    case 1:
                                                        _a.sent();
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        _a.label = 8;
                                    case 8: return [3 /*break*/, 10];
                                    case 9:
                                        error_2 = _a.sent();
                                        console.error('Failed to parse JSON:', error_2);
                                        return [3 /*break*/, 10];
                                    case 10: return [2 /*return*/];
                                }
                            });
                        }); });
                        reloadPage = function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, page.reload()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); };
                        return [4 /*yield*/, page.goto(url)];
                    case 5:
                        _a.sent();
                        reloadInterval = setInterval(reloadPage, 1000);
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        clearInterval(reloadInterval);
                                        return [4 /*yield*/, browser.close()];
                                    case 1:
                                        _a.sent();
                                        startBrowser();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 150000);
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); };
startBrowser();
