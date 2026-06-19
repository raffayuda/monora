import { BaseModel } from './BaseModel.js'

const includeRelation = {
  order: true,
  event: { select: { id: true, title: true, created_by: true } },
  order_item: {
    select: {
      id: true,
      title: true,
      quantity: true,
      unit_price: true,
      item_type: true,
      event_id: true,
      event: { select: { id: true, title: true, created_by: true } },
    },
  },
  user: { select: { id: true, name: true, email: true } },
}

export class RefundModel extends BaseModel {
  findOrderByCodeAndUser(orderCode, userId) {
    return this.prisma.order.findFirst({ where: { order_code: orderCode, user_id: BigInt(userId) } })
  }

  findByOrderId(orderId) {
    return this.prisma.refund.findFirst({ where: { order_id: BigInt(orderId) } })
  }

  findOrderWithItemsByCodeAndUser(orderCode, userId) {
    return this.prisma.order.findFirst({
      where: { order_code: orderCode, user_id: BigInt(userId) },
      include: { items: true },
    })
  }

  findOrderItemByIdAndOrder(itemId, orderId) {
    return this.prisma.orderItem.findFirst({
      where: { id: BigInt(itemId), order_id: BigInt(orderId) },
    })
  }

  findExistingItemRefund(orderItemId) {
    return this.prisma.refund.findFirst({
      where: {
        order_item_id: BigInt(orderItemId),
        status: { in: ['pending', 'approved'] },
      },
    })
  }

  create(data) {
    return this.prisma.refund.create({ data, include: includeRelation })
  }

  listAll() {
    return this.prisma.refund.findMany({ include: includeRelation, orderBy: { requested_at: 'desc' } })
  }

  listEventIdsByCreator(userId) {
    return this.prisma.event.findMany({ where: { created_by: BigInt(userId) }, select: { id: true } })
  }

  listByEventIds(eventIds) {
    return this.prisma.refund.findMany({
      where: { event_id: { in: eventIds } },
      include: includeRelation,
      orderBy: { requested_at: 'desc' },
    })
  }

  listByUser(userId) {
    return this.prisma.refund.findMany({
      where: { user_id: BigInt(userId) },
      include: includeRelation,
      orderBy: { requested_at: 'desc' },
    })
  }

  findOrderByCode(orderCode) {
    return this.prisma.order.findFirst({ where: { order_code: orderCode } })
  }

  findByOrderIdWithRelations(orderId) {
    return this.prisma.refund.findMany({ where: { order_id: BigInt(orderId) }, include: includeRelation, orderBy: { requested_at: 'desc' } })
  }

  findByRefundCode(refundCode) {
    return this.prisma.refund.findFirst({ where: { refund_code: refundCode }, include: includeRelation })
  }

  updateById(id, data) {
    return this.prisma.refund.update({ where: { id: BigInt(id) }, data, include: includeRelation })
  }

  updateOrderStatus(orderId, status) {
    return this.prisma.order.update({ where: { id: BigInt(orderId) }, data: { status } })
  }

  countOrderItems(orderId) {
    return this.prisma.orderItem.count({ where: { order_id: BigInt(orderId) } })
  }

  countApprovedRefundItems(orderId) {
    return this.prisma.refund.count({
      where: {
        order_id: BigInt(orderId),
        status: 'approved',
        order_item_id: { not: null },
      },
    })
  }
}
