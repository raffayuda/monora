import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoAdd, IoRemove, IoCheckmarkCircle, IoCartOutline } from 'react-icons/io5'
import { useCart } from '../context/CartContext'
import { formatRupiah } from '../utils/currency'

function MerchandiseSection({ event }) {
  const { addMerch, items } = useCart()
  const [selections, setSelections] = useState({})
  const [addedItems, setAddedItems] = useState({})

  const getSelection = (merchId) => selections[merchId] || { size: '', color: '', quantity: 1 }

  const updateSelection = (merchId, field, value) => {
    setSelections(prev => ({
      ...prev,
      [merchId]: { ...getSelection(merchId), [merchId]: undefined, ...prev[merchId], [field]: value },
    }))
  }

  const handleAddToCart = (merch) => {
    const sel = getSelection(merch.id)
    if (merch.sizes.length > 0 && !sel.size) return
    if (merch.colors.length > 0 && !sel.color) return

    addMerch({
      id: merch.id,
      eventId: event.id,
      eventTitle: event.title,
      organizerName: event.organizer || 'Unknown Organizer',
      name: merch.name,
      price: merch.price,
      image: merch.image,
      size: sel.size || null,
      color: sel.color || null,
      quantity: sel.quantity || 1,
    })

    setAddedItems(prev => ({ ...prev, [merch.id]: true }))
    setSelections(prev => ({
      ...prev,
      [merch.id]: { size: '', color: '', quantity: 1 },
    }))

    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [merch.id]: false }))
    }, 2000)
  }

  const getMerchInCart = (merchId) => {
    return items.filter(item => item.id === merchId && item.itemType === 'merch')
      .reduce((sum, item) => sum + item.quantity, 0)
  }

  if (!event.hasMerch || event.merchandise.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/40 text-lg">Tidak ada merchandise tersedia untuk acara ini.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {event.merchandise.map((merch) => {
          const sel = getSelection(merch.id)
          const inCart = getMerchInCart(merch.id)
          const needsSize = merch.sizes.length > 0
          const needsColor = merch.colors.length > 0
          const canAdd = (!needsSize || sel.size) && (!needsColor || sel.color)

          return (
            <motion.div
              key={merch.id}
              whileHover={{ y: -4 }}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={merch.image}
                  alt={merch.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(11,13,26,0.8) 0%, transparent 50%)' }}
                />
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <h4 className="text-white font-bold text-sm m-0">{merch.name}</h4>
                  <span className="text-orange-400 font-bold text-lg">{formatRupiah(merch.price)}</span>
                </div>
                {inCart > 0 && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <IoCartOutline />
                    {inCart} di keranjang
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="p-4 space-y-3">
                {/* Size Selector */}
                {needsSize && (
                  <div>
                    <p className="text-white/40 text-xs mb-2 m-0">Ukuran</p>
                    <div className="flex flex-wrap gap-2">
                      {merch.sizes.map(size => (
                        <button
                          key={size}
                          onClick={() => updateSelection(merch.id, 'size', size)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border-none ${sel.size === size
                              ? 'text-white'
                              : 'text-white/50 hover:text-white'
                            }`}
                          style={{
                            background: sel.size === size
                              ? 'linear-gradient(135deg, #f97316, #ea580c)'
                              : 'rgba(255,255,255,0.08)',
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selector */}
                {needsColor && (
                  <div>
                    <p className="text-white/40 text-xs mb-2 m-0">Warna</p>
                    <div className="flex flex-wrap gap-2">
                      {merch.colors.map(color => (
                        <button
                          key={color}
                          onClick={() => updateSelection(merch.id, 'color', color)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border-none ${sel.color === color
                              ? 'text-white'
                              : 'text-white/50 hover:text-white'
                            }`}
                          style={{
                            background: sel.color === color
                              ? 'linear-gradient(135deg, #f97316, #ea580c)'
                              : 'rgba(255,255,255,0.08)',
                          }}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity + Add to Cart */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-0 rounded-lg overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <button
                      onClick={() => updateSelection(merch.id, 'quantity', Math.max(1, (sel.quantity || 1) - 1))}
                      className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none"
                    >
                      <IoRemove className="text-sm" />
                    </button>
                    <span className="w-8 text-center text-white font-semibold text-sm">{sel.quantity || 1}</span>
                    <button
                      onClick={() => updateSelection(merch.id, 'quantity', Math.min(10, (sel.quantity || 1) + 1))}
                      className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none"
                    >
                      <IoAdd className="text-sm" />
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {addedItems[merch.id] ? (
                      <motion.div
                        key="added"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-1 text-emerald-400 text-sm font-semibold"
                      >
                        <IoCheckmarkCircle />
                        Ditambahkan!
                      </motion.div>
                    ) : (
                      <motion.button
                        key="add"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(merch)}
                        disabled={!canAdd}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer border-none transition-all flex items-center gap-1.5 ${canAdd ? 'text-white' : 'text-white/30 cursor-not-allowed'
                          }`}
                        style={{
                          background: canAdd
                            ? 'linear-gradient(135deg, #f97316, #ea580c)'
                            : 'rgba(255,255,255,0.06)',
                        }}
                      >
                        <IoCartOutline />
                        Tambah ke Keranjang
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Stock Info */}
                <p className="text-white/20 text-xs m-0 text-right">
                  {merch.stock > 0 ? `${merch.stock} tersedia` : 'Stok habis'}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Info Notice */}
      <div className="rounded-xl p-4"
        style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)' }}
      >
        <p className="text-orange-300 text-sm m-0">
          <strong>Info:</strong> Merchandise akan tersedia untuk diambil di lokasi acara.
          Anda juga dapat memilih pengiriman saat checkout.
        </p>
      </div>
    </div>
  )
}

export default MerchandiseSection
