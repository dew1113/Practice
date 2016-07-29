var drag =function($node){
     $(this).each(function(){
     	 var _this=$(this);
     	 _this.css('position','absolute')
     	 var isMoved= false;
     	 _this.on('mousedown',function(e){
     	 	isMoved=true;
     	 	var nodeX=e.pageX-_this.offset().left;
     	 	var nodeY=e.pageY-_this.offset().top;
     	 	_this.css('cursor','move');
     	 });
       $(document).on('mosemove',function(e){
       	    if(isMoved){
       	    	var eX=e.pageX,
       	    	    eY=E.pageY,
       	    	    wX=$(window).width(),
       	    	    wY=$(window).height(),
       	    	    thisXf
       	    	    nX=eX-nodeX,
       	    	    nY=eY-nodeY,
                    thisMarginLeft=_this.offset().left;
       	    	var left,top;
            //越界处理
            var thisLeft=(thisMarginLeft>0)?0 :(-thisMarginLeft);
       	    if(nX<thisLeft){
       	    	left=thisLeft;
       	    }else if(nX>wX-thisX+thisLeft){
       	    	left=wX-thisX+this
       	    }

       	    }
       })
     })
  }
}