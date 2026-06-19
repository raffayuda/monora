import { VoucherService } from '../services/VoucherService.js'

export class VoucherController {
  constructor() {
    this.voucherService = new VoucherService()
  }

  list = async (req, res) => {
    const vouchers = await this.voucherService.listVouchers(req.user)
    res.json(vouchers)
  }

  create = async (req, res) => {
    const voucher = await this.voucherService.createVoucher(req.user, req.body)
    res.status(201).json(voucher)
  }

  update = async (req, res) => {
    const voucher = await this.voucherService.updateVoucher(req.user, req.params.id, req.body)
    res.json(voucher)
  }

  remove = async (req, res) => {
    const result = await this.voucherService.deleteVoucher(req.user, req.params.id)
    res.json(result)
  }

  validate = async (req, res) => {
    const result = await this.voucherService.validateVoucher(req.body)
    res.json(result)
  }

  use = async (req, res) => {
    const result = await this.voucherService.useVoucher(req.user.id, req.body)
    res.json(result)
  }
}
