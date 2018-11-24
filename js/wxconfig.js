
var WECHARCONFIG={
  
  wxconfig: function(_url, _getTicketUrl, _shareInfo, _shareInfoFriend) {
      // var _url = encodeURIComponent(window.location.href.split("#")[0]);
      $.ajax({
          type:'post',
          dataType: "json",
          url: _getTicketUrl,
          data: {url: _url},
          success: function(data) {
                  wx.config({
                      debug: false,
                      appId: data.appId,
                      timestamp: data.timestamp,
                      nonceStr: data.nonceStr,
                      signature: data.signature,
                      jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"],
                  })


          },
          fail: function (res) {
           // alert(JSON.stringify(res));
          }
      })

      wx.ready(function() {
          WECHARCONFIG.wxshare(_shareInfo, _shareInfoFriend);
          
      })
  },
  wxshare: function(_shareInfo, _shareInfoFriend) {
      wx.onMenuShareTimeline({
          title: _shareInfo.title,
          link: _shareInfo.link,
          imgUrl: _shareInfo.imgUrl,
          success: function() {
              shareSuscessCall();
              GATRACKING.GAEvent('success', 'shareWX_timeline', 'share');

          },
          cancel: function() {
             
          }
      });
      wx.onMenuShareAppMessage({
          title: _shareInfoFriend.title,
          desc: _shareInfoFriend.desc,
          link: _shareInfoFriend.link,
          imgUrl: _shareInfoFriend.imgUrl,
          type: "",
          dataUrl: "",
          success: function() {
              GATRACKING.GAEvent('success', 'shareWX_appmsg', 'share');
          },
          cancel: function() {

          }
      })
  }
};