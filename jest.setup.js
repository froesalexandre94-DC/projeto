import '@testing-library/jest-dom';

import fetch, { Headers, Request, Response } from "node-fetch";

global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => require("./tests/_mocks_/supabase.js").supabase)
}));
