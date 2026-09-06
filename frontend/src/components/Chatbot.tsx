import { useState } from 'react';
import { orderService } from '../services/orderService';

interface Message {
    from: 'user' | 'bot';
    text: string;
}

const INITIAL_MESSAGE: Message = {
    from: 'bot',
    text: "Hi! I'm here to help. You can ask things like:\n- Where is my order?\n- How can I cancel my order?\n- What is your return policy?\n- How can I contact support?\n- How can I reset my password?",
};

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [awaitingOrderId, setAwaitingOrderId] = useState(false);

    const addMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);

    // Simple rule-based responses. Checks the message text against known
    // patterns/keywords - no AI/ML involved, just if/else matching.
    const getBotResponse = async (userText: string): Promise<string> => {
        const text = userText.toLowerCase();

        if (awaitingOrderId) {
            setAwaitingOrderId(false);
            const orderId = parseInt(userText.trim(), 10);
            if (isNaN(orderId)) {
                return "That doesn't look like a valid order ID. Please enter just the number, e.g. 1001.";
            }
            try {
                const order = await orderService.getOrderById(orderId);
                return `Your order #${order.id} is currently ${order.status.replace(/_/g, ' ')}.`;
            } catch {
                return `I couldn't find an order with ID ${orderId}. Please check the number and try again, or log in if you haven't.`;
            }
        }

        if (text.includes('where is my order') || text.includes('track')) {
            setAwaitingOrderId(true);
            return 'Please provide your order ID.';
        }

        if (text.includes('cancel')) {
            return 'You can cancel an order from "My Orders" > order details, as long as it hasn\'t shipped yet. Look for the "Cancel Order" button there.';
        }

        if (text.includes('return') || text.includes('refund')) {
            return 'Our return policy allows returns within 7 days of delivery for unused items in original packaging. Contact support to initiate a return.';
        }

        if (text.includes('contact') || text.includes('support') || text.includes('help')) {
            return 'You can reach our support team at support@ecommerce.example or call +91-XXXXXXXXXX (Mon-Sat, 9am-6pm).';
        }

        if (text.includes('password') || text.includes('reset')) {
            return 'Password reset isn\'t available yet in this version of the app - that\'s a planned feature. For now, please contact support if you\'re locked out.';
        }

        return "I'm not sure how to help with that yet. Try asking about your order status, cancellations, returns, or contacting support.";
    };

    const handleSend = async () => {
        const text = input.trim();
        if (!text) return;

        addMessage({ from: 'user', text });
        setInput('');

        const response = await getBotResponse(text);
        addMessage({ from: 'bot', text: response });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <>
            {/* Floating toggle button */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg text-2xl hover:bg-blue-700 z-50"
            >
                {open ? '✕' : '💬'}
            </button>

            {open && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded shadow-xl flex flex-col z-50 border">
                    <div className="bg-blue-600 text-white px-4 py-3 rounded-t font-semibold">
                        Support Chat
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`text-sm p-2 rounded max-w-[85%] whitespace-pre-line ${
                                    msg.from === 'user'
                                        ? 'bg-blue-600 text-white ml-auto'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className="p-2 border-t flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="flex-1 border rounded px-3 py-2 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
