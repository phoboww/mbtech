Page({
  data: {
    orderItems: [],
    totalPrice: 0,
    remark: ''
  },

  onLoad() {
    const cartItems = wx.getStorageSync('cartItems') || []
    this.setData({
      orderItems: cartItems,
      totalPrice: this.calculateTotal(cartItems)
    })
  },

  calculateTotal(items) {
    return items.reduce((total, item) => {
      return total + (item.price * item.count)
    }, 0).toFixed(2)
  },

  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  submitOrder() {
    // 生成订单
    const order = {
      id: Date.now(),
      items: this.data.orderItems,
      totalPrice: this.data.totalPrice,
      remark: this.data.remark,
      createTime: new Date().toLocaleString(),
      status: 'pending'
    }

    // 保存订单历史
    const orders = wx.getStorageSync('orders') || []
    orders.push(order)
    wx.setStorageSync('orders', orders)

    // 清空购物车
    wx.setStorageSync('cartItems', [])

    wx.showToast({
      title: '下单成功',
      success: () => {
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 2000)
      }
    })
  }
}) 