import { ApiError } from '../utils/ApiError.js'
import { RefundModel } from '../models/RefundModel.js'

export class RefundService {
  constructor() {
    this.refundModel = new RefundModel()
  }

  formatRefund(r) {
    return {
      id: r.refund_code,
      refundId: Number(r.id),
      orderId: r.order?.order_code || String(r.order_id),
      itemId: r.order_item_id ? Number(r.order_item_id) : null,
      eventId: r.event_id ? Number(r.event_id) : null,
      eventTitle: r.event?.title || r.order_item?.event?.title || null,
      item: r.order_item
        ? {
            id: Number(r.order_item.id),
            name: r.order_item.title,
            quantity: r.order_item.quantity,
            price: Number(r.order_item.unit_price),
            itemType: r.order_item.item_type,
          }
        : null,
      userId: Number(r.user_id),
      reason: r.reason,
      status: r.status,
      requestedAt: r.requested_at,
      processedAt: r.processed_at,
      order: r.order
        ? {
            id: r.order.order_code,
            total: Number(r.order.total),
            status: r.order.status,
            customer: { name: r.order.customer_name, email: r.order.customer_email },
          }
        : undefined,
      user: r.user ? { id: Number(r.user.id), name: r.user.name, email: r.user.email } : undefined,
    }
  }

  async requestRefund(userId, payload) {
    const { orderId, reason, itemId } = payload
    const order = await this.refundModel.findOrderWithItemsByCodeAndUser(orderId, userId)
    if (!order) throw new ApiError(404, 'Order not found')

    const selectedItemId = Number(itemId)
    if (!Number.isInteger(selectedItemId) || selectedItemId <= 0) {
      throw new ApiError(400, 'Please select an item to refund')
    }

    const orderItem = await this.refundModel.findOrderItemByIdAndOrder(selectedItemId, order.id)
    if (!orderItem) throw new ApiError(404, 'Selected item not found in this order')

    if (!orderItem.event_id) {
      return { success: false, message: 'This item cannot be refunded via organizer workflow' }
    }

    const existing = await this.refundModel.findExistingItemRefund(orderItem.id)
    if (existing) {
      return { success: false, message: 'Refund already requested for this item' }
    }

    const refund = await this.refundModel.create({
      refund_code: `REF-${Date.now()}`,
      order_id: order.id,
      order_item_id: orderItem.id,
      event_id: orderItem.event_id,
      user_id: BigInt(userId),
      reason: reason || null,
      status: 'pending',
    })

    return { success: true, refund: this.formatRefund(refund) }
  }

  async listRefunds(user) {
    let rows = []
    if (user.role === 'app_admin') {
      rows = await this.refundModel.listAll()
    } else if (user.role === 'event_admin') {
      const myEvents = await this.refundModel.listEventIdsByCreator(user.id)
      const eventIds = myEvents.map((e) => e.id)
      rows = await this.refundModel.listByEventIds(eventIds)
    } else {
      rows = await this.refundModel.listByUser(user.id)
    }
    return rows.map((r) => this.formatRefund(r))
  }

  async getRefundByOrderCode(orderCode) {
    const order = await this.refundModel.findOrderByCode(orderCode)
    if (!order) return null
    const refunds = await this.refundModel.findByOrderIdWithRelations(order.id)
    return refunds.map((r) => this.formatRefund(r))
  }

  async processRefund(user, refundCode, status) {
    const refund = await this.refundModel.findByRefundCode(refundCode)
    if (!refund) throw new ApiError(404, 'Refund not found')

    if (user.role === 'event_admin') {
      if (!refund.event || Number(refund.event.created_by) !== Number(user.id)) {
        throw new ApiError(403, 'You can only process refunds for your own event items')
      }
    }

    const updated = await this.refundModel.updateById(refund.id, { status, processed_at: new Date() })
    if (status === 'approved') {
      const [totalItems, approvedItems] = await Promise.all([
        this.refundModel.countOrderItems(refund.order_id),
        this.refundModel.countApprovedRefundItems(refund.order_id),
      ])

      // Mark order refunded only when every order line has approved refund.
      if (totalItems > 0 && approvedItems >= totalItems) {
        await this.refundModel.updateOrderStatus(refund.order_id, 'refunded')
      }
    }

    return this.formatRefund(updated)
  }
}
