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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMap = createMap;
exports.findMap = findMap;
exports.UpdateMap = UpdateMap;
exports.getAll = getAll;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const db_1 = require("./db/db");
/**
 * Creates a map in the database
 * @param id the map id
 * @param map the map, will be empty when created
 * @returns the newly created map or undefined
 */
function createMap(id, map) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.connectDB)();
        const maps = db.collection("maps");
        yield maps.insertOne({
            _id: id,
            map: map
        });
        const get_map = yield maps.findOne({ _id: id, });
        if (!get_map)
            return;
        return { _id: get_map._id, map: get_map.map };
    });
}
/**
 * Finds a map in the database
 * @param id map id/name
 * @returns returns the map or undefined
 */
function findMap(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.connectDB)();
        const maps = db.collection("maps");
        const res = yield maps.findOne({ _id: id, });
        if (!res || res.map === undefined)
            return;
        return { _id: res._id, map: res.map };
    });
}
/**
 * Updates a specifik map
 * @param id map id
 * @param map map with the updates
 * @returns the updated map or undefined
 */
function UpdateMap(id, map) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.connectDB)();
        const maps = db.collection("maps");
        yield maps.updateOne({ _id: id }, { $set: { map: map } });
        const res = yield maps.findOne({ _id: id, });
        if (!res || res.map === undefined)
            return;
        return { _id: res._id, map: res.map };
    });
}
/**
 * Fetches all the maps from the database
 * @returns all the maps from the database
 */
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, db_1.connectDB)();
        const maps = db.collection("maps");
        const res = yield maps.find().toArray();
        return res;
    });
}
