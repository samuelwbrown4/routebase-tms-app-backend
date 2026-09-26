import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { runOrderSync } from '../../jobs/erpOrderSync.js';

// dbPool and fetchFn are injected directly into runOrderSync so these tests
// never touch a real database or make a real network call.

describe('runOrderSync', () => {
    let dbPool;
    let fetchFn;

    beforeEach(() => {
        process.env.ERP_API_URL = 'https://erp.example.com';
        process.env.ERP_API_KEY = 'test-api-key';

        dbPool = { query: vi.fn().mockResolvedValue({ rows: [] }) };
        fetchFn = vi.fn();
        vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('syncs all unsynced orders when the ERP reports success for every order', async () => {
        const unsyncedOrders = [
            { order_number: 'ORD-1', order_status: 'pending' },
            { order_number: 'ORD-2', order_status: 'pending' },
        ];

        dbPool.query.mockResolvedValueOnce({ rows: unsyncedOrders }); // SELECT

        fetchFn.mockResolvedValueOnce({
            status: 200,
            json: async () => ({ success: ['ORD-1', 'ORD-2'] }),
        });

        await runOrderSync({ dbPool, fetchFn });

        expect(fetchFn).toHaveBeenCalledWith(
            'https://erp.example.com/api/orders/sync',
            expect.objectContaining({
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'test-api-key',
                },
                body: JSON.stringify({ unsyncedOrders }),
            })
        );

        // one SELECT + one UPDATE per successfully synced order
        expect(dbPool.query).toHaveBeenCalledTimes(3);
        expect(dbPool.query).toHaveBeenNthCalledWith(
            2,
            'UPDATE orders SET synced = true WHERE order_number = $1',
            ['ORD-1']
        );
        expect(dbPool.query).toHaveBeenNthCalledWith(
            3,
            'UPDATE orders SET synced = true WHERE order_number = $1',
            ['ORD-2']
        );
    });

    it('only marks the orders the ERP accepted as synced when some orders fail', async () => {
        const unsyncedOrders = [
            { order_number: 'ORD-1', order_status: 'pending' },
            { order_number: 'ORD-2', order_status: 'pending' },
            { order_number: 'ORD-3', order_status: 'pending' },
        ];

        dbPool.query.mockResolvedValueOnce({ rows: unsyncedOrders }); // SELECT

        fetchFn.mockResolvedValueOnce({
            status: 200,
            json: async () => ({
                success: ['ORD-1', 'ORD-3'],
                failed: ['ORD-2'],
            }),
        });

        await runOrderSync({ dbPool, fetchFn });

        // one SELECT + one UPDATE per each of the two successful orders
        expect(dbPool.query).toHaveBeenCalledTimes(3);

        const updateCalls = dbPool.query.mock.calls.filter(([sql]) =>
            sql.startsWith('UPDATE')
        );
        expect(updateCalls).toHaveLength(2);
        expect(updateCalls.map(([, params]) => params[0])).toEqual([
            'ORD-1',
            'ORD-3',
        ]);
        expect(
            updateCalls.some(([, params]) => params[0] === 'ORD-2')
        ).toBe(false);
    });

    it('does not attempt any updates when there are no unsynced orders', async () => {
        dbPool.query.mockResolvedValueOnce({ rows: [] }); // SELECT

        fetchFn.mockResolvedValueOnce({
            status: 200,
            json: async () => ({ success: [] }),
        });

        await runOrderSync({ dbPool, fetchFn });

        expect(fetchFn).toHaveBeenCalledWith(
            'https://erp.example.com/api/orders/sync',
            expect.objectContaining({
                body: JSON.stringify({ unsyncedOrders: [] }),
            })
        );

        // only the initial SELECT, no UPDATE calls
        expect(dbPool.query).toHaveBeenCalledTimes(1);
    });
});
