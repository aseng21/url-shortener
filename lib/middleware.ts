import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT = 100;
const requests = new Map();

export function middleware(req: NextRequest) {
    const ip = req.ip ?? '127.0.0.1';

    if (!requests.has(ip)) {
        requests.set(ip, { count: 1, lastRequest: Date.now() });
    } else {
        const { count, lastRequest } = requests.get(ip);
        if (count > RATE_LIMIT && Date.now() - lastRequest < 60000) {
            return new NextResponse('Too many requests', { status: 429 });
        }
        requests.set(ip, { count: count + 1, lastRequest: Date.now() });
    }

    return NextResponse.next();
}
