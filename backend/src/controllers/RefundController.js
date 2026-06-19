import { RefundService } from '../services/RefundService.js'

export class RefundController {
  constructor() {
    this.refundService = new RefundService()
  }

  create = async (req, res) => {
    const result = await this.refundService.requestRefund(req.user.id, req.body)
    res.status(201).json(result)
  }

  list = async (req, res) => {
    const refunds = await this.refundService.listRefunds(req.user)
    res.json(refunds)
  }

  getByOrderId = async (req, res) => {
    const refund = await this.refundService.getRefundByOrderCode(req.params.orderId)
    res.json(refund)
  }

  process = async (req, res) => {
    const refund = await this.refundService.processRefund(req.user, req.params.id, req.body.status)
    res.json(refund)
  }
}
