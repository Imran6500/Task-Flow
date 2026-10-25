const request = require("supertest");
const app = require("../src/app");

describe("Health API", () => {
    it("returns 200 when API is running", async () => {
        const response = await request(app).get("/health");

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(
            "TaskFlow API is running"
        );
    });
});