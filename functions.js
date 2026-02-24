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
exports.createMap = createMap;
exports.reMap = reMap;
exports.findMap = findMap;
exports.UpdateMap = UpdateMap;
exports.getAll = getAll;
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var db_1 = require("../db/db");
var building_1 = require("../lib/building");
var list_1 = require("../lib/list");
function createMap(id, map) {
    return __awaiter(this, void 0, void 0, function () {
        var db, maps, get_map;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    maps = db.collection("maps");
                    return [4 /*yield*/, maps.insertOne({
                            _id: id,
                            map: map
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, maps.findOne({ _id: id, })];
                case 3:
                    get_map = _a.sent();
                    if (!get_map)
                        return [2 /*return*/];
                    return [2 /*return*/, { _id: get_map._id, map: get_map.map }];
            }
        });
    });
}
// Helper that rebuild the map
function reMap(map) {
    var newMap = (0, building_1.make_map)();
    for (var _i = 0, _a = map.nodes; _i < _a.length; _i++) {
        var node = _a[_i];
        (0, building_1.add_place)(newMap, node.name, node.floor);
    }
    var i = 0;
    while (i < map.size) {
        var name_1 = map.nodes[i].name;
        var li = map.adj[i];
        while (!(0, list_1.is_null)(li)) {
            var f = (0, list_1.head)(li);
            var name_to = map.nodes[f.to].name;
            (0, building_1.add_path)(newMap, name_1, f.type, name_to);
            li = (0, list_1.tail)(li);
        }
        i++;
    }
    return newMap;
}
function findMap(id) {
    return __awaiter(this, void 0, void 0, function () {
        var db, maps, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    maps = db.collection("maps");
                    return [4 /*yield*/, maps.findOne({ _id: id, })];
                case 2:
                    res = _a.sent();
                    if (!res || res.map === undefined)
                        return [2 /*return*/];
                    return [2 /*return*/, { _id: res._id, map: res.map }];
            }
        });
    });
}
function UpdateMap(id, map) {
    return __awaiter(this, void 0, void 0, function () {
        var db, maps, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    maps = db.collection("maps");
                    return [4 /*yield*/, maps.updateOne({ _id: id }, { $set: { map: map } })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, maps.findOne({ _id: id, })];
                case 3:
                    res = _a.sent();
                    if (!res || res.map === undefined)
                        return [2 /*return*/];
                    return [2 /*return*/, { _id: res._id, map: res.map }];
            }
        });
    });
}
function getAll() {
    return __awaiter(this, void 0, void 0, function () {
        var db, maps, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, db_1.connectDB)()];
                case 1:
                    db = _a.sent();
                    maps = db.collection("maps");
                    return [4 /*yield*/, maps.find().toArray()];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
// export const map = make_map();
// // ---------- FLOOR 1 ----------
// add_place(map, "Entrance", 1);      //0
// add_place(map, "Reception", 1);     //1
// add_place(map, "Library", 1);       //2
// add_place(map, "Café", 1);          //3
// add_place(map, "HallA", 1);         //4
// add_place(map, "Stairs1", 1);       //5
// add_place(map, "Elevator1", 1);     //6
// // ---------- FLOOR 2 ----------
// add_place(map, "HallB", 2);         //7
// add_place(map, "ComputerLab", 2);   //8
// add_place(map, "StudyRoom", 2);     //9
// add_place(map, "Lounge", 2);        //10
// add_place(map, "Stairs2", 2);       //11
// add_place(map, "Elevator2", 2);     //12
// // ---------- FLOOR 3 ----------
// add_place(map, "HallC", 3);         //13
// add_place(map, "OfficeA", 3);       //14
// add_place(map, "OfficeB", 3);       //15
// add_place(map, "ConferenceRoom", 3);//16
// add_place(map, "Stairs3", 3);       //17
// add_place(map, "Elevator3", 3);     //18
// add_path(map,"Entrance",'hallway_S',"Reception");
// add_path(map,"Reception","hallway_L","HallA");
// add_path(map,"HallA","hallway_S","Library");
// add_path(map,"HallA","hallway_L","Café");
// add_path(map,"HallA","hallway_L","Stairs1");
// add_path(map,"HallA","hallway_S","Elevator1");
// add_path(map,"HallB","hallway_L","ComputerLab");
// add_path(map,"HallB","hallway_S","StudyRoom");
// add_path(map,"HallB","hallway_L","Lounge");
// add_path(map,"HallC","hallway_S","OfficeA");
// add_path(map,"HallC","hallway_L","OfficeB");
// add_path(map,"HallC","hallway_L","ConferenceRoom");
// add_path(map,"HallC","hallway_L","Elevator3");
// add_path(map,"Stairs1","stairs","Stairs2");
// add_path(map,"Stairs2","stairs","Stairs3");
// add_path(map,"Elevator1","elevator","Elevator2");
// add_path(map,"Elevator2","elevator","Elevator3");
// add_path(map,"Stairs2","hallway_L","HallB");
// add_path(map,"Elevator2","hallway_L","HallB");
// add_path(map,"Stairs3","hallway_S","HallC");
// UpdateMap('building 5', map);
