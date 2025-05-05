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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.POST = POST;
var server_1 = require("next/server");
var bcrypt_1 = __importDefault(require("bcrypt"));
var db_1 = require("@/lib/db");
function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, name_1, email, password, existingUser, userRole, hashedPassword, newUser, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    console.log("Register API: Request received");
                    return [4 /*yield*/, request.json()];
                case 1:
                    _a = _b.sent(), name_1 = _a.name, email = _a.email, password = _a.password;
                    console.log("Register API: Request body parsed");
                    // Basit validasyon
                    if (!name_1 || !email || !password) {
                        console.log("Register API: Validation failed - missing fields");
                        return [2 /*return*/, server_1.NextResponse.json({ message: "İsim, email ve şifre gereklidir" }, { status: 400 })];
                    }
                    return [4 /*yield*/, db_1.db.user.findUnique({
                            where: { email: email },
                        })];
                case 2:
                    existingUser = _b.sent();
                    if (existingUser) {
                        return [2 /*return*/, server_1.NextResponse.json({ message: "Bu email adresi zaten kullanımda" }, { status: 400 })];
                    }
                    return [4 /*yield*/, db_1.db.role.findUnique({
                            where: { name: "user" },
                        })];
                case 3:
                    userRole = _b.sent();
                    if (!!userRole) return [3 /*break*/, 5];
                    return [4 /*yield*/, db_1.db.role.create({
                            data: {
                                name: "user",
                                description: "Standart kullanıcı rolü"
                            },
                        })];
                case 4:
                    userRole = _b.sent();
                    console.log("User rolü otomatik olarak oluşturuldu:", userRole.id);
                    _b.label = 5;
                case 5: return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                case 6:
                    hashedPassword = _b.sent();
                    return [4 /*yield*/, db_1.db.user.create({
                            data: {
                                name: name_1,
                                email: email,
                                password: hashedPassword,
                                roleId: userRole.id,
                            },
                        })];
                case 7:
                    newUser = _b.sent();
                    // Hassas bilgiler olmadan kullanıcıyı döndür
                    return [2 /*return*/, server_1.NextResponse.json({
                            id: newUser.id,
                            name: newUser.name,
                            email: newUser.email,
                        }, { status: 201 })];
                case 8:
                    error_1 = _b.sent();
                    console.error("Kayıt hatası:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ message: "Kullanıcı oluşturulurken bir hata oluştu", error: error_1.message }, { status: 500 })];
                case 9: return [2 /*return*/];
            }
        });
    });
}
