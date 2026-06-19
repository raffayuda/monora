import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoTrashOutline, IoAdd, IoRemove, IoCartOutline, IoArrowForward, IoTicketOutline, IoShirtOutline, IoStorefrontOutline } from 'react-icons/io5'
import { useCart } from '../context/CartContext'
import { formatRupiah } from '../utils/currency'

function getItemKey(item) {
  return item.cartKey || `${item.itemType}-${item.id}`
}

function CartPage() {
  const { items, itemCount, updateQuantity, removeItem, clearCart } = useCart()

  const groupedItems = Object.values(
    items.reduce((accumulator, item) => {
      const organizerName = item.organizerName || 'Unknown Organizer'
      if (!accumulator[organizerName]) {
        accumulator[organizerName] = {
          organizerName,
          items: [],
        }
      }
      accumulator[organizerName].items.push(item)
      return accumulator
    }, {})
  ).map((group) => {
    const tickets = group.items.filter((item) => item.itemType === 'ticket')
    const merch = group.items.filter((item) => item.itemType === 'merch')
    const subtotal = group.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const serviceFee = Math.round(subtotal * 0.05)
    const total = subtotal + serviceFee

    return {
      ...group,
      tickets,
      merch,
      subtotal,
      serviceFee,
      total,
      checkoutKeys: group.items.map((item) => getItemKey(item)),
      quantity: group.items.reduce((sum, item) => sum + item.quantity, 0),
    }
  })

  if (itemCount === 0) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <IoCartOutline className="text-6xl text-white/20 mb-4 mx-auto" />
          <h1 className="text-3xl font-bold text-white mb-3">Keranjang Anda Kosong</h1>
          <p className="text-white/50 mb-8 max-w-md">
            Sepertinya Anda belum menambahkan tiket atau merchandise. Jelajahi acara kami untuk menemukan sesuatu yang Anda sukai!
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full text-sm font-semibold no-underline"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            Jelajahi Acara
            <IoArrowForward />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24">
      <section className="relative py-10 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-125 h-125 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f97316, transparent)' }}
          />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Keranjang Belanja
          </motion.h1>
          <p className="text-white/50">{itemCount} item di keranjang Anda, dikelompokkan berdasarkan penyelenggara</p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-6xl mx-auto space-y-8">
          {groupedItems.map((group, index) => (
            <motion.div
              key={group.organizerName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="rounded-3xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-5"
                style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <IoStorefrontOutline className="text-orange-400" />
                    <span className="text-white/40 text-xs uppercase tracking-[0.2em]">Penyelenggara</span>
                  </div>
                  <h2 className="text-white text-xl font-bold m-0">{group.organizerName}</h2>
                  <p className="text-white/40 text-sm mt-1 mb-0">{group.quantity} item siap untuk checkout</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <div className="text-right">
                    <div className="text-white/40 text-xs">Total grup</div>
                    <div className="text-white font-bold text-2xl">{formatRupiah(group.total)}</div>
                  </div>
                  <Link
                    to={`/checkout?items=${encodeURIComponent(group.checkoutKeys.join(','))}`}
                    className="flex items-center justify-center gap-2 text-white px-5 py-3 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 4px 15px rgba(249,115,22,0.3)' }}
                  >
                    Checkout Organizer Ini
                    <IoArrowForward />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-0">
                <div className="p-6 space-y-6">
                  {group.tickets.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <IoTicketOutline className="text-orange-400 text-xl" />
                        <h3 className="text-white font-bold text-lg m-0">Tickets ({group.tickets.length})</h3>
                      </div>
                      <div className="space-y-3">
                        {group.tickets.map((item) => (
                          <motion.div
                            key={getItemKey(item)}
                            layout
                            className="rounded-xl p-4 flex flex-col sm:flex-row gap-4"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            <Link to={`/event/${item.eventId}`} className="shrink-0">
                              <img src={item.eventImage} alt={item.eventTitle} className="w-full sm:w-24 h-20 object-cover rounded-lg" />
                            </Link>

                            <div className="flex-1 min-w-0">
                              <Link to={`/event/${item.eventId}`} className="no-underline">
                                <h4 className="text-white font-bold text-sm m-0 mb-1 hover:text-orange-400 transition-colors">{item.eventTitle}</h4>
                              </Link>
                              <p className="text-white/50 text-xs mb-1">{item.name}</p>
                              <p className="text-white/40 text-xs m-0">{item.eventDate}</p>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-6">
                              <div className="flex items-center gap-0 rounded-lg overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <button
                                  onClick={() => updateQuantity(item.id, 'ticket', item.quantity - 1)}
                                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none"
                                >
                                  <IoRemove className="text-sm" />
                                </button>
                                <span className="w-8 text-center text-white font-semibold text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 'ticket', item.quantity + 1)}
                                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none"
                                >
                                  <IoAdd className="text-sm" />
                                </button>
                              </div>

                              <p className="text-white font-bold text-sm m-0 w-20 text-right">{formatRupiah(item.price * item.quantity)}</p>

                              <button
                                onClick={() => removeItem(item.id, 'ticket')}
                                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none transition-colors"
                              >
                                <IoTrashOutline />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {group.merch.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <IoShirtOutline className="text-orange-400 text-xl" />
                        <h3 className="text-white font-bold text-lg m-0">Merchandise ({group.merch.length})</h3>
                      </div>
                      <div className="space-y-3">
                        {group.merch.map((item) => (
                          <motion.div
                            key={getItemKey(item)}
                            layout
                            className="rounded-xl p-4 flex flex-col sm:flex-row gap-4"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                          >
                            <div className="shrink-0">
                              <img src={item.image} alt={item.name} className="w-full sm:w-24 h-20 object-cover rounded-lg" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-bold text-sm m-0 mb-1">{item.name}</h4>
                              <p className="text-white/50 text-xs mb-1">{item.eventTitle}</p>
                              <div className="flex gap-2">
                                {item.size && <span className="text-xs text-white/40 px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>Size: {item.size}</span>}
                                {item.color && <span className="text-xs text-white/40 px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>{item.color}</span>}
                              </div>
                            </div>

                            <div className="flex items-center gap-4 sm:gap-6">
                              <div className="flex items-center gap-0 rounded-lg overflow-hidden"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <button
                                  onClick={() => updateQuantity(item.id, 'merch', item.quantity - 1, item.cartKey)}
                                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none"
                                >
                                  <IoRemove className="text-sm" />
                                </button>
                                <span className="w-8 text-center text-white font-semibold text-sm">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, 'merch', item.quantity + 1, item.cartKey)}
                                  className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none"
                                >
                                  <IoAdd className="text-sm" />
                                </button>
                              </div>

                              <p className="text-white font-bold text-sm m-0 w-20 text-right">{formatRupiah(item.price * item.quantity)}</p>

                              <button
                                onClick={() => removeItem(item.id, 'merch', item.cartKey)}
                                className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none transition-colors"
                              >
                                <IoTrashOutline />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 xl:border-l border-white/6" style={{ background: 'rgba(255,255,255,0.02)' }}>
                  <h3 className="text-lg font-bold text-white mb-4">Ringkasan Penyelenggara</h3>
                  <div className="space-y-3 mb-6">
                    {group.tickets.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Tickets ({group.tickets.reduce((sum, item) => sum + item.quantity, 0)})</span>
                        <span className="text-white">{formatRupiah(group.tickets.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
                      </div>
                    )}
                    {group.merch.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Merchandise ({group.merch.reduce((sum, item) => sum + item.quantity, 0)})</span>
                        <span className="text-white">{formatRupiah(group.merch.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Biaya Layanan</span>
                      <span className="text-white">{formatRupiah(group.serviceFee)}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 mb-6">
                    <div className="flex justify-between items-end">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-white font-bold text-xl">{formatRupiah(group.total)}</span>
                    </div>
                    <p className="text-white/30 text-xs mt-1">Termasuk biaya layanan 5% hanya untuk penyelenggara ini</p>
                  </div>

                  <Link
                    to={`/checkout?items=${encodeURIComponent(group.checkoutKeys.join(','))}`}
                    className="flex items-center justify-center gap-2 w-full text-white py-3.5 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 4px 15px rgba(249,115,22,0.3)' }}
                  >
                    Checkout Organizer Ini
                    <IoArrowForward />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/events" className="text-white/50 hover:text-white text-sm no-underline transition-colors">
              Lanjut Belanja
            </Link>
            <button
              onClick={clearCart}
              className="text-red-400 hover:text-red-300 text-sm font-medium cursor-pointer bg-transparent border-none transition-colors"
            >
              Kosongkan seluruh keranjang
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CartPage