import { prisma } from '../../config/prisma';

export const adminRepository = {
  countUsers: () => prisma.user.count(),
  countProducts: () => prisma.product.count(),
  countOrders: () => prisma.order.count(),
  findCompletedOrders: () => prisma.order.findMany({ where: { status: 'COMPLETED' } }),
  findUsers: (queryOptions: any) => prisma.user.findMany(queryOptions),
  updateUserRole: (id: string, role: string) =>
    prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true },
    }),
  findOrders: (queryOptions: any) => prisma.order.findMany(queryOptions),
  updateOrderStatus: (id: string, status: string) =>
    prisma.order.update({
      where: { id },
      data: { status },
    }),
  findOrderById: (id: string) =>
    prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        orderItems: { include: { product: true } },
      },
    }),
  deleteOrder: (id: string) =>
    prisma.order.delete({
      where: { id },
    }),
};
