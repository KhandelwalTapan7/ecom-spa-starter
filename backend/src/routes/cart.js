// backend/src/routes/cart.js
import express from 'express'
import auth from '../middleware/auth.js'
import User from '../models/User.js'
import Item from '../models/Item.js'

const router = express.Router()

function getUserId(req) {
  // supports different auth middlewares
  return req.user?.id || req.user?._id || req.userId
}

/**
 * GET /api/cart
 * Return the user's cart with populated items.
 */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(getUserId(req)).populate('cart.item')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ items: user.cart })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * POST /api/cart/add
 * body: { itemId, qty }
 * Adds new or increments existing; qty defaults to 1 if omitted.
 */
router.post('/add', auth, async (req, res) => {
  try {
    let { itemId, qty } = req.body
    qty = Number(qty ?? 1)
    if (!itemId || !Number.isFinite(qty)) {
      return res.status(400).json({ error: 'itemId and qty required' })
    }
    const user = await User.findById(getUserId(req))
    if (!user) return res.status(404).json({ error: 'User not found' })

    // ensure item exists
    const exists = await Item.exists({ _id: itemId })
    if (!exists) return res.status(404).json({ error: 'Item not found' })

    const i = user.cart.findIndex(ci => String(ci.item) === String(itemId))
    if (i === -1) user.cart.push({ item: itemId, qty })
    else user.cart[i].qty += qty

    await user.save()
    const populated = await user.populate('cart.item')
    res.json({ items: populated.cart })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * PATCH/POST /api/cart/update
 * body: { itemId, qty }
 * Sets qty; removes when qty <= 0
 */
async function updateQty(req, res) {
  try {
    const { itemId } = req.body
    let { qty } = req.body
    qty = Number(qty)
    if (!itemId || !Number.isFinite(qty)) {
      return res.status(400).json({ error: 'itemId and qty required' })
    }
    const user = await User.findById(getUserId(req))
    if (!user) return res.status(404).json({ error: 'User not found' })

    const i = user.cart.findIndex(ci => String(ci.item) === String(itemId))
    if (i === -1) return res.status(404).json({ error: 'Item not in cart' })

    if (qty <= 0) user.cart.splice(i, 1)
    else user.cart[i].qty = qty

    await user.save()
    const populated = await user.populate('cart.item')
    res.json({ items: populated.cart })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
}
router.patch('/update', auth, updateQty)
router.post('/update', auth, updateQty) // also accept POST for convenience

/**
 * DELETE /api/cart/remove/:itemId
 * Removes a single item from cart
 */
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params
    const user = await User.findById(getUserId(req))
    if (!user) return res.status(404).json({ error: 'User not found' })

    const before = user.cart.length
    user.cart = user.cart.filter(ci => String(ci.item) !== String(itemId))
    if (user.cart.length === before) return res.status(404).json({ error: 'Item not in cart' })

    await user.save()
    const populated = await user.populate('cart.item')
    res.json({ items: populated.cart })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * (optional) DELETE /api/cart/clear
 */
router.delete('/clear', auth, async (req, res) => {
  try {
    const user = await User.findById(getUserId(req))
    if (!user) return res.status(404).json({ error: 'User not found' })
    user.cart = []
    await user.save()
    res.json({ items: [] })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
