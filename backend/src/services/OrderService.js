import { OrderModel } from '../models/OrderModel.js'

export class OrderService {
  constructor() {
    this.orderModel = new OrderModel()
  }

  formatOrder(o) {
    return {
      id: o.order_code,
      orderId: Number(o.id),
      userId: Number(o.user_id),
      status: o.status,
      date: o.created_at,
      total: Number(o.total),
      subtotal: Number(o.subtotal),
      grandTotal: Number(o.total),
      voucherDiscount: Number(o.voucher_discount),
      serviceFee: Number(o.service_fee),
      voucherCode: o.voucher_code,
      deliveryMethod: o.delivery_method,
      deliveryAddress: o.delivery_address
        ? {
            address: o.delivery_address,
            city: o.delivery_city,
            zipCode: o.delivery_zip,
          }
        : null,
      customer: {
        name: o.customer_name || o.user?.name,
        email: o.customer_email || o.user?.email,
        phone: o.customer_phone,
      },
      items: (o.items || []).map((i) => ({
        id: Number(i.id),
        price: Number(i.unit_price),
        originalPrice: i.original_price ? Number(i.original_price) : null,
        quantity: i.quantity,
        eventId: i.event_id ? Number(i.event_id) : null,
        itemType: i.item_type,
        type: i.title,
        name: i.title,
        eventTitle: i.event?.title || '',
        eventDate: i.event_date,
        eventImage: i.event_image,
        size: i.size,
        color: i.color,
      })),
    }
  }

  async createOrder(user, payload) {
    const orderCode = `ORD-${Date.now()}`
    const order = await this.orderModel.create({
      order_code: orderCode,
      user_id: BigInt(user.id),
      status: 'confirmed',
      subtotal: payload.subtotal || 0,
      voucher_code: payload.voucherCode || null,
      voucher_discount: payload.voucherDiscount || 0,
      service_fee: payload.serviceFee || 0,
      total: payload.grandTotal || payload.total || 0,
      delivery_method: payload.deliveryMethod || null,
      delivery_address: payload.deliveryAddress?.address || null,
      delivery_city: payload.deliveryAddress?.city || null,
      delivery_zip: payload.deliveryAddress?.zipCode || null,
      customer_name: payload.customerInfo?.name || user.name,
      customer_email: payload.customerInfo?.email || user.email,
      customer_phone: payload.customerInfo?.phone || null,
    })

    if (payload.items?.length) {
      for (const item of payload.items) {
        await this.orderModel.createItem({
          order_id: order.id,
          item_type: item.itemType || 'ticket',
          event_id: item.eventId ? BigInt(item.eventId) : null,
          title: item.type || item.name || item.title || '',
          quantity: item.quantity || 1,
          unit_price: item.price || 0,
          original_price: item.originalPrice || null,
          size: item.size || null,
          color: item.color || null,
          event_date: item.eventDate || null,
          event_image: item.eventImage || null,
        })
      }
    }

    const full = await this.orderModel.findFullById(order.id)
    return this.formatOrder(full)
  }

  async listMyOrders(userId) {
    const rows = await this.orderModel.listMyOrders(userId)
    return rows.map((o) => this.formatOrder(o))
  }

  async listOrdersForRole(user) {
    if (user.role === 'app_admin') {
      const rows = await this.orderModel.listAll()
      return rows.map((o) => this.formatOrder(o))
    }

    const myEvents = await this.orderModel.listEventIdsByCreator(user.id)
    const eventIds = myEvents.map((e) => e.id)
    const orderIds = await this.orderModel.listOrderIdsByEventIds(eventIds)
    const rows = await this.orderModel.listByOrderIds(orderIds.map((o) => o.order_id))
    return rows.map((o) => this.formatOrder(o))
  }

  async listOrdersByEvent(eventId) {
    const orderIds = await this.orderModel.listOrderIdsByEventIds([BigInt(eventId)])
    const rows = await this.orderModel.listByOrderIds(orderIds.map((o) => o.order_id))
    return rows.map((o) => this.formatOrder(o))
  }

  async updateOrderStatus(idOrCode, status) {
    const order = await this.orderModel.updateStatusByParam(idOrCode, status)
    return this.formatOrder(order)
  }
}
