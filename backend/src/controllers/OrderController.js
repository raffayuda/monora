import { OrderService } from '../services/OrderService.js'

export class OrderController {
  constructor() {
    this.orderService = new OrderService()
  }

  create = async (req, res) => {
    const order = await this.orderService.createOrder(req.user, req.body)
    res.status(201).json(order)
  }

  listMyOrders = async (req, res) => {
    const orders = await this.orderService.listMyOrders(req.user.id)
    res.json(orders)
  }

  list = async (req, res) => {
    const orders = await this.orderService.listOrdersForRole(req.user)
    res.json(orders)
  }

  listByEvent = async (req, res) => {
    const orders = await this.orderService.listOrdersByEvent(req.params.eventId)
    res.json(orders)
  }

  updateStatus = async (req, res) => {
    const order = await this.orderService.updateOrderStatus(req.params.id, req.body.status)
    res.json(order)
  }
}
