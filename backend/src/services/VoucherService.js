import { ApiError } from '../utils/ApiError.js'
import { VoucherModel } from '../models/VoucherModel.js'

const formatRupiah = (amount) => `Rp${Math.round(Number(amount) || 0).toLocaleString('id-ID')}`

export class VoucherService {
  constructor() {
    this.voucherModel = new VoucherModel()
  }

  formatVoucher(v) {
    return {
      id: Number(v.id),
      eventId: v.event_id ? Number(v.event_id) : null,
      eventTitle: v.event?.title || null,
      code: v.code,
      type: v.type,
      value: Number(v.value),
      minPurchase: Number(v.min_purchase),
      maxUses: Number(v.max_uses),
      usedCount: Number(v.used_count),
      description: v.description,
      isActive: v.is_active,
    }
  }

  async listVouchers(user) {
    const rows = user.role === 'app_admin'
      ? await this.voucherModel.list()
      : await this.voucherModel.listByCreator(user.id)
    return rows.map((v) => this.formatVoucher(v))
  }

  async createVoucher(user, payload) {
    const code = (payload.code || '').trim().toUpperCase()
    const eventId = Number(payload.eventId)
    if (!code) throw new ApiError(400, 'Code is required')
    if (!Number.isInteger(eventId) || eventId <= 0) throw new ApiError(400, 'Event is required')

    const existing = await this.voucherModel.findByCode(code)
    if (existing) throw new ApiError(400, 'Voucher code already exists')

    const event = user.role === 'app_admin'
      ? await this.voucherModel.findEventById(eventId)
      : await this.voucherModel.findEventByIdAndCreator(eventId, user.id)
    if (!event) throw new ApiError(403, 'You can only create vouchers for your own events')

    const voucher = await this.voucherModel.create({
      event_id: BigInt(eventId),
      code,
      type: payload.type || 'percentage',
      value: Number(payload.value) || 0,
      min_purchase: Number(payload.minPurchase) || 0,
      max_uses: Number(payload.maxUses) || 100,
      description: payload.description || '',
      is_active: true,
    })

    const created = await this.voucherModel.findById(voucher.id)

    return this.formatVoucher(created)
  }

  async updateVoucher(user, id, payload) {
    const existing = await this.voucherModel.findById(id)
    if (!existing) throw new ApiError(404, 'Voucher not found')
    if (user.role !== 'app_admin' && Number(existing.event?.created_by) !== Number(user.id)) {
      throw new ApiError(403, 'You are not allowed to update this voucher')
    }

    const updateData = {}
    if (payload.eventId !== undefined) {
      const eventId = Number(payload.eventId)
      if (!Number.isInteger(eventId) || eventId <= 0) throw new ApiError(400, 'Invalid event')
      const event = user.role === 'app_admin'
        ? await this.voucherModel.findEventById(eventId)
        : await this.voucherModel.findEventByIdAndCreator(eventId, user.id)
      if (!event) throw new ApiError(403, 'You can only move vouchers to your own events')
      updateData.event_id = BigInt(eventId)
    }
    if (payload.type !== undefined) updateData.type = payload.type
    if (payload.value !== undefined) updateData.value = Number(payload.value)
    if (payload.minPurchase !== undefined) updateData.min_purchase = Number(payload.minPurchase)
    if (payload.maxUses !== undefined) updateData.max_uses = Number(payload.maxUses)
    if (payload.description !== undefined) updateData.description = payload.description
    if (payload.isActive !== undefined) updateData.is_active = payload.isActive
    if (payload.is_active !== undefined) updateData.is_active = payload.is_active

    await this.voucherModel.update(id, updateData)
    const voucher = await this.voucherModel.findById(id)
    return this.formatVoucher(voucher)
  }

  async deleteVoucher(user, id) {
    const existing = await this.voucherModel.findById(id)
    if (!existing) throw new ApiError(404, 'Voucher not found')
    if (user.role !== 'app_admin' && Number(existing.event?.created_by) !== Number(user.id)) {
      throw new ApiError(403, 'You are not allowed to delete this voucher')
    }
    await this.voucherModel.delete(id)
    return { success: true }
  }

  async validateVoucher(payload) {
    const { code, orderTotal, eventIds = [] } = payload
    const voucher = await this.voucherModel.findByCode((code || '').toUpperCase())

    if (!voucher || !voucher.is_active) {
      return { valid: false, message: 'Invalid voucher code' }
    }
    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return { valid: false, message: 'Voucher can only be applied to event items' }
    }

    const normalizedEventIds = eventIds.map((id) => Number(id)).filter((id) => Number.isInteger(id) && id > 0)
    const voucherEventId = voucher.event_id ? Number(voucher.event_id) : null
    if (!voucherEventId) {
      return { valid: false, message: 'Voucher is not bound to an event anymore' }
    }

    const isSameEvent = normalizedEventIds.every((id) => id === voucherEventId)
    if (!isSameEvent) {
      return {
        valid: false,
        message: `Voucher ${voucher.code} is only valid for event ${voucher.event?.title || `#${voucherEventId}`}`,
      }
    }

    if (voucher.used_count >= voucher.max_uses) {
      return { valid: false, message: 'Voucher has been fully redeemed' }
    }
    if (Number(orderTotal) < Number(voucher.min_purchase)) {
      return { valid: false, message: `Minimum purchase ${formatRupiah(voucher.min_purchase)} required` }
    }

    const discount = voucher.type === 'percentage'
      ? Math.round(Number(orderTotal) * Number(voucher.value) / 100 * 100) / 100
      : Math.min(Number(voucher.value), Number(orderTotal))

    return {
      valid: true,
      voucher: this.formatVoucher(voucher),
      discount,
      message: `${voucher.description} — You save ${formatRupiah(discount)}`,
    }
  }

  async useVoucher(userId, payload) {
    const { code, orderId, discountAmount } = payload
    const voucher = await this.voucherModel.findByCode((code || '').toUpperCase())
    if (!voucher) throw new ApiError(404, 'Voucher not found')

    await this.voucherModel.incrementUsage(voucher.id)

    if (orderId) {
      const order = await this.voucherModel.findOrderByCode(orderId)
      if (order) {
        await this.voucherModel.createVoucherUsage({
          voucher_id: voucher.id,
          order_id: order.id,
          user_id: BigInt(userId),
          discount_amount: discountAmount || 0,
        })
      }
    }

    return { success: true }
  }
}
