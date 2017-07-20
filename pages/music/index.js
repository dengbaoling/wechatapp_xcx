import api from '../../utils/api'

let track = 0,page =0,np =1,songlist=''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    songRec:[],
    isPlay:"none"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHeight();
    this.getPlayList();
    this.getNetInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.isPlay();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  getPlayList:function(){
    api.request.hotList({
      success:(res)=>{
        let rec = []
        let that = this
        songlist = res.data.result.tracks;
        let code = res.data.code
        let title,author,album,album_title,song_id;
        if(code==200){
          let len=songlist.length
          track = len
          if(len>0&&len<=10){
            page = 1
          }else{
            if(len%10==0) page=len/10;
            else page=Math.floor(len/10) +1;
          }
          this.lineList(page,track,songlist)
        }
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },

  lineList:function(page,track,songlist){
    let that = this
    let rec = []
    let title,author,album,album_title,song_id;

    if(page == 1){
      for(let i=0;i<track;i++){
        title = songlist[i].name;
        author = songlist[i].artists[0].name;
        album = songlist[i].album.picUrl;
        album_title = songlist[i].album.name;
        song_id = songlist[i].id;
        rec.push({
          "title":title,
          "author":author,
          "album":album,
          "album_title":album_title,
          "song_id":song_id
        })
      }
    }else{
      let now = np * 10
      for(let i=0;i<now;i++){
        title = songlist[i].name;
        author= songlist[i].artists[0].name;
        album = songlist[i].album.picUrl;
        album_title = songlist[i].album.name;
        song_id = songlist[i].id;
        rec.push({
          "title":title,
          "author":author,
          "album":album,
          "album_title":album_title,
          "song_id":song_id
        })
      }
    }
    that.setData({
      songRec:rec
    })
  },
 
  playSong:function(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../player/player?id='+id,
    })
    api.wId = id
  },

  getNetInfo:function(){
    api.netType({
      success:(e)=>{
        var type = e.networkType
        if(type!='wifi'){
          wx.showModal({
            content: '您正在使用' + type + '网络。请注意流量。',
            confirmText: '知道了',
            confirmColor: '#D81E06',
            showCancel: false
          })
        }
      }
    })
  },

  isPlay:function(){
    let that = this
    var x = 'block'
    api.playCtrl.getState({
      success:(e)=>{
        let s = e.status
        if(s == 2){x='none'}
        else {
          x = 'block';
          if(api.wId !=0) this.getPlayMsg(api.wId);
        }
        that.setData({
          isPlay:x
        })
      }
    })
  },

  getPlayMsg:function(id){
    let that = this
    api.request.music({
      data:{
        id:id,
        ids:[id]
      },
      success:(res)=>{
        let song_info = res.data.songs[0]
        let name = song_info.name
        let author = song_info.artists[0].name
        let album_small = song_info.album.picUrl

        that.setData({
          pic:album_small,
          name:name,
          author:author
        })
      }
    })
  },

  goPlayer:function(){
    let id = '0'
    wx.navigateTo({
      url: `../player/player?id=${id}`,
    })
  },

  getHeight:function(){
    let that = this
    wx.getSystemInfo({
      success:(res)=>{
        that.setData({
          scrollHeight:res.windowHeight
        })
      }
    })
  },

  loadMore:function(){
    if(page !=1){
      page -=1
      np +=1
    }
    this.lineList(page,track,songlist)
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})