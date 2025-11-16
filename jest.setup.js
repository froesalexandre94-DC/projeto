import '@testing-library/jest-dom';

// Polyfill da Fetch API para Jest
import "whatwg-fetch";

// Garante Request / Response globais
global.Request = Request;
global.Response = Response;

// Mock do Supabase
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => require("./tests/__mocks__/supabase.js").supabase)
}));
