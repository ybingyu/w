var uri=location.href.split("/");
var page ;
var uri_last = uri[uri.length-1];
var linkName = uri_last.substring(uri_last.indexOf(theLink)+theLink.length);
var _underline ;
_underline = linkName.indexOf('_') > -1 ;

if( _underline ){
	page = linkName.replace("_","");
}
else{
	page = uri_last.split(",")[1];
}
page	=parseInt(page.split(".")[0]);
var page_offset	=(page==1)?0:(page-1)*page_count;
var prvPage		=(page_offset==0)?1:page-1;
var nxtPage		=(page_offset + page_count >= totalrecord)?page:page+1;
var TotalPage	=Math.ceil(totalrecord/page_count);
TotalPage	=(TotalPage==0)?1:TotalPage;
var pageHTML="<div class='page_version2'>";
// style='font-family:Webdings;font-size:14px;' 3
pageBase="<span style='font-size:9pt'><!--<font color='#ff0000'>"+totalrecord+"</span>results  <span color='#ff0000'>"+TotalPage+"</span> pages total   -->";
if(TotalPage==1 || page==1){
	pageHTML+="<span class='no_link'>第一页</span>";
}	
else if ( _underline )
{
	pageHTML+="<a href='"+theLink+"_1.shtml'>第一页</a>";
}
else{
	pageHTML+="<a href='"+theLink+",1.shtml'>第一页</a>";
}	
if(prvPage==page)
{
	pageHTML+="<span class='no_link'>上一页</span>";
}	
else if ( _underline )
{
	pageHTML+="<a title='上一页' href='"+theLink+"_"+prvPage+".shtml'>上一页</a>";
}
else{
	pageHTML+="<a title='上一页' href='"+theLink+","+prvPage+".shtml'>上一页</a>";
}
if(TotalPage<=10)
{
	var offset_left=1;
	var offset_right=TotalPage; 
}
else 
{
	if(page-5<1)
	{
		var offset_left=1;
		var offset_right=10; 
	}
	else
	{ 
		if(page+4>TotalPage)
		{
			var offset_left=TotalPage-9;
			var offset_right=TotalPage; 	
		}
		else
		{
			var offset_left=page-5;
			var offset_right=page+4; 	
		}
	}
}
for(var i=offset_left;i<=offset_right;i++)
{
	if(page==i)
	{
		pageHTML+="<SPAN class=current>"+i+"</SPAN>";
	}		
	else if ( _underline )
	{
		pageHTML+="<a href='"+theLink+"_"+i+".shtml'>"+i+"</a>";
	}
	else{
		pageHTML+="<a href='"+theLink+","+i+".shtml'>"+i+"</a>";
	}
		
}
//style='font-family:Webdings;font-size:14px;' 4
if(nxtPage==page)
{
	pageHTML+="<span class='no_link'>下一页</span> ";
}	
else if ( _underline )
{
	pageHTML+="<a title='下一页' href='"+theLink+"_"+nxtPage+".shtml'>下一页</a>";
}
else{
	pageHTML+="<a title='下一页' href='"+theLink+","+nxtPage+".shtml'>下一页</a>";
}
	
if(TotalPage==page || TotalPage==1)
{
	pageHTML+="<span  class='no_link'>最后一页</span>";
}	
else if ( _underline )
{
	pageHTML+="<a href='"+theLink+"_"+TotalPage+".shtml'>最后一页</a>";
}
else{
	pageHTML+="<a href='"+theLink+","+TotalPage+".shtml'>最后一页</a>";
}

if(document.getElementById("topPage"))
{
	document.getElementById("topPage").innerHTML=pageHTML;
}
pageHTML += "<div style='clear:both'></div></div>";
document.write(pageBase+pageHTML);

