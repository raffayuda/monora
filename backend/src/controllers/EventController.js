import { EventService } from '../services/EventService.js'

export class EventController {
  constructor() {
    this.eventService = new EventService()
  }

  listPublic = async (_req, res) => {
    const events = await this.eventService.listPublished()
    res.json(events)
  }

  listMyEvents = async (req, res) => {
    const events = await this.eventService.listMyEvents(req.user)
    res.json(events)
  }

  listAllAdmin = async (_req, res) => {
    const events = await this.eventService.listAllAdmin()
    res.json(events)
  }

  getByIdOrSlug = async (req, res) => {
    const event = await this.eventService.getEventByIdOrSlug(req.params.idOrSlug)
    res.json(event)
  }

  create = async (req, res) => {
    const event = await this.eventService.createEvent(req.user, req.body)
    res.status(201).json(event)
  }

  update = async (req, res) => {
    const event = await this.eventService.updateEvent(req.user, req.params.id, req.body)
    res.json(event)
  }

  remove = async (req, res) => {
    const result = await this.eventService.deleteEvent(req.user, req.params.id)
    res.json(result)
  }

  addDiscount = async (req, res) => {
    const discount = await this.eventService.addDiscount(req.params.id, req.body)
    res.status(201).json(discount)
  }

  removeDiscount = async (req, res) => {
    const result = await this.eventService.removeDiscount(req.params.id)
    res.json(result)
  }
}
