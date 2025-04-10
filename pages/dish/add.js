Page({
  data: {
    categoryIndex: 0,
    dishName: '',
    dishPrice: '',
    tempImagePath: ''
  },

  onLoad(options) {
    this.setData({
      categoryIndex: options.categoryIndex
    })
  },

  // 输入商品名称
  onNameInput(e) {
    this.setData({
      dishName: e.detail.value
    })
  },

  // 输入价格
  onPriceInput(e) {
    this.setData({
      dishPrice: e.detail.value
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
          tempImagePath: res.tempFiles[0].tempFilePath
        })
      }
    })
  },

  // 提交表单
  submitDish() {
    const { dishName, dishPrice, tempImagePath, categoryIndex } = this.data
    
    if (!dishName || !dishPrice || !tempImagePath) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    
    // 更新上一页的数据
    const categories = prevPage.data.categories
    const newDish = {
      id: Date.now(),
      name: dishName,
      price: Number(dishPrice),
      image: tempImagePath
    }
    
    categories[categoryIndex].dishes.push(newDish)
    
    prevPage.setData({
      categories,
      currentDishes: categories[categoryIndex].dishes
    })
    
    // 保存到存储
    wx.setStorage({
      key: 'categories',
      data: categories
    })

    wx.navigateBack()
  }
}) 