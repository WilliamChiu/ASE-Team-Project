// more on how to write tests here: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
const request = require("supertest");
const app = require('./app')
const WebSocket = require('ws')

describe("Test the server routes", () => {
  test("It should response the GET method", async () => {
    const response = await request(app).get('/auth/google');
    expect(response.statusCode).toBe(302);
  });

  test("Initialization of databases", async () => {
    const res = await request(app).get("/initDatabase");
    //expect(res.type).toEqual('text/html');
    //expect(res.text).toEqual('Initializing database')
    expect(res.statusCode).toBe(200);
  }, 30000);
});

describe("Test the web sockets", () => {
  test("It should response the GET method", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
    ws.on('message', (msg) => {
        expect(JSON.parse(msg).id).toEqual(0);
        ws.close();
    })
    ws.on('close', () => done());
  });

  test("Initialization of databases", async () => {
    const res = await request(app).get("/initDatabase");
    //expect(res.type).toEqual('text/html');
    //expect(res.text).toEqual('Initializing database')
    expect(res.statusCode).toBe(200);
  }, 30000);
});