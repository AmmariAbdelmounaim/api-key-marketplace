import 'whatwg-fetch'

// Mock cookies implementation
class MockCookies {
  private cookies: Map<string, string> = new Map();

  get(name: string) {
    return this.cookies.has(name) ? { value: this.cookies.get(name) } : undefined;
  }

  set(name: string, value: string, options?: any) {
    this.cookies.set(name, value);
  }

  delete(name: string) {
    this.cookies.delete(name);
  }
}

// Mock NextResponse
class MockNextResponse extends Response {
  public cookies: MockCookies;

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, init);
    this.cookies = new MockCookies();
  }

  static json(body: any, init?: ResponseInit) {
    const response = new MockNextResponse(JSON.stringify(body), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers || {})
      }
    });
    return response;
  }
}

// Mock NextRequest
class MockNextRequest extends Request {
  public cookies: MockCookies;

  constructor(input: RequestInfo | URL, init?: RequestInit) {
    super(input, init);
    this.cookies = new MockCookies();
  }
}

// Setup global mocks
global.Request = Request;
global.Response = Response;
global.Headers = Headers;

// Mock Next.js Response and Request
jest.mock('next/server', () => ({
  NextResponse: MockNextResponse,
  NextRequest: MockNextRequest
}));

// Mock ethers verifyMessage
jest.mock("ethers", () => ({
  verifyMessage: (message: string, signature: string) => {
    // For testing, return the expected wallet address if signature contains "valid"
    if (signature.includes("valid")) {
      return "0xabc";
    }
    throw new Error("Invalid signature");
  }
}));

// Mock environment variables
process.env.JWT_SECRET = 'test_secret';

// Add any other global test setup here