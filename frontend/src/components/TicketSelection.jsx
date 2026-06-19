import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoAdd, IoRemove, IoCheckmarkCircle, IoTicketOutline } from 'react-icons/io5'
import { useCart } from '../context/CartContext'
import { getDiscountedPrice } from '../data/events'
import { formatRupiah } from '../utils/currency'

function TicketSelection({ event }) {
  const { addTicket, items } = useCart()
  const [quantities, setQuantities] = useState({})
  const [addedTickets, setAddedTickets] = useState({})

  const getQuantity = (ticketId) => quantities[ticketId] || 0

  const updateQty = (ticketId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [ticketId]: Math.max(0, Math.min(10, (prev[ticketId] || 0) + delta)),
    }))
  }

  const handleAddToCart = (ticket) => {
    const qty = getQuantity(ticket.id)
    if (qty === 0) return

    addTicket({
      id: ticket.id,
      eventId: event.id,
      eventTitle: event.title,
      organizerName: event.organizer || 'Unknown Organizer',
      eventDate: event.date,
      eventImage: event.thumbnail,
      name: ticket.type,
      price: getDiscountedPrice(ticket.price, event.discount),
      originalPrice: event.discount ? ticket.price : undefined,
      quantity: qty,
    })

    setAddedTickets(prev => ({ ...prev, [ticket.id]: true }))
    setQuantities(prev => ({ ...prev, [ticket.id]: 0 }))

    setTimeout(() => {
      setAddedTickets(prev => ({ ...prev, [ticket.id]: false }))
    }, 2000)
  }

  // Count tickets already in cart for this event
  const getCartCount = (ticketId) => {
    const found = items.find(item => item.id === ticketId && item.itemType === 'ticket')
    return found ? found.quantity : 0
  }

  return (
    <div className="space-y-4">
      {event.tickets.map((ticket) => {
        const qty = getQuantity(ticket.id)
        const inCart = getCartCount(ticket.id)

        return (
          <motion.div
            key={ticket.id}
            whileHover={{ scale: 1.01 }}
            className="rounded-xl p-5 transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: qty > 0
                ? '1px solid rgba(249,115,22,0.4)'
                : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Ticket Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <IoTicketOutline className="text-orange-400 text-lg" />
                  <h4 className="text-white font-bold text-base m-0">{ticket.type}</h4>
                </div>
                <p className="text-white/50 text-sm mb-2 ml-7">{ticket.description}</p>
                <div className="flex items-center gap-4 ml-7">
                  {event.discount ? (
                    <div className="flex items-center gap-2">
                      <span className="text-white/40 line-through text-sm">{formatRupiah(ticket.price)}</span>
                      <span className="text-white font-bold text-xl">{formatRupiah(getDiscountedPrice(ticket.price, event.discount))}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-emerald-300"
                        style={{ background: 'rgba(16,185,129,0.15)' }}
                      >
                        -{event.discount.percentage}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-white font-bold text-xl">{formatRupiah(ticket.price)}</span>
                  )}
                  <span className="text-white/30 text-xs">
                    {ticket.available > 0
                      ? `${ticket.available} tersisa`
                      : 'Habis Terjual'
                    }
                  </span>
                  {inCart > 0 && (
                    <span className="text-emerald-400 text-xs flex items-center gap-1">
                      <IoCheckmarkCircle />
                      {inCart} di keranjang
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity + Add */}
              <div className="flex items-center gap-3 ml-7 md:ml-0">
                {ticket.available > 0 ? (
                  <>
                    <div className="flex items-center gap-0 rounded-lg overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <button
                        onClick={() => updateQty(ticket.id, -1)}
                        className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none transition-colors"
                      >
                        <IoRemove />
                      </button>
                      <span className="w-10 text-center text-white font-semibold text-sm">{qty}</span>
                      <button
                        onClick={() => updateQty(ticket.id, 1)}
                        className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none transition-colors"
                      >
                        <IoAdd />
                      </button>
                    </div>

                    <AnimatePresence>
                      {addedTickets[ticket.id] ? (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          className="flex items-center gap-1 text-emerald-400 text-sm font-semibold"
                        >
                          <IoCheckmarkCircle className="text-lg" />
                          Ditambahkan!
                        </motion.div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(ticket)}
                          disabled={qty === 0}
                          className={`px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border-none transition-all ${qty > 0
                              ? 'text-white'
                              : 'text-white/30 cursor-not-allowed'
                            }`}
                          style={{
                            background: qty > 0
                              ? 'linear-gradient(135deg, #f97316, #ea580c)'
                              : 'rgba(255,255,255,0.06)',
                          }}
                        >
                          Tambah ke Keranjang
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <span className="text-red-400 font-semibold text-sm px-5 py-2.5 rounded-lg"
                    style={{ background: 'rgba(239,68,68,0.1)' }}
                  >
                    Habis Terjual
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}

      {/* Ticket Info Notice */}
      <div className="rounded-xl p-4 mt-4"
        style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
      >
        <p className="text-indigo-300 text-sm m-0">
          <strong>Catatan:</strong> Tiket tidak dapat dikembalikan. Anda dapat membeli hingga 10 tiket per jenis.
          E-tiket akan dikirim ke email Anda setelah checkout.
        </p>
      </div>
    </div>
  )
}

export default TicketSelection
