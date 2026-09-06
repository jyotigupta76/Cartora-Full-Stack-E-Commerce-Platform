import type { OrderResponse } from '../services/orderService';

const STEPS: OrderResponse['status'][] = [
    'PLACED',
    'CONFIRMED',
    'SHIPPED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
];

const LABELS: Record<string, string> = {
    PLACED: 'Order Placed',
    CONFIRMED: 'Confirmed',
    SHIPPED: 'Shipped',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    DELIVERED: 'Delivered',
};

interface Props {
    status: OrderResponse['status'];
}

export default function OrderStatusTracker({ status }: Props) {
    if (status === 'CANCELLED') {
        return <p className="text-red-500 font-semibold">Order Cancelled</p>;
    }

    const currentIndex = STEPS.indexOf(status);

    return (
        <div className="space-y-2">
            {STEPS.map((step, index) => {
                const reached = index <= currentIndex;
                return (
                    <div key={step} className="flex items-center gap-2">
            <span className={reached ? 'text-green-600' : 'text-gray-300'}>
              {reached ? '✓' : '○'}
            </span>
                        <span className={reached ? 'text-gray-900 font-medium' : 'text-gray-400'}>
              {LABELS[step]}
            </span>
                    </div>
                );
            })}
        </div>
    );
}
