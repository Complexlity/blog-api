import request from "supertest";
import mongoose from "mongoose";
import { connectDB, dropDB, dropCollections } from "./setupdb";
import app from "../src/app";
import UserModel from "../src/api/users/users.model";

describe("Create New User Route", () => {
  describe("POST /api/v1/users", () => {


    beforeEach(async () => {
      await connectDB()
    });

    afterEach(async () => {
      await dropDB()
    })

    it("should fail for incorrect schema", async () => {
      const user = {
        name: "John Doe",
        email: "john@example",
        password: "password",
        passwordConfirmation: "password",
      };

      const response = await request(app).post("/api/v1/users").send(user);

      expect(response.status).toBe(422);
      expect(response.body).toMatchObject({ code: "invalid_string"});
    });

    it("should create a new user", async () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        password: "password",
        passwordConfirmation: "password",
      };

      const response = await request(app).post("/api/v1/users").send(user);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        name: "John Doe",
        email: "john@example.com",
      });

      const dbUser = await UserModel.findOne({ email: "john@example.com" });
      expect(dbUser).toBeDefined();
      expect(dbUser?.name).toBe("John Doe");
      expect(dbUser?.password).not.toBe("password");
    });



    it("should return a 409 error if the email is already in use", async () => {
      await UserModel.create({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "password",
      });

      const user = {
        name: "John Doe",
        email: "jane@example.com",
        password: "password",
        passwordConfirmation: "password"
      };

      const response = await request(app).post("/api/v1/users").send(user);

      expect(response.status).toBe(409);
    });
  });
});

// Change to only work for admins
describe("Get All Users In Database", () => {
  describe("GET api/v1/users", () => {

    beforeAll(async () => {
      await connectDB()
    });

    afterAll(async () => {
      await dropDB()
    });
    it('should return an array of users without passwords', async () => {
      await UserModel.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password',
        passwordConfirmation: "password"
      });
      await UserModel.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        passwordConfirmation: "password"
      });

      const response = await request(app).get('/api/v1/users');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2)
    })
  })

})
