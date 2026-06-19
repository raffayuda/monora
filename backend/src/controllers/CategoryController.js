import { CategoryService } from '../services/CategoryService.js'

export class CategoryController {
  constructor() {
    this.categoryService = new CategoryService()
  }

  list = async (_req, res) => {
    const categories = await this.categoryService.listCategories()
    res.json(categories)
  }

  create = async (req, res) => {
    const category = await this.categoryService.createCategory(req.body)
    res.status(201).json(category)
  }

  update = async (req, res) => {
    const category = await this.categoryService.updateCategory(req.params.id, req.body)
    res.json(category)
  }

  remove = async (req, res) => {
    const result = await this.categoryService.deleteCategory(req.params.id)
    res.json(result)
  }
}
