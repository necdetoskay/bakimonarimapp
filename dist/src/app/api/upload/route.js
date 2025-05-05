"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
var server_1 = require("next/server");
var next_auth_1 = require("next-auth");
var auth_1 = require("@/lib/auth");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var uuid_1 = require("uuid");
// POST: Resim yükleme
function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var session, formData, file, fileType, maxSize, uploadDir, fileExtension, fileName, filePath, buffer, imageUrl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, (0, next_auth_1.getServerSession)(auth_1.authOptions)];
                case 1:
                    session = _a.sent();
                    if (!session) {
                        return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Bu işlem için yetkiniz yok." }), { status: 401 })];
                    }
                    return [4 /*yield*/, req.formData()];
                case 2:
                    formData = _a.sent();
                    file = formData.get("file");
                    if (!file) {
                        return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Yüklenecek dosya bulunamadı." }), { status: 400 })];
                    }
                    fileType = file.type;
                    if (fileType !== "image/jpeg" && fileType !== "image/png") {
                        return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Sadece JPG ve PNG formatları desteklenmektedir." }), { status: 400 })];
                    }
                    maxSize = 5 * 1024 * 1024;
                    if (file.size > maxSize) {
                        return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Dosya boyutu 5MB'dan büyük olamaz." }), { status: 400 })];
                    }
                    uploadDir = path.join(process.cwd(), 'public', 'uploads');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    fileExtension = fileType === "image/jpeg" ? ".jpg" : ".png";
                    fileName = "".concat((0, uuid_1.v4)()).concat(fileExtension);
                    filePath = path.join(uploadDir, fileName);
                    return [4 /*yield*/, file.arrayBuffer()];
                case 3:
                    buffer = _a.sent();
                    fs.writeFileSync(filePath, Buffer.from(buffer));
                    imageUrl = "/uploads/".concat(fileName);
                    return [2 /*return*/, server_1.NextResponse.json({
                            success: true,
                            url: imageUrl,
                        })];
                case 4:
                    error_1 = _a.sent();
                    console.error("API Error:", error_1);
                    return [2 /*return*/, new server_1.NextResponse(JSON.stringify({ error: "Resim yükleme sırasında bir hata oluştu." }), { status: 500 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
