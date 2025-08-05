export const mockData = {
    users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', joinDate: '2024-01-15' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', joinDate: '2024-02-10' },
        { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Moderator', status: 'Inactive', joinDate: '2024-01-20' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active', joinDate: '2024-03-05' },
    ],
    products: [
        { id: 1, name: 'Laptop Pro', price: 1299, category: 'Electronics', stock: 25, rating: 4.5 },
        { id: 2, name: 'Wireless Mouse', price: 29.99, category: 'Accessories', stock: 150, rating: 4.2 },
        { id: 3, name: 'Gaming Keyboard', price: 89.99, category: 'Accessories', stock: 75, rating: 4.8 },
        { id: 4, name: 'Monitor 4K', price: 399.99, category: 'Electronics', stock: 12, rating: 4.6 },
    ],
    orders: [
        { id: 1001, customer: 'John Doe', total: 1299, status: 'Delivered', date: '2024-07-10' },
        { id: 1002, customer: 'Jane Smith', total: 89.99, status: 'Processing', date: '2024-07-12' },
        { id: 1003, customer: 'Bob Wilson', total: 429.98, status: 'Shipped', date: '2024-07-11' },
        { id: 1004, customer: 'Alice Brown', total: 29.99, status: 'Pending', date: '2024-07-13' },
    ],
    analytics: [
        { month: 'Jan', sales: 4000, users: 2400, revenue: 48000 },
        { month: 'Feb', sales: 3000, users: 1398, revenue: 42000 },
        { month: 'Mar', sales: 2000, users: 9800, revenue: 35000 },
        { month: 'Apr', sales: 2780, users: 3908, revenue: 52000 },
        { month: 'May', sales: 1890, users: 4800, revenue: 38000 },
        { month: 'Jun', sales: 2390, users: 3800, revenue: 45000 },
    ]
};
