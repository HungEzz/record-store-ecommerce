import { adminRepository } from './admin.repository';

export const adminService = {
  async getStats() {
    const usersCount = await adminRepository.countUsers();
    const productsCount = await adminRepository.countProducts();
    const ordersCount = await adminRepository.countOrders();
    const orders = await adminRepository.findCompletedOrders();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      revenue: totalRevenue,
    };
  },

  async getUsers(page?: number, limit?: number) {
    const queryOptions: any = {
      select: { id: true, email: true, fullName: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' as const },
    };

    if (page && limit) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
      const [users, total] = await Promise.all([
        adminRepository.findUsers(queryOptions),
        adminRepository.countUsers(),
      ]);
      return { data: users, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return adminRepository.findUsers(queryOptions);
  },

  updateUserRole(id: string, role: string) {
    return adminRepository.updateUserRole(id, role);
  },

  async getOrders(page?: number, limit?: number) {
    const queryOptions: any = {
      include: {
        user: { select: { fullName: true, email: true } },
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' as const },
    };

    if (page && limit) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
      const [orders, total] = await Promise.all([
        adminRepository.findOrders(queryOptions),
        adminRepository.countOrders(),
      ]);
      return { data: orders, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    return adminRepository.findOrders(queryOptions);
  },

  updateOrderStatus(id: string, status: string) {
    return adminRepository.updateOrderStatus(id, status);
  },

  deleteOrder(id: string) {
    return adminRepository.deleteOrder(id);
  },
};
