// more on how to write tests here: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/
const request = require("supertest");
const app, { getRoomData } = require('./app')

describe("Test the server routes", () => {
  test("check the authentication route (redirect)", async () => {
    const response = await request(app).get('/auth/google');
    expect(response.statusCode).toBe(302);
  });

  test("Initialization of databases", async () => {
    const res = await request(app).get("/initDatabase");
    expect(res.type).toEqual('text/html');
    expect(res.text).toEqual('Initializing database')
  });
});

describe("Test the web sockets", () => {
  test("Check socket connection", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('connection', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close();
            })
            .on('close', () => done());
  });

  test("Web socket on changeRoom", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('changeRoom', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close();
            })
            .on('close', () => done());
  });

  test("Web socket on chat", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('chat', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close();
            })
            .on('close', () => done());
  });

  test("Web socket on move", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('move', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close();
            })
            .on('close', () => done());
  });

  test("Check socket on room", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('room', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close();
            })
            .on('close', () => done());
  });

  test("Check socket on disconnect", async () => {
    const ws = new WebSocket(`ws://localhost:5000`)
            .on('disconnect', (msg) => {
                expect(JSON.parse(msg).id).toEqual(0);
                ws.close();
            })
            .on('close', () => done());
  });
});