import { BaseModel } from './BaseModel.js'

export class VoucherModel extends BaseModel {
  list() {
    return this.prisma.voucher.findMany({
      include: { event: { select: { id: true, title: true, created_by: true } } },
      orderBy: { created_at: 'desc' },
    })
  }

  listByCreator(userId) {
    return this.prisma.voucher.findMany({
      where: { event: { created_by: BigInt(userId) } },
      include: { event: { select: { id: true, title: true, created_by: true } } },
      orderBy: { created_at: 'desc' },
    })
  }

  findByCode(code) {
    return this.prisma.voucher.findUnique({
      where: { code },
      include: { event: { select: { id: true, title: true, created_by: true } } },
    })
  }

  findById(id) {
    return this.prisma.voucher.findUnique({
      where: { id: BigInt(id) },
      include: { event: { select: { id: true, title: true, created_by: true } } },
    })
  }

  findEventById(eventId) {
    return this.prisma.event.findUnique({ where: { id: BigInt(eventId) } })
  }

  findEventByIdAndCreator(eventId, userId) {
    return this.prisma.event.findFirst({
      where: { id: BigInt(eventId), created_by: BigInt(userId) },
    })
  }

  create(data) {
    return this.prisma.voucher.create({ data })
  }

  update(id, data) {
    return this.prisma.voucher.update({ where: { id: BigInt(id) }, data })
  }

  delete(id) {
    return this.prisma.voucher.delete({ where: { id: BigInt(id) } })
  }

  incrementUsage(id) {
    return this.prisma.voucher.update({
      where: { id: BigInt(id) },
      data: { used_count: { increment: 1 } },
    })
  }

  findOrderByCode(orderCode) {
    return this.prisma.order.findFirst({ where: { order_code: orderCode } })
  }

  createVoucherUsage(data) {
    return this.prisma.voucherUsage.create({ data })
  }
}
