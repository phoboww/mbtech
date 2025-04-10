Page({
  data: {
    orders: []
  },

  onShow() {
    this.loadOrders()
  },

  loadOrders() {
    const orders = wx.getStorageSync('orders') || []
    // 按时间倒序排列
    orders.sort((a, b) => b.id - a.id)
    this.setData({ orders })
  }
}) 