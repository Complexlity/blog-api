import request from "supertest";
import mongoose from "mongoose";
import { connectDB, dropDB, dropCollections } from './setupdb'
import app from "../src/app";
import SessionModel from '../src/api/sessions/sessions.model'
import UserModel from '../src/api/users/users.model'


const testUser1 = {
      id: new mongoose.Types.ObjectId(),
      name: "John Doe",
      email: "john@example.com",
      password: "password",
    }

const testUser2 = {
  id: new mongoose.Types.ObjectId(),
  name: "Jame Doe",
  email: "jane@example.com",
  password: "password",
};

const testSession1 = {
  user: new mongoose.Types.ObjectId(),
  valid: true,
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
}

const testSession2 = {
  user: new mongoose.Types.ObjectId(),
  valid: true,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
};
const testSession3 = {
  user: new mongoose.Types.ObjectId(),
  valid: true,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
};


// describe("Create new session route", () => {
//   describe("POST /api/v1/sessions", () => {
//     beforeAll(async () => {
//       await connectDB();
//     });

//     afterAll(async () => {
//       await dropDB();
//     });
//     afterEach(async () => {
//       await dropCollections();
//     });

//     it("should create a new session and return access and refresh tokens", async () => {
//       await UserModel.create(testUser1);
//       request(app)
//         .post("/api/v1/sessions")
//         .send({
//           email: testUser1.name,
//           password: testUser1.password,
//         })
//         .expect(200);
//     });

//     it("should return 401 for invalid credentials", (done) => {
//       request(app)
//         .post("/api/v1/sessions")
//         .send({
//           email: testUser1.email,
//           password: "wrongpassword",
//         })
//         .expect(
//           401,
//           {
//             message: "Invalid credentials",
//           },
//           done
//         );
//     });

//   });
// });

describe("Get all current sessions", () => {
  describe("GET /api/v1/sessions/all", () => {
    beforeAll(async () => {
      await connectDB()
    });

    afterAll(async () => {
      await dropDB()
    });

    it("should return list of all current sessions", async () => {
      await SessionModel.create(testSession1);
      await SessionModel.create(testSession2);
      await SessionModel.create(testSession3);
      request(app)
        .get("api/v1/sessions/all")
        .set('Accept', 'application/json')
        .expect(400)

    });
  })
})
