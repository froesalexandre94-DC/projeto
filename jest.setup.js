import '@testing-library/jest-dom';
jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(() => require("./tests/__mocks__/supabase.js").supabase)
}));

