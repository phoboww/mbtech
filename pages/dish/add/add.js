Page({
  data: {
    categoryIndex: 0,
    name: '',
    price: '',
    image: ''
  },

  onLoad(options) {
    if (options.categoryIndex) {
      this.setData({
        categoryIndex: parseInt(options.categoryIndex)
      })
    }
  },

  // 输入商品名称
  onNameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 输入价格
  onPriceInput(e) {
    this.setData({
      price: e.detail.value
    })
  },

  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          image: res.tempFiles[0].tempFilePath
        })
      }
    })
  },

  // 提交表单
  submitDish() {
    const { name, price, image, categoryIndex } = this.data
    
    if (!name || !price || !image) {
      return wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
    }

    const categories = wx.getStorageSync('categories') || []
    const newDish = {
      id: Date.now(),
      name,
      price: parseFloat(price),
      image
    }

    if (!categories[categoryIndex]) {
      categories[categoryIndex] = {
        name: '默认分类',
        dishes: []
      }
    }

    categories[categoryIndex].dishes.push(newDish)
    wx.setStorageSync('categories', categories)

    wx.showToast({
      title: '添加成功',
      success: () => {
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      }
    })
  }
}) 