var GATRACKING={
  GAPageView:function(_pagename){
    if ($('.wrap').hasClass('forwechat')){
        // ga('set', 'page', _pagename);
        ga('send', 'pageview', _pagename);
    } else {
        gtag('config','UA-113066819-1',{'page_title':_pagename});
    }
  },
  GAEvent:function(_eventAction, _eventCategory, _eventLable){
      // GATRACKING.GAEvent('category', 'Click', 'Rules');
      // ga('send', 'event', _eventCategory, _eventAction, _eventLable);
      if ($('.wrap').hasClass('forwechat')){
          ga('send', 'event', _eventAction, _eventCategory, _eventLable);
      } else {
          gtag('event',_eventAction,{'event_category':_eventCategory,'event_label':_eventLable});
      }
  },
}


var _ua = navigator.userAgent.toLowerCase();
var TOUCHEVENT = {
  touchstart: "touchstart",
  touchmove: "touchmove",
  touchend: "touchend",
  isdesktop:_ua.indexOf('android')>-1 ||_ua.indexOf('linux')>-1 ||_ua.indexOf('mobile')>-1 ||_ua.indexOf('iphone')>-1 ||_ua.indexOf('ipad')>-1 ? false : true,
  initTouchEvents: function () {
      if (TOUCHEVENT.isdesktop) {
        this.touchstart = "mousedown";
        this.touchmove = "mousemove";
        this.touchend = "mouseup";
      }
  },

};

var isLocahost = (window.location.port.indexOf('8080') != -1) || (window.location.port.indexOf('8081') !=-1);
var basePath = isLocahost ? '../img/' : 'img/',
    baseJSticket = '/api/auth/wxShare',
    domain = '/api/testDrive/';

var ford={
  isWX: (/micromessenger/.test(_ua)) ? true : false,
  isAndroid:_ua.indexOf('android') > -1,
};

if(ford.isAndroid) {
  document.write('<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">');
}

var _url = window.location.href.split("#")[0];
var shareInfo = {
    title: "长安福特进无止境",
    desc: "长安福特进无止境",
    link: _url,
    imgUrl: "https://www.cafsecure.ford.com.cn/wechat_ford/img/logo.jpg"
  },
  shareInfoFriend = shareInfo;

// console.log = function () {};
var pageSlider;
var data = {
  username: '',
  mobile: '',
  car_type: '',
  buy_time: '',
  province: '',
  city: '',
  dealer: '',
  utm_source: '',
  memo1: '',
  memo9: '',
  memo10: ''
};
var postFlag = true;
$(document).ready(function(){
  var firstFlag = localStorage.getItem('firstLogin')
  console.log(firstFlag)
  if (firstFlag == 'true'){
    // localStorage.removeItem("firstLogin");
    // $('.nev-wrap').addClass('hiding');
    // $('.page').removeClass('active');
  } else {
    localStorage.setItem('firstLogin', 'true');
    if ($('.wrap').find('.nev-wrap').length > 0){
      $('.nev-wrap').removeClass('hiding');
      $('.page').addClass('active');
      $('.popup').removeClass('hiding');
    }
  }
  
  console.log('ready');

  initWXshare();

  $('.menu a').on('click', function(){
    var gaLabel = $(this).data('ga');
    GATRACKING.GAEvent(gaLabel, 'Navigation', 'Click');
  });

  $('.btn-nev').on('click', function(){
    $('.nev-wrap').removeClass('hiding');
    $('.page').addClass('active');
    $('.popup').removeClass('hiding');
    $('.wrap').addClass('active');

    GATRACKING.GAEvent('MenuBar', 'Navigation', 'Click');
  });

  $('.popup').on('click', function(){
    $('.nev-wrap').addClass('hiding');
    $('.page').removeClass('active');
    $(this).addClass('hiding');
    $('.wrap').removeClass('active');
  });

  $(document).delegate('.open-article', 'click', function(){
    postReadCount($(this));
  });

  $(document).delegate('.goBack', 'click', function(){
    window.history.back(-1);
  });

  // $(document).delegate('.play-video', 'click', function(){
  //   // console.log($(this).data('url'))
  //   var videoID = 'video-'+$(this).data('url');
  //   $('#'+videoID).removeClass('hiding');
  //   document.getElementById(videoID).play();
  // })

  if ($('.wrap').hasClass('culture')){
    GATRACKING.GAPageView('Culture');
    $('.banner').on('click', function(){
      var ga = $(this).data('ga');
      if (ga != ''){
        GATRACKING.GAEvent(ga, 'Culture', 'Click');
      }
    })
  }

  if ($('.wrap').hasClass('history')){
    GATRACKING.GAPageView('CultureDetail');
  }

  if ($('.wrap').hasClass('activity')){
    if ($('.wrap').hasClass('forwechat')){
        GATRACKING.GAPageView('/Activity');
    } else {
        GATRACKING.GAPageView('Activity');
    }
    $('.banner').on('click', function(){
      var ga = $(this).data('ga');
      if (ga != ''){
        if ($('.wrap').hasClass('forwechat')){
            GATRACKING.GAEvent('/Activity', ga, 'Click');
        } else {
            GATRACKING.GAEvent(ga, 'Activity', 'Click');
        }
      }
    })
  }

  if ($('.wrap').hasClass('series')){
    GATRACKING.GAPageView('Topics');
    getArticleCatgory();
    $(document).delegate('.banner', 'click', function(){
      var ga = $(this).data('ga');
      GATRACKING.GAEvent(ga, 'Topics', 'Click');
    })
  }

  if ($('.wrap').hasClass('series-detail')){
    // var id = window.location.hash.split("#")[1];
    var id = getQueryString('id');
    var topics = getQueryString('topics'),
        topicsIndex = topics.split('Topics')[1];
    getArticleInfo(id);
    GATRACKING.GAPageView(topics);
    $(document).delegate('.banner', 'click', function(){
     var _index = $(this).data('index');
     var ga = 'T'+ topicsIndex + 'B'+_index;
     GATRACKING.GAEvent(ga, topics, 'Click');
    })
  }

  if ($('.wrap').hasClass('type')){

    if ($('.wrap').hasClass('forwechat')){
        GATRACKING.GAPageView('/Models');

        var openid = getQueryString("openId");
        var medium = getQueryString("utm_source");
        if (openid != null && openid != undefined && medium != null && medium != undefined){
            $('.banner').each(function () {
                var link = $(this).attr('href');
                link = link + '&openId=' + openid + '&utm_source=' + medium;
                $(this).attr('href', link);
            })
        }
    } else {
        GATRACKING.GAPageView('Models');
    }
    $(document).delegate('.banner', 'click', function(){
      var ga = $(this).data('ga');
      if ($('.wrap').hasClass('forwechat')){
          GATRACKING.GAEvent('/Models', ga, 'Click');
      } else {
          GATRACKING.GAEvent(ga, 'Models', 'Click');
      }
    })
  }

  if ($('.wrap').hasClass('promotion')){
    if ($('.wrap').hasClass('forwechat')){
        GATRACKING.GAPageView('/Promotion');
    } else {
        GATRACKING.GAPageView('Promotion');
    }

    $(document).delegate('.banner', 'click', function(){
      var ga = $(this).data('ga');
        if ($('.wrap').hasClass('forwechat')){
            if (ga == 'NewMondeo'){
                ga = ga.replace(/New/g, '');
            }
            GATRACKING.GAEvent('/Promotion', ga, 'Click');
        } else {
            GATRACKING.GAEvent(ga, 'Promotion', 'Click');
        }
    })
  }

  if ($('.wrap').hasClass('dealer')){

    if ($('.wrap').hasClass('forwechat')){
        GATRACKING.GAPageView('/TD');
    } else {
        GATRACKING.GAPageView('TestDrive');
    }

    var utm_source = getQueryString('utm_source'),
        utm_content = getQueryString('utm_content');
    var memo1 = '',
        memo9 = '',
        memo10 = '',
        eventCode = '1505359246587';

    var canSelect = false;
    if(utm_source != 'WechatMoment_APP'){
      utm_source = '微信订阅号';
    }

    if ($('.wrap').hasClass('dealer') && $('.wrap').hasClass('forwechat')){
      if(utm_content == '' || utm_content == null || utm_content == undefined){
        memo1 = '2018年长安福特微客服预约试驾',
        memo9 = '1801CAFServiceAccountTestDrive_2018',
        memo10 = '无';
        eventCode = '1429071041696';
        utm_source = 'CAFServiceAccount';
      } else {
        memo1 = '2018年翼虎1月网络投放',
        memo9 = '1801Kuga_NetworkDelivery_Jan2018',
        memo10 = utm_content;
        eventCode = '1429071041696';
        utm_source = 'CAFServiceAccount';
      }
    } else {
      if(utm_content == '' || utm_content == null || utm_content == undefined){
        memo1 = '2018年福特微信订阅号预约试驾',
        memo9 = '1801FordWechatTestDrive_2018',
        memo10 = '无';
      } else {
        memo1 = '2018年翼虎1月网络投放',
        memo9 = '1801Kuga_NetworkDelivery_Jan2018',
        memo10 = utm_content;
      }
    }
    

    $('.car-type').on('change', function(){
      canSelect = true;
    })

    $('.check').on('click', function(){
      if (!canSelect){
        alert('请选择车型');
      }
    })

    getProvince();

    $('#province').on('change', function(){
      resetOption();
      getCity($(this).val().toString());
    })

    $('#city').on('change', function(){
      getDealer($(this).val().toString());
    })

    $('select').on('change', function(){
      $(this).removeClass('default');
    })

    $('.form-submit').on('click', function(){
      data = {
        username: $('.userName').val(),
        mobile: $('.userTel').val(),
        car_type: $('.car-type').val(),
        buy_time: $('.buy-time').val(),
        province: $('#province').val(),
        city: $('#city').val(),
        dealer: $('#dealer').val(),
        utm_source: utm_source,
        memo1: memo1,
        memo9: memo9,
        memo10: memo10,
        eventCode: eventCode
      };


      if ($('.wrap').hasClass('forwechat')){
          GATRACKING.GAEvent('/TD', 'TestDrive', 'Click');
      } else {
          GATRACKING.GAEvent('Submit', 'TestDrive', 'Click');
      }


      var regName = /^\d+(\.\d+)?$/; 
      var regTel = /^[1][3,4,5,7,8][0-9]{9}$/; 
      if (data.username == ''){
        alert('请输入您的姓名')
      } else if (regName.test(data.username) == true){
        alert('请填写正确的姓名')
      } else if (regTel.test(data.mobile) == false || data.mobile.length < 11){
        alert('请填写正确的手机号码')
      } else if (data.car_type == ''){
        alert('请选择车型')
      } else if (data.buy_time == ''){
        alert('请选择购车时间')
      } else if (data.province == ''){
        alert('请选择省份')
      } else if (data.city == ''){
        alert('请选择城市')
      } else if (data.dealer == ''){
        alert('请选择经销商')
      } else {
        if (postFlag){
          postForm();
        }
      }

    })
  }

  if ($('.wrap').hasClass('carTypeDetail')){
    // var hash = window.location.hash.split('#')[1];
    var hash = getQueryString('type');

    if ($('.wrap').hasClass('forwechat')){
        switch (hash){
            case 'ecoSport':
                GATRACKING.GAPageView('/Ecosport');
                break;

            case 'edge':
                GATRACKING.GAPageView('/Edge');
                break;

            case 'escort':
                GATRACKING.GAPageView('/Escort');
                break;

            case 'focus':
                GATRACKING.GAPageView('/Focus');
                break;

            case 'kuga':
                GATRACKING.GAPageView('/Kuga');
                break;

            case 'mondeo':
                GATRACKING.GAPageView('/Newmondeo');
                break;

            case 'taurus':
                GATRACKING.GAPageView('/Taurus');
                break;
        }
    } else {
        switch (hash){
            case 'ecoSport':
                GATRACKING.GAPageView('Ecosport');
                break;

            case 'edge':
                GATRACKING.GAPageView('Edge');
                break;

            case 'escort':
                GATRACKING.GAPageView('Escort');
                break;

            case 'focus':
                GATRACKING.GAPageView('Focus');
                break;

            case 'kuga':
                GATRACKING.GAPageView('Kuga');
                break;

            case 'mondeo':
                GATRACKING.GAPageView('Newmondeo');
                break;

            case 'taurus':
                GATRACKING.GAPageView('Taurus');
                break;
        }
    }


    $.ajax({
      type:'get',
      dataType: 'json',
      url: "js/detail.json",
      success: function(res) {
        
        var data = res.carType[hash];
        // console.log(data)
  
        $('.page-title p').html(data.title);
        $('.car-banner img').attr('src' , data.banner);
        $('.price').html(data.price);
        $('.configure img').attr('src' , data.configure);
        data.strength.map(function(value, index){
          $('.strength-content').append(
            "<div class='swiper-slide'>"+
              "<img src='"+ value.img +"')>"+
              "<div class='text-content'>"+
                "<p class='title'>"+ value.title +"</p>"+
                "<p class='text'>"+ value.text +"</p>"+
              "</div>"+
            "</div>");
        });
        $('.show-car img').attr('src', data.show);
        // $('.show-car video').attr('poster', data.video_poster);
        if (typeof(data.video_link) == 'string'){
          // console.log(data.video_link)
          if (data.video_link != ''){
            $('.video-wrap').append(
              "<video controls id='video' preload='auto' poster='"+ data.video_poster +"' x5-video-player-type='h5' x5-video-player-fullscreen='true'>"+
                "<source src='"+ data.video_link +"' type='video/mp4'>"+
              "</video>"
              // "<img class='play-video' data-url='' src='"+ data.video_poster +"'>"
            );
          }
        } else if (typeof(data.video_link) == 'object'){
          data.video_link.map(function(value, index){
            if (index == 0){
              $('.video-wrap').append(
                "<div class='swiper-slide'>"+
                  "<video controls id='video-"+ index +"' preload='auto' poster='"+ data.video_poster +"' x5-video-player-type='h5' x5-video-player-fullscreen='true'>"+
                    "<source src='"+ value +"' type='video/mp4'>"+
                  "</video>"+
                  // "<img class='play-video' data-url='"+ index +"' src='"+ data.video_poster +"'>"+
                "</div>");
            }
          })
          // $('.video-wrap').removeClass('single-video');
          // $('.video-pagination').removeClass('hiding');
          // var pageSlider = new Swiper('.video-container', {
          //   loop: true,
          //   pagination: {
          //     el: '.video-pagination',
          //   },
          // });
        }
        $('.configure-title').html(data.configure_detail.title);
        data.configure_detail.clickTag.map(function(value, index){
          var link = value.link;
          if ($('.wrap').hasClass('forwechat')){
            link = link.replace(/configureDetail/g, 'wechat-configureDetail');
          }
          $('.configure-content').append(
            "<div class='swiper-slide'>"+
              "<img src='"+ value.img +"')>"+
              "<div class='text-content'>"+
                "<p class='name'>"+ value.name +"</p>"+
                "<a href='"+ link +"'>详细配置表</a>"+
              "</div>"+
            "</div>");
        });
        $('.btn-more').attr('href', data.more);
        var pageSlider = new Swiper('.strength-wrap', {
          loop: true,
          pagination: {
            el: '.strength-pagination',
          },
        });
        var pageSlider2 = new Swiper('.configure-wrap', {
          loop: true,
          pagination: {
            el: '.configure-pagination',
          },
        });
        if (hash == 'focus' || hash == 'mondeo'){
          $('.configure-pagination').addClass('more-car');
        }
        $(document).delegate('.btn-more', 'click', function () {
          GATRACKING.GAEvent('/Models', 'Official', 'Click');
        })
      },
      fail: function (res) {
        // alert(JSON.stringify(res));
      }
    });
  }

  if ($('.wrap').hasClass('serve')){
    GATRACKING.GAPageView('CarOwnerService');
  }

  if ($('.wrap').hasClass('benefit')){
    GATRACKING.GAPageView('CarOwnerWelfare');
    $(document).delegate('.banner', 'click', function(){
      var ga = $(this).data('ga');
      GATRACKING.GAEvent(ga, 'CarOwnerWelfare', 'Click');
    })
  }

  if ($('.wrap').hasClass('configureDetail')){

    // var statusBar = window.screen.height - window.innerHeight;
    var type = getQueryString('type'),
        id = getQueryString('carID');
    getModelInfo(type, id);

    var openFlag = false;
    $(document).delegate('.part-content', 'click', function(){
      openFlag = !openFlag;
      if (openFlag){
        $('.configure-detail-wrap').addClass('active');
      } else {
        $('.configure-detail-wrap').removeClass('active');
      }
    });

    if (type == 'focus'){
      $('.configure-list .tip').html('“S” - 标准配置，“-” - 无此配置，“O” - 选装配置，<br>“O1” - 智能安全选装包A，“O2” - 智能安全选装包B。');
    }

    var margin = 0;
    $(document).delegate('.go-detail', 'click', function(){
      var $el = $(this)
      var divID = $el.data('id');
      divTop = parseInt(document.getElementById(divID).offsetTop)
      // console.log(divTop)
      if ($('.car-image').hasClass('close')){
        if (ford.isAndroid){
          divTop = divTop - $('.car-image').height() - 95 - 50 +49;
        } else {
          divTop = divTop - $('.car-image').height() - $('.configure-list').height() - 50 +49;  //50 padding-top  49 calc(100% - 49px)不计算49
        } 
      } else {
        if (ford.isAndroid){
          divTop = divTop - ($('.car-image').height()-60) - 95 - 50 +49; //60 折叠后高度
        } else {
          divTop = divTop - ($('.car-image').height()-60) - $('.configure-list').height() - 50 +49; //60 折叠后高度
        }
      }
      $('.content').scrollTo({
        durTime: 100,
        toT: divTop,
        callback: function(){
          $('.configure-detail-wrap').removeClass('active');
          // $('.configure-detail-container').addClass('show-detail');
          setTimeout(function(){
            $('.part-content span').html($el[0].innerHTML);
          },300);
          openFlag = false;
        }
      });
    })

    $('.content').on('scroll', function() {
      // console.log(document.getElementById('content').scrollTop);
      if ($('.car-image').hasClass('close')){
        if (document.getElementById('content').scrollTop <= 35){
          $('.car-image').removeClass('close');
          $('.configure-detail-container').removeClass('show-detail');
          if (!isSupportSticky()){
            $('.car-image').removeClass('notsticky');
            $('.configure-list').removeClass('notsticky');
          }
        }
      } else {
        if (document.getElementById('content').scrollTop > 150){
          $('.car-image').addClass('close');
          $('.configure-detail-container').addClass('show-detail');
          if (!isSupportSticky()){
            $('.car-image').addClass('notsticky');
            $('.configure-list').addClass('notsticky');
          }
        }
      }

      // 284   $('.header-wrap').height() = 95  +  $('.page-title').height() = 60 +  $('.car-image').height() = 49  +   $('.configure-list').height() = 80
      // 10 提前10px 触发
      //  parseInt($('#detail'+i).height()  detail区块高度
      for(var i=0; i<$('.configure-detail-content').length; i++){
        if (parseInt($('#detail'+i).offset().top)-284 <= 10 && parseInt($('#detail'+i).offset().top)-284 >= 10-(parseInt($('#detail'+i).height()))){
          $('.part-content span').html($('#detail'+i).find('.config-title')[0].innerHTML);
        }
      }
    });
  }
});


document.ondblclick = function(e){
  e.stopPropagation();
  e.preventDefault();
  return false;
};

function initSlider() {
  pageSlider = new Swiper('.swiper-container', {
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'fraction',
    },
  });
}

function getProvince(){
  var data = new Date(),
  temp = data.getTime();
  console.log(temp);
  $.ajax({
    type:'get',
    dataType: 'json',
    url: domain+"GetProvince?v="+temp,
    // data: {url: _url},
    success: function(res) {
       console.log(res)
       res.data.forEach(function(value){
        document.getElementById("province").options.add(new Option(value,value)); 
       });
    },
    fail: function (res) {
      alert(JSON.stringify(res));
    }
  });
}

function getCity(province){
  $.ajax({
    type:'get',
    dataType: 'json',
    url: domain+"GetCity?province="+province,
    // data: {url: _url},
    success: function(res) {
      document.getElementById("city").options.length=1;
      res.data.forEach(function(value){
        document.getElementById("city").options.add(new Option(value,value)); 
      });
    },
    fail: function (res) {
      alert(JSON.stringify(res));
    }
  });
}

function getDealer(city){
  $.ajax({
    type:'get',
    dataType: 'json',
    url: domain+"GetDealer?city="+city,
    // data: {url: _url},
    success: function(res) {
      document.getElementById("dealer").options.length=1;
      console.log(res)
      res.data.forEach(function(value){
        document.getElementById("dealer").options.add(new Option(value.dealer,value.dealer)); 
      });
    },
    fail: function (res) {
      alert(JSON.stringify(res));
    }
  });
}

function resetOption(){
  document.getElementById("city").options.length=1;
  document.getElementById("dealer").options.length=1;
}

function postForm(){
  postFlag = false;
  $.ajax({
    type:'post',
    dataType: 'json',
    url: domain+"Submit",
    data: data,
    success: function(res) {
      console.log(res)
      if (res.errcode == 0){
        postFlag = true;
        alert('提交成功')
      } else {
        postFlag = true;
        alert('重复手机号,提交失败')
      }
    },
    fail: function (res) {
      alert(JSON.stringify(res));
    }
  });
}

function getArticleCatgory(){
  $.ajax({
    type:'get',
    dataType: 'json',
    url: "/api/article/GetArticleCatgory",
    success: function(res) {
      console.log(res)
      if (res.errcode == 0){
        res.data.map(function(value, index){
          console.log(value)
          var desc = value.cat_title +'<br>'+ value.cat_desc
          $('.content').append(
            "<a class='banner' data-ga='Topic"+ (index+1) +"' href='html/seriesDetail.html?id="+ value.id +"&topics=Topics"+ (index+1) +"'>" +
              "<img src='"+ value.cat_img +"'>"+
              "<div class='text'>"+
                "<p class='title'>"+ value.cat_name +"</p>"+
                "<div class='copy'>"+
                  "<p>"+ desc +"</p>"+
                "</div>"+
              "</div>"+
              "<span class='readNum'>"+ 
                "<span class='icon_read'>"+
                  "<img src='img/btn_read.jpg'>"+
                "</span>"+
                "<span class='num'>"+ value.readcount +"</span>"+
              "</span>"+
            "</a>");
        });
      }
    },
    fail: function (res) {
      alert(JSON.stringify(res));
    }
  });
}

function getArticleInfo(id){
  $.ajax({
    type:'get',
    dataType: 'json',
    url: "/api/article/GetArticleInfo?id=" + id,
    success: function(res) {
      console.log(res)
      if (res.errcode == 0){
        $('.page-title p').html(res.cat_title);
        res.data.map(function(value, index){
          console.log(value)
          $('.content').append(
            "<a class='banner open-article swiper-slide' data-index='"+ (index+1) +"' data-url='"+ value.article_link +"' data-id='"+ value.id +"'>"+
              "<img src='"+ value.article_img +"'>"+
              "<div class='text'>"+
                "<p class='title'>"+ value.title +"</p>"+
                "<div class='copy'>"+
                  value.content +
                "</div>"+
              "</div>"+
              "<span class='readNum'>"+ 
                "<span class='icon_read'>"+
                  "<img src='img/btn_read.jpg'>"+
                "</span>"+
                "<span class='num'>"+ value.view_count +"</span>"+
              "</span>"+
            "</a>");
        });
        if (res.data.length > 1){
          initSlider();
        } else {
          $('.swiper-control').addClass('hiding');
        }
        
      } else if (res.message){
        $('.swiper-control').addClass('hiding');
        alert(res.message);
      }
    },
    fail: function (res) {
      alert(JSON.stringify(res));
    }
  });
}

function postReadCount(el){
  var id = el.data('id'),
      link = el.data('url');
  $.ajax({
    type:'get',
    dataType: 'json',
    url: "/api/article/ReadArticle?id=" + id,
    success: function(res) {
      console.log(res)
      window.location.href = link;
    },
    fail: function (res) {
      alert(JSON.stringify(res));
    }
  });
}

function getModelInfo(type, id){
  $.ajax({
    type:'get',
    dataType: 'json',
    url: "js/detail.json",
    success: function(res) {
      // console.log(res.carType[type].configure_detail.clickTag)
      var sameID = 0;
      res.carType[type].configure_detail.clickTag.map(function(value){
        if(value.id == id){
          sameID++;
          $('.car-image img').attr('src', value.img);
          var reg = value.name;
          if (sameID >= 2){
            reg = reg.replace(/(自动|手动)/g, '');
          }
          $('.cat-name').html(reg);
        }
      });
    },
    fail: function (res) {
      // alert(JSON.stringify(res));
    }
  });


  $.ajax({
    type:'get',
    dataType: 'json',
    url: "/api/carmodel/GetInfo?id=" + id,
    success: function(res) {
      console.log(res)
      if (res.errcode == 0){
        for (var i=0; i<Object.keys(res.data).length; i++){
          var title = Object.keys(res.data)[i];
          $('.part-content span').html(Object.keys(res.data)[0]);
          $('.detail-list').append(
            "<li>"+
              "<a href='javascript:void(0)' class='go-detail' data-id='detail"+ i +"'>"+ title +"</a>"+
            "</li>"
          )
          $('.configure-detail-container').append(
            "<div class='configure-detail-content' id='detail"+ i +"'>"+
              "<span class='config-title'>"+ title +"</span>"+
              "<table cellspacing='0' cellpadding='0'>"+
                "<tbody></tbody>"+
              "</table>"+
            "</div>"
          );

          res.data[title].map(function(value, index){
            $('#detail'+ i +' tbody').append(
              "<tr>"+
                "<td>"+ value.model_infoname +"</td>"+
                "<td>"+ value.model_info_content +"</td>"+
              "</tr>"
            );
          });
        }
      }
    },
    fail: function (res) {
      // alert(JSON.stringify(res));
    }
  });
}

function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
      return unescape(r[2]);
  }
  return null;
}

function initWXshare(){
  WECHARCONFIG.wxconfig(_url, baseJSticket, shareInfo, shareInfoFriend);
}

(function(){
  window.alert = function(name){
  var iframe = document.createElement("IFRAME");
  iframe.style.display="none";
  iframe.setAttribute("src", 'data:text/plain');
  document.documentElement.appendChild(iframe);
  window.frames[0].window.alert(name);
  iframe.parentNode.removeChild(iframe);
  }
})();


$.fn.scrollTo =function(options){
  var defaults = {
      toT : 0,    //滚动目标位置
      durTime : 500,  //过渡动画时间
      delay : 30,     //定时器时间
      callback:null   //回调函数
  };
  var opts = $.extend(defaults,options),
      timer = null,
      _this = this,
      curTop = _this.scrollTop(),//滚动条当前的位置
      subTop = opts.toT - curTop,    //滚动条目标位置和当前位置的差值
      index = 0,
      dur = Math.round(opts.durTime / opts.delay),
      smoothScroll = function(t){
          index++;
          var per = Math.round(subTop/dur);
          if(index >= dur){
              _this.scrollTop(t);
              window.clearInterval(timer);
              if(opts.callback && typeof opts.callback == 'function'){
                  opts.callback();
              }
              return;
          }else{
              _this.scrollTop(curTop + index*per);
          }
      };
  timer = window.setInterval(function(){
      smoothScroll(opts.toT);
  }, opts.delay);
  return _this;
};

function isSupportSticky() {//判断是否支持sticky
  var prefixTestList = ['', '-webkit-'];
  var stickyText = '';
  for (var i = 0; i < prefixTestList.length; i++ ) {
    stickyText += 'position:' + prefixTestList[i] + 'sticky;';
  }
  // 创建一个dom来检查
  var div = document.createElement('div');
  div.style.cssText = stickyText;
  document.body.appendChild(div);
  var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
  document.body.removeChild(div);
  div = null;
  return isSupport;
}