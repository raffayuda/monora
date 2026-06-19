import { prisma } from '../config/prisma.js'

export class BaseModel {
  constructor() {
    this.prisma = prisma
  }
}
