import { BaseModel } from './BaseModel.js'

export const orderIncludes = {
  items: {
    include: {
      event: { select: { id: true, title: true, slug: true, display_date: true, thumbnail_url: true } },
    },
  },
  user: { select: { id: true, name: true, email: true } },
  refunds: true,
}

export class OrderModel extends BaseModel {
  create(data) {
    return this.prisma.order.create({ data })
  }

  createItem(data) {
    return this.prisma.orderItem.create({ data })
  }

  findFullById(id) {
    return this.prisma.order.findUnique({ where: { id: BigInt(id) }, include: orderIncludes })
  }

  listMyOrders(userId) {
    return this.prisma.order.findMany({
      where: { user_id: BigInt(userId) },
      include: orderIncludes,
      orderBy: { created_at: 'desc' },
    })
  }

  listAll() {
    return this.prisma.order.findMany({ include: orderIncludes, orderBy: { created_at: 'desc' } })
  }

  listEventIdsByCreator(userId) {
    return this.prisma.event.findMany({ where: { created_by: BigInt(userId) }, select: { id: true } })
  }

  listOrderIdsByEventIds(eventIds) {
    return this.prisma.orderItem.findMany({
      where: { event_id: { in: eventIds } },
      select: { order_id: true },
      distinct: ['order_id'],
    })
  }

  listByOrderIds(orderIds) {
    return this.prisma.order.findMany({
      where: { id: { in: orderIds } },
      include: orderIncludes,
      orderBy: { created_at: 'desc' },
    })
  }

  updateStatusByParam(param, status) {
    const isCode = param.startsWith('ORD-')
    return this.prisma.order.update({
      where: isCode ? { order_code: param } : { id: BigInt(param) },
      data: { status },
      include: orderIncludes,
    })
  }
}