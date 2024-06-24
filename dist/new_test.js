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
var puppeteer_1 = __importDefault(require("puppeteer"));
var axios_1 = __importDefault(require("axios"));
var web3_js_1 = require("@solana/web3.js");
var grammy_1 = require("grammy");
var api_1 = require("./api");
var express_1 = __importDefault(require("express"));
var url_endpoint = 'https://frontend-api.pump.fun/trades/latest';
var connection = new web3_js_1.Connection('https://api.mainnet-beta.solana.com');
var bot_token = "7351592175:AAHRKoYsnrMIEKM_qbw4BTFc6UCiajZl0TQ";
var bot = new grammy_1.Bot(bot_token);
var channel_id = '-1002214628234';
var current_latest = '';
var isRateLimited = false;
var retryAfter = 1500; // Default retry time
var arr_sent = [];
var app = (0, express_1.default)();
var createTelegramMessage = function (data) {
    // Initialize an array to hold the formatted lines
    var messageLines = '';
    // Initialize a temporary array to collect groups of three entries
    var topten = 0;
    var Bonding_curve = 0;
    // Iterate over the data array
    data.forEach(function (entry, index) {
        // Format the percentage and create the link
        var percentage = entry.percentage.toFixed(2) + '%';
        var link = "[".concat(percentage, "](https://pump.fun/profile/").concat(entry.address, ")");
        // Every three entries, join them into a single line and push to messageLines
        if ((index + 1) < 11) {
            topten += entry.percentage;
            if ((index + 1) % 4 === 0 && index !== 1) {
                if (entry.name !== undefined) {
                    if (entry.name === 'Dev') {
                        messageLines += link + '(Dev) |\n';
                    }
                    else if (entry.name === 'Bonding Curve') {
                        Bonding_curve = entry.percentage;
                    }
                }
                else {
                    messageLines += link + ' |\n';
                }
            }
            else {
                if (entry.name !== undefined) {
                    if (entry.name === 'Dev') {
                        messageLines += link + '(Dev) |';
                    }
                    else if (entry.name === 'Bonding Curve') {
                        Bonding_curve += entry.percentage;
                    }
                }
                else {
                    messageLines += link + ' |';
                }
            }
        }
        else {
            if ((index + 1) % 4 === 0 && (index + 1) !== 1) {
                if (entry.name !== undefined) {
                    if (entry.name === 'Dev') {
                        messageLines += link + '(Dev) |\n';
                    }
                    else if (entry.name === 'Bonding Curve') {
                        Bonding_curve = entry.percentage;
                    }
                }
                else {
                    messageLines += link + ' |\n';
                }
            }
            else {
                if (entry.name !== undefined) {
                    if (entry.name === 'Dev') {
                        messageLines += link + '(Dev) |';
                    }
                    else if (entry.name === 'Bonding Curve') {
                        Bonding_curve += entry.percentage;
                    }
                }
                else {
                    messageLines += link + '|';
                }
            }
        }
    });
    // Join all lines into a single message string
    return [messageLines.replace('|', '\|'), topten, Bonding_curve];
};
function getBalance(walletAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var balance, solBalance, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, connection.getBalance(walletAddress)];
                case 1:
                    balance = _a.sent();
                    solBalance = balance / 1000000000;
                    return [2 /*return*/, solBalance.toFixed(4)];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching balance:", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function formatTimeElapsed(currentTimeInSeconds, previousTimeInSeconds) {
    var elapsedTime = currentTimeInSeconds - previousTimeInSeconds;
    var hours = Math.floor(elapsedTime / 3600);
    var minutes = Math.floor((elapsedTime % 3600) / 60);
    var seconds = Math.floor(elapsedTime % 60);
    var formattedTime = hours + "hr " + minutes + "min " + seconds + "sec";
    return formattedTime;
}
var sendtoTg = function (data, holders_data) { return __awaiter(void 0, void 0, void 0, function () {
    var launch, perce, balance, now, formattedDate, formattedTime, tis, time_five_min, time_one_hr, time_six_hr, time_tf_hr, message;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, api_1.getCoinData)(data.mint)];
            case 1:
                launch = _a.sent();
                perce = '';
                return [4 /*yield*/, getBalance(new web3_js_1.PublicKey(data.user))];
            case 2:
                balance = _a.sent();
                if (holders_data !== null) {
                    perce = createTelegramMessage(holders_data);
                }
                now = new Date();
                formattedDate = now.toLocaleDateString();
                formattedTime = now.toLocaleTimeString();
                tis = Date.now() / 1000;
                time_five_min = arr_sent.filter(function (buy) {
                    if (buy.address === data.mint && (Number(tis) - buy.time) < 300) {
                        return true;
                    }
                });
                time_one_hr = arr_sent.filter(function (buy) {
                    if (buy.address === data.mint && (Number(tis) - buy.time) < 3600) {
                        return true;
                    }
                });
                time_six_hr = arr_sent.filter(function (buy) {
                    if (buy.address === data.mint && (Number(tis) - buy.time) < 3600 * 6) {
                        return true;
                    }
                });
                time_tf_hr = arr_sent.filter(function (buy) {
                    if (buy.address === data.mint && (Number(tis) - buy.time) < 3600 * 24) {
                        return true;
                    }
                });
                arr_sent.push({ address: data.mint, time: tis });
                message = "\uD83C\uDF1F\uD83D\uDC8A FRESH WALLET BUY Detected \uD83D\uDC8A\uD83C\uDF1F\n\n\uD83C\uDFF7 *".concat(launch.name, " (").concat(launch.symbol, "-sol)*\n`").concat(launch.mint, "`\n\n[").concat(data.user.substring(0, 7), "](https://pump.fun/profile/").concat(data.user, ") *BOUGHT ").concat(data.sol_amount / 1000000000, " SOL*\nuser wallet balance: ").concat((balance - Number((data.sol_amount / 1000000000).toFixed(4))).toFixed(2), " sol\n\nFresh Wallet Stats:\n5min: ").concat(time_five_min.length + 1, " 1h: ").concat(time_one_hr.length + 1, " 6h: ").concat(time_six_hr.length + 1, "  24h: ").concat(time_tf_hr.length + 1, "\n\n\uD83D\uDD0D*Creator:* [").concat(launch.creator.substring(0, 7), "](https://pump.fun/profile/").concat(launch.creator, ")\n\uD83D\uDCB0 *Market cap:* $").concat(Math.floor(launch.usd_market_cap), "\n\n*Telegram:* ").concat(launch.telegram !== null ? launch.telegram : 'Not found', "\n*Twitter:* ").concat(launch.twitter !== null ? launch.twitter : 'Not found', "\n*Website:* ").concat(launch.website !== null ? launch.website : 'Not found', "\n\nBonding Curve: ").concat(Math.floor(perce[2]), "% | Top 10 holds: ").concat(Math.floor(perce[1]), "%\n\n").concat(perce[0], "\n\n\u23F2 time elapsed :").concat(formatTimeElapsed(tis, (launch.created_timestamp / 1000)), "\n\n[pumpfun |](https://pump.fun/").concat(launch.mint, ") [Photon |](https://photon-sol.tinyastro.io/en/lp/").concat(launch.mint, "?handle=413366f37f1bc7eef9bd0) [Bonk |](https://t.me/bonkbot_bot?start=ref_p8tvh_ca_").concat(launch.mint, ")\n");
                return [4 /*yield*/, bot.api.sendMessage(channel_id, message, { parse_mode: "Markdown", reply_parameters: { message_id: 191 } })];
            case 3:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var start = function (latest) { return __awaiter(void 0, void 0, void 0, function () {
    var transactions, endpoint_holders, holders_data, error_2, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 10, , 11]);
                if (!(latest !== current_latest)) return [3 /*break*/, 8];
                current_latest = latest;
                console.log(current_latest.user, current_latest.token_amount, latest.user, latest.token_amount);
                if (!(latest.is_buy && (latest.sol_amount / 1000000000) > 2)) return [3 /*break*/, 7];
                return [4 /*yield*/, connection.getConfirmedSignaturesForAddress2(new web3_js_1.PublicKey(latest.user))];
            case 1:
                transactions = _a.sent();
                console.log(transactions.length, '\n');
                if (!(transactions.length < 4)) return [3 /*break*/, 7];
                endpoint_holders = "https://europe-west1-cryptos-tools.cloudfunctions.net/get-bubble-graph-data?token=".concat(latest.mint, "&chain=sol&pumpfun=true");
                _a.label = 2;
            case 2:
                _a.trys.push([2, 5, , 7]);
                return [4 /*yield*/, axios_1.default.get(endpoint_holders)];
            case 3:
                holders_data = _a.sent();
                return [4 /*yield*/, sendtoTg(latest, holders_data.data.nodes)];
            case 4:
                _a.sent();
                return [3 /*break*/, 7];
            case 5:
                error_2 = _a.sent();
                return [4 /*yield*/, sendtoTg(latest, null)];
            case 6:
                _a.sent();
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                console.log('seen', '\n');
                _a.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_3 = _a.sent();
                console.error(error_3);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
function listenForWSMessages() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, f12, amount, handleWebSocketFrameReceived;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_1.default.launch()];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.pages()];
                case 2:
                    page = (_a.sent())[0];
                    return [4 /*yield*/, page.target().createCDPSession()];
                case 3:
                    f12 = _a.sent();
                    return [4 /*yield*/, f12.send('Network.enable')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, f12.send('Page.enable')];
                case 5:
                    _a.sent();
                    amount = 0;
                    handleWebSocketFrameReceived = function (params) { return __awaiter(_this, void 0, void 0, function () {
                        var payloadData, jsonData, error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    amount += 1;
                                    if (!(amount > 3)) return [3 /*break*/, 2];
                                    payloadData = params.response.payloadData;
                                    jsonData = JSON.parse(payloadData.substring(2));
                                    return [4 /*yield*/, start(jsonData[1])];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [3 /*break*/, 4];
                                case 3:
                                    error_4 = _a.sent();
                                    console.log(error_4);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    // Listen for WebSocket frames
                    f12.on('Network.webSocketFrameReceived', handleWebSocketFrameReceived);
                    // Navigate to the target site (or trigger action that opens the websocket)
                    return [4 /*yield*/, page.goto('https://www.pump.fun')];
                case 6:
                    // Navigate to the target site (or trigger action that opens the websocket)
                    _a.sent(); // Replace with the actual site URL
                    // Wait for some time to allow messages to arrive (adjust as needed)
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                case 7:
                    // Wait for some time to allow messages to arrive (adjust as needed)
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
app.get('/trigger-websocket', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, listenForWSMessages()];
            case 1:
                _a.sent();
                res.send('WebSocket listening triggered successfully!');
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error(error_5);
                res.status(500).send('Error triggering WebSocket listening');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
