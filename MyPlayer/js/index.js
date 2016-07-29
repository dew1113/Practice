function player(){
		this.linkCss();
        this.renderHtml();
        this.curId = null;
        this.draging=false;
        this.lyric=true;   //是否显示歌词
        this.playing=false;  //是否播放状态
        this.volume=0.6;  //当前音量
        this.bind();  //绑定各类点击事件
        this.getChannels();
        this.getMusic();
        this.lyricArr=[];
        this.drag($('#player'));
   
	};

player.prototype={
	linkCss:function(){
		var link='<link rel="stylesheet" href="css/style.css"> ';
        var icontLink='<link rel="stylesheet" href="css/iconfont.css">';
		$('head').append(link);
        $('head').append(icontLink);
	},
	renderHtml:function(){
		var playHtml='';
        playHtml +='<div id="player" class="clearfix">'+
     '<audio id="buff" src="" autoplay="true">'+
        'Your browser does not support the audio tag'+
    '</audio>'+
    '<div id="toggle">'+
       ' <i class="iconfont music">&#xe6b5;</i>'+
       ' </div>'+
        '<div class="control-tab" class="clearfix">'+
            '<div class="menu-bar">'+
               ' <ul class="list-ct"></ul>'+
            '</div>'+
            '<div class="main" class="clearfix">'+
                '<div class="cover"></div>'+
               ' <div class="music-bg"></div>'+
                '<i class="iconfont volume">&#xe6ca;</i>'+
                '<div class="vol-ct">'+
                    '<span class="vol-outline">'+
                        '<span class="vol"></span>'+
                        '<span class="vol-after"></span>'+
                    '</span>'+
                '</div> '+
                '<div class="lrc-ct">'+
                   '<div class="song-name"></div>'+
                   '<div class="song-artist"></div>'+
                    '<div class="lrc-box" class="clearfix">'+
                   ' <ul class="lyric-ct"></ul>'+
                    '</div>'+
                '</div>'+
               ' <div class="progress">'+
                '<span class="time-outline">'+
                    '<span class="time"></span>'+
               ' </span>'+
                '<span class="time-num">'+
                    '<span class="curTime">00:00</span>'+
                    '<span class="durTime">00:00</span>'+
               ' </span>'+
                '<i class="iconfont lrc">&#xe7e1;</i>'+
                '</div>'+
           ' </div>'+
            '<div class="footer" class="clearfix">'+
                '<i class="iconfont play">&#xe651;</i>'+
                '<i class="iconfont next">&#xe714;</i>'+
                '<i class="iconfont menu">&#xe673;</i>'+
            '</div>'+
       ' </div>'+
    '</div>';
    $('body').append(playHtml);
  },
	bind:function(){
		var _this=this;
		$('#toggle').on('dblclick',function(e){   //控制主面板出现
			e.preventDefault();
			$('.control-tab').slideToggle();	
        });
        
        $('#buff').on('canplay',function(){      //显示歌曲总长度
        	_this.setDuration();
           
        })
        $(".menu").on("click",function(){          //频道列表出现/隐藏
            $(".menu-bar").animate({right:0},500);
        });
		$(".menu-bar").on("mouseleave",function(){
            $(".menu-bar").animate({right:'-110px'},500);
        });

       
        $('.list-ct').on("click","li",function() {        //选择频道
            $(this).addClass("active").siblings().removeClass("active");
            var curId = $(this).attr("data-id");
            _this.playing = false;
            _this.getMusic(curId);
        });
        
       
        $('.main .lrc').on('click',function(){        // 点击 开/关歌词      
          if(_this.lyric){
            this.innerHTML='&#xe7e2;'
            $('.main .lyric-ct').hide();
            _this.lyric=false;
          }else{
            this.innerHTML='&#xe7e1;'
            $('.main .lyric-ct').show();
            _this.lyric=true;
          };
        });

        $(".play").on("click",function(){   //点击 播放/暂停
            if(_this.playing){
            	_this.stopPlay();
            	this.innerHTML='&#xe83a;';
            }else{
            	_this.startPlay();
            	this.innerHTML='&#xe651;';
            }
        });
        
        $('.next').on('click',function(){     //  点击下一首 
            var curId = $(this).find('.active').attr("data-id");
            _this.playing = false;
            curId++;
            _this.getMusic(curId);
        });
        
        $(".volume").on("click",function(){   //音量条出现
            $(".vol-ct").fadeToggle(500);
            $(".volume").css('cursor','pointer');
        });

        $('.vol-outline').on('click',function(e){  //  点击调节音量
            var buff=document.getElementById('buff');
            $('.vol-after').css('left', e.pageX-$(this).offset().left+'px');
            $('.vol').css('width', e.pageX-$(this).offset().left);
            _this.volume =(e.pageX-$(this).offset().left)/150;
            buff.volume=_this.volume;
        });

         $('.time-outline').on('click',function(e){  //  点击调节播放进度
            var buff=document.getElementById('buff');
            _this.currentTime=((e.pageX-$(this).offset().left)/400)*buff.duration;
            buff.currentTime=_this.currentTime;
            $('.time').css('width', e.pageX-$(this).offset().left);
            var timeNumber=_this.dealTime(_this.currentTime);
            $('.curTime').text(timeNumber);
        });
	},
	getChannels:function(){
		var _this=this;
		$.get('http://api.jirengu.com/fm/getChannels.php')
		  .done(function(msg){
                var channel = "";
                var fmInfo=JSON.parse(msg);
               //console.log(fmInfo);
                for(var i in fmInfo.channels){
                    channel += '<li data-id = '+fmInfo.channels[i].channel_id+'>'+fmInfo.channels[i].name+'</li>'
                }
                $('.list-ct').append(channel);
            });
    },
    getMusic : function(curId){
        var _this = this;
        _this.curId = curId || 2;
        $.get('http://api.jirengu.com/fm/getSong.php',{channel: _this.curId})
            .done(function(song){
                // console.log('song:'+song);
                var songData=JSON.parse(song);
                // console.log('songData:'+songData);
                if(_this.playing) return;
                for(var i in songData.song){
                    // console.log('songData.song:'+songData.song);
                    _this.data = [songData.song[i].ssid,songData.song[i].sid];
                    $(".song-name").text(songData.song[i].title);
                    $('.song-artist').text(songData.song[i].artist);
                    $(".music-bg").css({"background-image":"url("+songData.song[i].picture+")"});
                    $(".cover").css({"background-image":"url("+songData.song[i].picture+")"});
                    $('#buff').attr({'src': songData.song[i].url,'data-songId':songData.song[i].sid});
                    $('.lyric-ct').text(''); 
                    $('.lyric-ct').append("<li>Sorry~ No lyric here~</li>");
                    
                }
                _this.startPlay();
                _this.postLyric();
            })
    },
    startPlay: function() {   // 开始播放
        var buff=document.getElementById('buff');
        buff.volume=0.6;
        buff.play();
        this.playing = true;
        this.setTime();
    },
    nextPlay:function(){         //自动播放下一首
    	var _this=this;
        var buff=document.getElementById('buff');
    	if(buff.currentTime>=buff.duration){
            _this.playing=false;
            if(!_this.playing){
            	_this.getMusic(_this.curId);
               
            }
    	}
    },
    stopPlay : function(){      //暂停播放
        var buff=document.getElementById('buff');
        buff.pause();
        this.playing=false;
    },
    
    setDuration: function(){      // 获取歌曲总时长 
        var buff=document.getElementById('buff');
        var timeNumber=this.dealTime(buff.duration);
        $('.time-num .durTime').text(timeNumber);
      },

    setTime: function(){         // 定时更新播放条时间
        var _this=this;
        var buff=document.getElementById('buff');
        var clock=setInterval(function(){
          var time=buff.currentTime/buff.duration;
          var timeNumber=_this.dealTime(buff.currentTime);
          $('.curTime').text(timeNumber);
          if(time>=1){
            $('.time').css('width', '0');
          }else $('.time').css('width', 400*time);
          _this.nextPlay();
          
        },100);
      },

    dealTime: function(second){        // 传入秒数 处理成 00:00 的格式输出
        var second=parseInt(second);
        var min=Math.floor(second/60);
        var sec=second-min*60;
        if(min<10){
          min=0+String(min);
        }else min=String(min);
        if(sec<10){
          sec=0+String(sec);
        }else sec=String(sec);
        return (min+':'+sec);
    },
    postLyric : function(){
        var _this = this;
        $.post('http://api.jirengu.com/fm/getLyric.php', {ssid: _this.data[0], sid: _this.data[1]})
            .done(function (lyr) {
                var lyr = eval("(" + lyr + ")");
                // console.log(lyr);//如果不报错
                if(!!lyr.lyric){
                    $('.lyric-ct').empty();//先清空歌词内部
                    var line = lyr.lyric.split('\n');//歌词为以排数为界的数组
                    var timeReg = /\[\d{2}:\d{2}.\d{2}\]/g;//时间的正则
                    var result = [];
                    if(line != ""){
                        for(var i in line){//遍历歌词数组
                            var time = line[i].match(timeReg);//每组匹配时间 得到时间数组
                            if(!time)continue;//如果没有 就跳过继续
                            var value = line[i].replace(timeReg,"");// 纯歌词
                            for(j in time){//遍历时间数组
                                var t = time[j].slice(1, -1).split(':');//分析时间  时间的格式是[00:00.00] 分钟和毫秒是t[0],t[1]
                                //把结果做成数组 result[0]是当前时间，result[1]是纯歌词
                                var timeArr = parseInt(t[0], 10) * 60 + parseFloat(t[1]); //计算出一个curTime s为单位
                                result.push([timeArr, value]);
                            }
                        }
                    }
                    //时间排序
                    result.sort(function (a, b) {
                        return a[0] - b[0];
                    });
                    _this.lyricArr = result;//存到lyricArr里面
                    console.log(_this.lyricArr);
                    _this.renderLyric();//渲染歌词
                };
            }).fail(function(){
            $('.lyric-ct').html("<li>No Lyric~</li>");
        });
    },
    renderLyric : function(){
        var lyrLi = "";
        for (var i = 0, l = this.lyricArr.length; i < l; i++) {
            lyrLi += "<li data-time='"+this.lyricArr[i][0]+"'>"+this.lyricArr[i][1]+"</li>";
        }
        console.log(lyrLi);
        $('.lyric-ct').append(lyrLi);
        this.setShow();//怎么展示歌词
    },
    setShow : function(){
        var _this = this;
        setInterval(function(){
            _this.showLyric();
        },200)
    },
    showLyric : function(){
        var _this = this,
            liH = $(".lyric-ct li").eq(5).outerHeight(true); //每行高度
        for(var i=0;i< _this.lyricArr.length;i++){//遍历歌词下所有的li
            var curT = $(".lyric-ct li").eq(i).attr("data-time");//获取当前li存入的当前一排歌词时间
            var nexT = $(".lyric-ct li").eq(i+1).attr("data-time");
            var buff=document.getElementById('buff');
            var curTime =buff.currentTime;
            if ((curTime > curT) && (curT < nexT)){//当前时间在下一句时间和歌曲当前时间之间的时候 就渲染 并滚动
                $(".lyric-ct li").removeClass("active");
                $(".lyric-ct li").eq(i).addClass("active");
                $('.lyric-ct').css('top', -liH*(i-2));
            }
        }

    },

    drag: function($node){                        //  拖拽面板
        var _this=this;
        $node.on('mousedown',function(e){
          _this.left=e.pageX-$node.offset().left;
          _this.top=e.pageY-$node.offset().top;
          _this.draging=true;
        });
        $node.on('mouseup',function(){
          _this.draging=false;
        });
        $(window).on('mousemove',function(e){
          if(_this.draging){
            $node.css({
              left: +e.pageX-_this.left,
              top: e.pageY-_this.top
            });
          };
        });
      },
};

var myPlayer=new player();



