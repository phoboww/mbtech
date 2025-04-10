Page({
  data: {
    orders: []
  },

  onShow() {
    this.loadOrders()
  },

  loadOrders() {
    const orders = wx.getStorageSync('orders') || []
    orders.sort((a, b) => b.id - a.id)  // 按时间倒序
    this.setData({ orders })
  }
}) 