import { NextRequest, NextResponse } from "next/server";
import { POST as loginPOST } from "@/app/api/login/route";
import { GET as verifyGET } from "@/app/api/verify/route";
import { GET as sessionGET } from "@/app/api/session/route";
import { POST as noncePOST } from "@/app/api/nonce/route";
import { POST as logoutPOST } from "@/app/api/logout/route";
import jwt from "jsonwebtoken";
import { verifyMessage } from "ethers";
import * as usersModule from "@/data/users";

// Mock external calls to Supabase or database functions used in the nonce and login routes.
jest.mock("@/data/users", () => ({
  getUserByWalletAddressAndNonce: jest.fn(),
  getUserByWalletAddress: jest.fn(),
  updateUserNonce: jest.fn(),
  createUser: jest.fn(),
}));

// ----- Set up the test environment ----- 
describe("API Routes", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "testsecret";
  });

  describe("/api/login", () => {
    test("returns 401 for invalid signature", async () => {
      const req = new NextRequest("http://localhost/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: "0xabc",
          nonce: "nonce123",
          signature: "invalid_signature",
        }),
      });
      const response = await loginPOST(req);
      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.success).toBe(false);
    });

    test("returns 401 if user not found", async () => {
      // Simulate that no user was found in the database
      (usersModule.getUserByWalletAddressAndNonce as jest.Mock).mockResolvedValue(null);

      const req = new NextRequest("http://localhost/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: "0xabc",
          nonce: "nonce123",
          signature: "validsignature",
        }),
      });
      const response = await loginPOST(req);
      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.success).toBe(false);
    });

    test("returns 200 and sets cookie on successful login", async () => {
      // Mock successful user lookup
      (usersModule.getUserByWalletAddressAndNonce as jest.Mock).mockResolvedValue({
        id: "user1",
        wallet_address: "0xabc",
        role: "user"
      });

      const req = new NextRequest("http://localhost/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: "0xabc",
          nonce: "nonce123",
          signature: "valid_signature",
        }),
      });

      const response = await loginPOST(req);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.success).toBe(true);

      // Check that the token cookie is set on the response
      const tokenCookie = response.cookies.get("token");
      expect(tokenCookie).toBeDefined();

      // Verify the JWT token was correctly signed
      const decoded = jwt.verify(tokenCookie?.value!, process.env.JWT_SECRET!);
      expect(decoded).toMatchObject({
        id: "user1",
        walletAddress: "0xabc",
        role: "user",
      });
    });
  });

  describe("/api/verify", () => {
    test("returns 401 if no token provided", async () => {
      const req = new NextRequest("http://localhost/api/verify");
      const response = await verifyGET(req);
      expect(response.status).toBe(401);
    });

    test("returns success with a valid token", async () => {
      // Create a valid JWT token
      const validToken = jwt.sign(
        { id: 'user1', walletAddress: '0xabc' },
        process.env.JWT_SECRET!
      );

      const req = new NextRequest("http://localhost/api/verify");
      // Set the token in cookies
      req.cookies.set('token', validToken);
      
      const response = await verifyGET(req);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });

    test("returns 401 with an invalid token", async () => {
      const req = new NextRequest("http://localhost/api/verify");
      req.cookies.set('token', 'invalid-token');
      
      const response = await verifyGET(req);
      expect(response.status).toBe(401);
    });
  });

  describe("/api/session", () => {
    test("returns 401 if no token provided", async () => {
      const req = {
        cookies: new Map(),
      } as any;
      const response = await sessionGET(req);
      expect(response.status).toBe(401);
      const json = await response.json();
      expect(json.session).toBeNull();
    });

    test("returns session data with a valid token", async () => {
      const token = jwt.sign(
        { id: "user1", walletAddress: "0xabc", role: "BUYER" },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );
      const req = {
        cookies: new Map([["token", { value: token }]]),
      } as any;
      const response = await sessionGET(req);
      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json.session).toMatchObject({
        id: "user1",
        walletAddress: "0xabc",
        role: "BUYER",
      });
    });
  });

  describe("/api/nonce", () => {
    // Helper function to create a new POST Request
    const createNonceRequest = (body: any) =>
      new NextRequest("http://localhost/api/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

    test("returns 400 if walletAddress is missing", async () => {
      const req = createNonceRequest({});
      const res = await noncePOST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toBe("walletAddress is required");
    });

    test("updates user nonce if user exists", async () => {
      // Simulate that a user record was found
      (usersModule.getUserByWalletAddress as jest.Mock).mockResolvedValue([{ nonce: "oldNonce" }]);
      (usersModule.updateUserNonce as jest.Mock).mockResolvedValue({ nonce: "newNonce" });

      const req = createNonceRequest({ walletAddress: "0xabc" });
      const res = await noncePOST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.nonce).toBe("newNonce");
    });

    test("creates a new user if none exists", async () => {
      (usersModule.getUserByWalletAddress as jest.Mock).mockResolvedValue([]);
      (usersModule.createUser as jest.Mock).mockResolvedValue({ nonce: "createdNonce" });

      const req = createNonceRequest({ walletAddress: "0xdef" });
      const res = await noncePOST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.nonce).toBe("createdNonce");
    });
  });

  describe("/api/logout", () => {
    test("deletes the token cookie and returns success", async () => {
      const res = await logoutPOST();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      // Since the logout route deletes the cookie, the token should no longer be present.
      const tokenCookie = res.cookies.get("token");
      expect(tokenCookie).toBeUndefined();
    });
  });
}); 