import { agruparPorData, mediaDiaria, linearProjection } from '../lib/forecast.js';

test('agruparPorData aggregates by date', () => {
  const input = [{ date: '2025-10-01', qty: 2 }, { date: '2025-10-01', qty: 3 }, { date: '2025-10-02', qty: 5 }];
  expect(agruparPorData(input)).toEqual([{ date: '2025-10-01', qty: 5 }, { date: '2025-10-02', qty: 5 }]);
});

test('mediaDiaria returns correct average', () => {
  const input = [{ date: '2025-10-01', qty: 5 }, { date: '2025-10-02', qty: 7 }];
  expect(mediaDiaria(input)).toBe(6);
});

test('linearProjection returns projection of requested length', () => {
  const input = [{ date: '2025-10-01', qty: 1 }, { date: '2025-10-02', qty: 2 }, { date: '2025-10-03', qty: 3 }];
  const out = linearProjection(input, 5);
  expect(out.projection.length).toBe(5);
  expect(out.dailyAverage).toBeGreaterThan(0);
});
