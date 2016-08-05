/*输入框的点击文字显示与隐藏开始*/
   var oValue=$('.Search_box input.txt').val();  //处理表单元素，不传参数得到元素的值
   $('.Search_box input.txt').focus(function(){               
		    $(this).val('');
            $('.Search_box .historyRecord').css('display','block');		
	   
   })
   
   $('.Search_box input.txt').blur(function(){   //获得焦点时 
		   $(this).val(oValue);
		   $('.Search_box .historyRecord').css('display','none');	
   })

/*输入框的点击文字显示与隐藏结束*/



/*悬浮框导航的js部分开始*/
	   var oValue=$('.mainCon .search input.txt').val();  //处理表单元素，不传参数得到元素的值
	   $('.mainCon .search input.txt').focus(function(){
				$(this).val('');
				$('.mainCon .search .historyRecord').css('display','block');		
		   
	   })
	   
	   $('.mainCon .search input.txt').blur(function(){   //获得焦点时 
			   $(this).val(oValue);
			   $('.mainCon .search .historyRecord').css('display','none');	 
	   })
   
	   $(window).on('scroll',function(){
		    var top=$(window).scrollTop();
			if( top>800){
				$('#scrollNav').show();
			}else{
				$('#scrollNav').hide();
			} 
	   });

/*悬浮框导航的js部分结束*/
	var aFocusBtn=$('.middle .But');                   //获取到小圆点
	var aFocusBanner=$('.middle .scroll img');

	aFocusBtn.on('click','span',function(){            //增加click事件
		//console.log($(this).index());
		aFocusBtn.find('span').removeClass('hover');   //删除span的hover
		$(this).addClass('hover');                     //当前span添加hover
		
		aFocusBanner.eq($(this).index()).animate({'left':'0px'});
	})




/*banner图区域的开始*/
var _index=0;  // 定义一个变量_index并且使序列号的值为0，当前一张的序列号
var _qindex=0;  // 序列号对应的图片,前一张图片的序列号
var clearTime = null;  // 定义一个变量,清除我们的定时器，当鼠标按到按钮时，与自动轮播发生冲突

$(".But span").mouseover(function(){
	clearInterval(clearTime); // 清除定时，当鼠标放上到按钮时，暂停自动播放，显示当前对应序列号的图片
   // 当鼠标滑到按钮时，显示的颜色 siblings找到除了它之外的同等级span标签的元素
    _index=$(this).index();// 获取序列号$(this)代表的是鼠标滑到这个span标签，并且获取他的一个序列号
    scrollPlay();  // 调用滚动的函数，向左向右滚动,调用播放的方法
   _qindex=_index;  //，当前的一张图片，会做下一张的图片的前一张图片，把当前图片的序列号的值赋为下一次的前一个序列号
    //alert(_index);
}).mouseout(function(){
   autoPlay(); //启动定时器
});
/*首页轮播特效的结束*/
// 右切换按钮
$(".middle a.next").click(function(){
    _index++;   // 序列号加1
	if(_index>5){  // 如果按钮序列号大于5的话，那么当前的序列号为0
	  _index=0;   // 当前的一个序列号为0
	  _qindex=5;  // 前一个序列号为5
	}
	scrollPlay();
    _qindex=_index;  // 把现在的序列号赋给当前的一个序列号，前一个序列号等于现在这一个了的 ,这里要注意的是把默认的a链接鼠标点击跳转给忽略掉a链接里面要么写#要么写添加一javasript:void(0)

});

$(".middle a.pre").click(function(){
    _index--;
	if(_index<0){  // 如果序列号小于0的话，按左按钮到最后一张，图片往右走
        _qindex=0; // 前面的一张序列号为0
		_index=5;  // 当前的这一张序列号为5；


	}
	 scrollPlay();
     _qindex=_index;
      
});
autoPlay();// 一开始就执行动画
// 自动轮播定义一个函数,执行向右的图片
function autoPlay(){
	// 设置定时器
	clearTime=setInterval(function(){
	    _index++;
        if(_index>5){  // 如果按钮序列号大于5的话，那么当前的序列号为0
	   _index=0;   // 当前的一个序列号为0
	   _qindex=5;  // 前一个序列号为5
	 }
	 scrollPlay();
     _qindex=_index;  // 把现在的序列号赋给当前的一个序列号，前一个序列号等于现在这一个了的 ,这里要

	 },2000);
}

// 封装一个函数，把相同的代码给封装起来
function scrollPlay(){
	$(".But span").eq(_index).addClass("hover").siblings("span").removeClass("hover");//右切换按钮与底下的按扭相对应
	if(_index==0 && _qindex==5){
          $(".scroll img").eq(_qindex).animate({"left":"-715px"},300);
		  $(".scroll img").eq(_index).css("left","715px").animate({"left":"0px"},300);
	}else if(_index==5 && _qindex==0){
	   prev();
	    
	}
	
	  else if(_index>_qindex){  // 如果当前的点击按钮这个序列号大于之前的按钮序列号，往左移
      //document.title="前"+_qindex+"现"+_index;
      next();     // 调用向左移的方法
  
   }else if(_index<_qindex){  // 如果当前的按钮时小于之前的按钮，图片往右移
      prev();    // 调用向前移动的方法
    }
}

// 向下一张移动，也就是往左移动，可以把以上的代码在进行封装，封装成一个函数
function next(){
    $(".scroll img").eq(_qindex).animate({"left":"-715px"},300);  // 如果_qindex=0代表的是第一张图片,找到这这张图片，并且吧它向左移820px,把前一张图片移走
    $(".scroll img").eq(_index).css("left","715").animate({"left":"0px"},300); // 当我们是要找到这张图片时，与当前鼠标点击的相同的序列号时，然后把它给移出来,把当前的一张图片给移出来,这个也是一样设置一下样式，保证图片从右边出来
  

};
// 上一张，右移
function prev(){
   $(".scroll img").eq(_qindex).animate({"left":"715px"},300);   // 图片往右移，前一张的图片往右移
   $(".scroll img").eq(_index).css("left","-715px").animate({"left":"0px"},300);     // 在这移动之前还要确定一下是否在左边，所以我们把这个CSS样式设置一下，保证图片时从左边出来的
}

// 按钮的显示隐藏
$(".middle").hover(function(){
	 //鼠标放上去时显示左右的按钮
	 $("a.prev,a.next").show();
},function(){
      // 鼠标移开时隐藏左右的按钮
	  $("a.prev,a.next").hide();
});


/*banner图区域的结束*/








