import { CategoryModel } from '../models/CategoryModel.js'

export class CategoryService {
  constructor() {
    this.categoryModel = new CategoryModel()
  }

  formatCategory(c) {
    return {
      id: Number(c.id),
      name: c.name,
      icon: c.icon,
      gradient: c.gradient,
    }
  }

  async listCategories() {
    const rows = await this.categoryModel.list()
    return rows.map((c) => this.formatCategory(c))
  }

  async createCategory(payload) {
    const { name, icon, gradient } = payload
    if (!name) {
      const err = new Error('Name is required')
      err.status = 400
      throw err
    }
    const category = await this.categoryModel.create({ name, icon, gradient })
    return this.formatCategory(category)
  }

  async updateCategory(id, payload) {
    const { name, icon, gradient } = payload
    const category = await this.categoryModel.update(id, { name, icon, gradient })
    return this.formatCategory(category)
  }

  async deleteCategory(id) {
    await this.categoryModel.delete(id)
    return { success: true }
  }
}
