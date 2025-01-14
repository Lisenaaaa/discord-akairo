"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TestClient_1 = __importDefault(require("./struct/TestClient"));
const client = new TestClient_1.default();
const auth_json_1 = require("./auth.json");
client.start(auth_json_1.token);
process.on("unhandledRejection", err => console.error(err)); // eslint-disable-line no-console
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm90LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9ib3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxxRUFBNkM7QUFDN0MsTUFBTSxNQUFNLEdBQUcsSUFBSSxvQkFBVSxFQUFFLENBQUM7QUFFaEMsMkNBQW9DO0FBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsaUJBQUssQ0FBQyxDQUFDO0FBRXBCLE9BQU8sQ0FBQyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQ0FBaUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVGVzdENsaWVudCBmcm9tIFwiLi9zdHJ1Y3QvVGVzdENsaWVudFwiO1xuY29uc3QgY2xpZW50ID0gbmV3IFRlc3RDbGllbnQoKTtcblxuaW1wb3J0IHsgdG9rZW4gfSBmcm9tIFwiLi9hdXRoLmpzb25cIjtcbmNsaWVudC5zdGFydCh0b2tlbik7XG5cbnByb2Nlc3Mub24oXCJ1bmhhbmRsZWRSZWplY3Rpb25cIiwgZXJyID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuIl19