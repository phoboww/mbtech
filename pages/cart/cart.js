Page({
  data: {
    cartItems: [],
    totalPrice: 0
  },

  onShow() {
    this.loadCartItems()
  },

  loadCartItems() {
    const cartItems = wx.getStorageSync('cartItems') || []
    this.setData({
      cartItems,
      totalPrice: this.calculateTotal(cartItems)
    })
  },

  calculateTotal(items) {
    return items.reduce((total, item) => {
      return total + (item.price * item.count)
    }, 0).toFixed(2)
  },

  decreaseCount(e) {
    const { id } = e.currentTarget.dataset
    const { cartItems } = this.data
    const index = cartItems.findIndex(item => item.id === id)
    
    if (index > -1) {
      if (cartItems[index].count > 1) {
        cartItems[index].count--
      } else {
        cartItems.splice(index, 1)
      }
      
      this.setData({
        cartItems,
        totalPrice: this.calculateTotal(cartItems)
      })
      
      wx.setStorageSync('cartItems', cartItems)
    }
  },

  increaseCount(e) {
    const { id } = e.currentTarget.dataset
    const { cartItems } = this.data
    const index = cartItems.findIndex(item => item.id === id)
    
    if (index > -1) {
      cartItems[index].count++
      
      this.setData({
        cartItems,
        totalPrice: this.calculateTotal(cartItems)
      })
      
      wx.setStorageSync('cartItems', cartItems)
    }
  },

  submitOrder() {
    if (this.data.cartItems.length === 0) {
      return wx.showToast({
        title: '购物车是空的',
        icon: 'none'
      })
    }

    // 生成订单
    const order = {
      id: Date.now(),
      items: this.data.cartItems,
      totalPrice: this.data.totalPrice,
      createTime: new Date().toLocaleString(),
      status: 'pending'
    }

    // 保存订单历史
    const orders = wx.getStorageSync('orders') || []
    orders.push(order)
    wx.setStorageSync('orders', orders)

    // 清空购物车
    this.setData({
      cartItems: [],
      totalPrice: 0
    })
    wx.setStorageSync('cartItems', [])

    // 提示成功并跳转到历史订单页
    wx.showToast({
      title: '下单成功',
      success: () => {
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/order/history/history'
          })
        }, 2000)
      }
    })
  }
}) 