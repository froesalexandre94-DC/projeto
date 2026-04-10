import '@testing-library/jest-dom';

import fetch, { Headers, Request, Response } from "node-fetch";

global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => require("./tests/__mocks__/supabase.js").supabase)
}));
