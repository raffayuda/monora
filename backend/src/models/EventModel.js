import { BaseModel } from './BaseModel.js'

export const eventIncludes = {
  category: true,
  creator: { select: { id: true, name: true, email: true } },
  event_tags: { include: { tag: true } },
  ticket_types: true,
  merchandise: { include: { sizes: true, colors: true } },
  discounts: { where: { is_active: true } },
}

export class EventModel extends BaseModel {
  listPublished() {
    return this.prisma.event.findMany({
      where: { status: 'published' },
      include: eventIncludes,
      orderBy: { full_date: 'asc' },
    })
  }

  listForAdmin(userId, role) {
    const where = role === 'app_admin' ? {} : { created_by: BigInt(userId) }
    return this.prisma.event.findMany({
      where,
      include: eventIncludes,
      orderBy: { created_at: 'desc' },
    })
  }

  listAllForAppAdmin() {
    return this.prisma.event.findMany({
      include: eventIncludes,
      orderBy: { created_at: 'desc' },
    })
  }

  findByIdOrSlug(idOrSlug) {
    const isNumeric = /^\d+$/.test(idOrSlug)
    return this.prisma.event.findFirst({
      where: isNumeric ? { id: BigInt(idOrSlug) } : { slug: idOrSlug },
      include: eventIncludes,
    })
  }

  findById(id) {
    return this.prisma.event.findUnique({ where: { id: BigInt(id) } })
  }

  create(data) {
    return this.prisma.event.create({ data })
  }

  update(id, data) {
    return this.prisma.event.update({ where: { id: BigInt(id) }, data })
  }

  delete(id) {
    return this.prisma.event.delete({ where: { id: BigInt(id) } })
  }

  findFullById(id) {
    return this.prisma.event.findUnique({
      where: { id: BigInt(id) },
      include: eventIncludes,
    })
  }

  upsertTag(name) {
    return this.prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
  }

  addEventTag(eventId, tagId) {
    return this.prisma.eventTag.create({
      data: { event_id: BigInt(eventId), tag_id: BigInt(tagId) },
    })
  }

  clearEventTags(eventId) {
    return this.prisma.eventTag.deleteMany({ where: { event_id: BigInt(eventId) } })
  }

  createTicketTypes(items) {
    return this.prisma.ticketType.createMany({ data: items })
  }

  clearTicketTypes(eventId) {
    return this.prisma.ticketType.deleteMany({ where: { event_id: BigInt(eventId) } })
  }

  createMerchandise(data) {
    return this.prisma.merchandise.create({ data })
  }

  clearMerchandise(eventId) {
    return this.prisma.merchandise.deleteMany({ where: { event_id: BigInt(eventId) } })
  }

  createMerchandiseSizes(items) {
    return this.prisma.merchandiseSize.createMany({ data: items })
  }

  createMerchandiseColors(items) {
    return this.prisma.merchandiseColor.createMany({ data: items })
  }

  deactivateDiscounts(eventId) {
    return this.prisma.eventDiscount.updateMany({
      where: { event_id: BigInt(eventId), is_active: true },
      data: { is_active: false },
    })
  }

  createDiscount(data) {
    return this.prisma.eventDiscount.create({ data })
  }
}
