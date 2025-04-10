Page({
  data: {
    bannerImage: '',
    storeName: '',
    storeDesc: '',
    baristaImage: '',
    menuIcon: '',
    deliveryIcon: ''
  },

  onLoad() {
    this.loadStoreInfo()
    this.loadImages()
  },

  loadStoreInfo() {
    const storeInfo = wx.getStorageSync('storeInfo') || {}
    this.setData({
      bannerImage: storeInfo.bannerImage || '',
      storeName: storeInfo.storeName || '',
      storeDesc: storeInfo.storeDesc || ''
    })
  },

  loadImages() {
    const baristaImage = wx.getStorageSync('baristaImage')
    const menuIcon = wx.getStorageSync('menuIcon')
    const deliveryIcon = wx.getStorageSync('deliveryIcon')
    
    this.setData({
      baristaImage: baristaImage || '',
      menuIcon: menuIcon || '',
      deliveryIcon: deliveryIcon || ''
    })
  },

  chooseBanner() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({
          bannerImage: tempFilePath
        })
        const storeInfo = wx.getStorageSync('storeInfo') || {}
        storeInfo.bannerImage = tempFilePath
        wx.setStorageSync('storeInfo', storeInfo)
      }
    })
  },

  deleteBanner() {
    wx.showModal({
      title: '提示',
      content: '确定要删除店铺图片吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            bannerImage: ''
          })
          const storeInfo = wx.getStorageSync('storeInfo') || {}
          storeInfo.bannerImage = ''
          wx.setStorageSync('storeInfo', storeInfo)
        }
      }
    })
  },

  uploadImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({
          baristaImage: tempFilePath
        })
        wx.setStorageSync('baristaImage', tempFilePath)
      }
    })
  },

  deleteImage() {
    wx.showModal({
      title: '提示',
      content: '确定要删除图片吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            baristaImage: ''
          })
          wx.removeStorageSync('baristaImage')
        }
      }
    })
  },

  goToOrder() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  goToDelivery() {
    wx.showToast({
      title: '外卖功能开发中',
      icon: 'none'
    })
  },

  // 上传菜单图标
  uploadMenuIcon() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({ menuIcon: tempFilePath })
        wx.setStorageSync('menuIcon', tempFilePath)
      }
    })
  },

  // 上传外卖图标
  uploadDeliveryIcon() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath
        this.setData({ deliveryIcon: tempFilePath })
        wx.setStorageSync('deliveryIcon', tempFilePath)
      }
    })
  }
}) 