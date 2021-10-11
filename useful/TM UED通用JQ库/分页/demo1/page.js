/*
function:   page
author:     jin
update:     jlw
depends:    jquery-1.4.pack.js
			
firstTime:  2009-11-13 
lastTime:   2011-11-15
example:	
			<!--数据源-->
			<ul id="pageContentData" style="display:none;">
				<li>list1</li>
				<li>list2</li>
				<li>list3</li>
				<li>list4</li>
				<li>list5</li>
				<li>list6</li>
				<li>list7</li>
				<li>list8</li>
				<li>list9</li>
				<li>list10</li>
				<li>list11</li>
				<li>list12</li>
				<li>list13</li>
				<li>list14</li>
				<li>list15</li>
				<li>list16</li>
				<li>list17</li>
				<li>list18</li>
				<li>list19</li>
				<li>list20</li>
				<li>list21</li>
				<li>list22</li>
				<li>list23</li>
				<li>list24</li>
				<li>list25</li>
				<li>list26</li>
				<li>list27</li>
				<li>list28</li>
				<li>list29</li>
				<li>list30</li>
			</ul>
			<!--/数据源-->
			<!--数据显示区-->
			<ul id="pageContent">
				<li>list1</li>
				<li>list2</li>
				<li>list3</li>
				<li>list4</li>
				<li>list5</li>
			</ul>
			<!--/数据显示区-->
			<!--分页显示区-->
			<div class="page">
				<a href="#" id="btnFirstPage" class="off">首页</a>
				<a href="#" id="btnPrePage" class="off">上一页</a>
				<span id="boxNumPage">
				<a href="#" class="num on">1</a>
				<a href="#" class="num">2</a>
				<a href="#" class="num">3</a>
				<a href="#" class="num">4</a>
				<a href="#" class="num">5</a>
				</span>
				<a href="#" id="btnNextPage" class="">下一页</a>
				<a href="#" id="btnLastPage" class="">尾页</a>
			</div>
			<!--/分页显示区-->
			<script type="text/javascript">
			//page
			$("#pageContentData > li").uePage({
				pageSize:3,
				pageGroud:5,
				pageContentBox:"#pageContent",
				cssBtnOn:"on",
				cssBtnOff:"off",
				btnFirstPage:"#btnFirstPage",
				btnPrePage:"#btnPrePage",
				btnNextPage:"#btnNextPage",
				btnLastPage:"#btnLastPage",
				boxNumPage:"#boxNumPage",
				layerNumPage:"a",
				cssNumPage:"num"
			});
			</script>
*/
(function($){
	$.fn.uePage=function(opt){
		//settings
		var settings=jQuery.extend(
			{
				totalRecord:false,//总记录数
				pageSize:1,//分页大小
				pageIndex:1,//当前页，默认显示页面
				//pageGroud:1,//分页分组，就是显示的分页数，例（分组5）：首页 上页 1 2 3 4 5 下页 尾页
				pageContentBox:"#pageContent",//内容显示处
				cssBtnOn:"on",//当前页css
				cssBtnOff:"off",//按钮无效css
				btnFirstPage:"#btnFirstPage",//首页
				btnPrePage:"#btnPrePage",//上一页
				btnNextPage:"#btnNextPage",//下一页
				btnLastPage:"#btnLastPage",//尾页
				boxNumPage:"#boxNumPage",//数字标签框
				layerNumPage:"a",//数字标签
				cssNumPage:"num",//数字标签css
				renderData:false,//数据生成，用于即时取数据时
				empty:function(){/*alert("empty");*/}//empty finish();
			},
			opt,
			{
				totalPage:0//总页数
			}
		);
		var $this=$(this);//数据源
		//settings
		var totalRecord=settings.totalRecord,
			totalPage=settings.totalPage,
			pageSize=settings.pageSize,
			pageIndex=settings.pageIndex,
			//pageGroud=settings.pageGroud,
			$pageContentBox=$(settings.pageContentBox),
			cssBtnOn=settings.cssBtnOn,
			cssBtnOff=settings.cssBtnOff,
			$btnFirstPage=$(settings.btnFirstPage),
			$btnPrePage=$(settings.btnPrePage),
			$btnNextPage=$(settings.btnNextPage),
			$btnLastPage=$(settings.btnLastPage),
			$boxNumPage=$(settings.boxNumPage),
			layerNumPage=settings.layerNumPage,
			cssNumPage=settings.cssNumPage,
			renderData=settings.renderData;
		//totalrecord
		if(!settings.totalRecord)
		settings.totalRecord=$this.size();
		totalRecord=settings.totalRecord;
		//totalpage
		if(totalRecord>0)
		settings.totalPage=Math.ceil(totalRecord/pageSize);
		totalPage=settings.totalPage;
		//pageSize
		if(!settings.pageGroud)
		settings.pageGroud=$boxNumPage.children().size();
		pageGroud=settings.pageGroud;
		//main
		//
		var goToPage=function(pageI){
			//无效情况
			if(totalPage<1){return false;}
			//
			if(pageI<1){pageI=1;}
			if(pageI>totalPage){pageI=totalPage;}
			//跳转逻辑
			$pageContentBox.empty();
			settings.pageIndex=pageI;
			var star=(pageI-1)*pageSize;
			var end=pageI*pageSize;
			if(end>totalRecord){end=totalRecord}
			if(!renderData){
				for(var i=star;i<end;i++){
					$pageContentBox.append($this.eq(i).clone());
				}
			}else{
				renderData(star, end, $pageContentBox);		
			}
			
			//按钮状态
			$boxNumPage.find(layerNumPage).removeClass(cssBtnOn);
			$btnFirstPage.removeClass(cssBtnOff);
			$btnPrePage.removeClass(cssBtnOff);
			$btnNextPage.removeClass(cssBtnOff);
			$btnLastPage.removeClass(cssBtnOff);
			$btnFirstPage.addClass(cssBtnOn);
			$btnPrePage.addClass(cssBtnOn);
			$btnNextPage.addClass(cssBtnOn);
			$btnLastPage.addClass(cssBtnOn);
			if(pageI==1){
				$boxNumPage.find(layerNumPage).eq(0).addClass(cssBtnOn);
				$btnFirstPage.removeClass(cssBtnOn);
				$btnPrePage.removeClass(cssBtnOn);
				$btnFirstPage.addClass(cssBtnOff);
				$btnPrePage.addClass(cssBtnOff);
				for(var i=0;i<=pageGroud-1;i++){
					$boxNumPage.find(layerNumPage).eq(i).html(i+1);
				}
			}else{
				if(pageI==totalPage){
					$btnNextPage.removeClass(cssBtnOn);
					$btnLastPage.removeClass(cssBtnOn);
					$btnNextPage.addClass(cssBtnOff);
					$btnLastPage.addClass(cssBtnOff);
				}
				var s=parseInt((pageGroud-1)/2);
				if(totalPage>pageGroud && pageI>s){
					var star=(pageI-s);
					var end=(pageI+s);
					if((pageGroud%2)==0){end=(pageI+s+1)}
					if(end>totalPage){
						end=totalPage;
						star=totalPage-pageGroud+1;
					}
					for(var i=star;i<=end;i++){
						$boxNumPage.find(layerNumPage).eq(i-star).html(i);
						$boxNumPage.find(layerNumPage).eq(pageI-star).addClass(cssBtnOn);
					}
				}else{
					$boxNumPage.find(layerNumPage).eq(pageI-1).addClass(cssBtnOn);
				}
			}
		};
		//init
		if(totalPage==0){
			$btnFirstPage.removeClass(cssBtnOn);
			$btnPrePage.removeClass(cssBtnOn);
			$btnNextPage.removeClass(cssBtnOn);
			$btnLastPage.removeClass(cssBtnOn);
			$btnFirstPage.addClass(cssBtnOff);
			$btnPrePage.addClass(cssBtnOff);
			$btnNextPage.addClass(cssBtnOff);
			$btnLastPage.addClass(cssBtnOff);
			$boxNumPage.empty();
			settings.empty();
			$pageContentBox.empty();
		}else if(totalPage==1){
			$btnFirstPage.removeClass(cssBtnOn);
			$btnPrePage.removeClass(cssBtnOn);
			$btnNextPage.removeClass(cssBtnOn);
			$btnLastPage.removeClass(cssBtnOn);
			$btnFirstPage.addClass(cssBtnOff);
			$btnPrePage.addClass(cssBtnOff);
			$btnNextPage.addClass(cssBtnOff);
			$btnLastPage.addClass(cssBtnOff);
			$boxNumPage.html("<"+layerNumPage+" href='#' class='"+cssNumPage+" "+cssBtnOff+"'>1</"+layerNumPage+">");
		}else{
			$btnFirstPage.removeClass(cssBtnOn);
			$btnPrePage.removeClass(cssBtnOn);
			$btnFirstPage.addClass(cssBtnOff);
			$btnPrePage.addClass(cssBtnOff);
			$btnNextPage.removeClass(cssBtnOff);
			$btnLastPage.removeClass(cssBtnOff);
			$btnNextPage.addClass(cssBtnOn);
			$btnLastPage.addClass(cssBtnOn);
			//页数判断
			var lastPage=totalPage;
			if(lastPage>pageGroud){lastPage=pageGroud}
			//分页字符串
			var strPage="";
			for(var i=1;i<=lastPage;i++){
				if(i==1){
					strPage="<"+layerNumPage+" href='#' class='"+cssNumPage+" "+cssBtnOn+"'>"+i+"</"+layerNumPage+">";
				}else{
					strPage+="<"+layerNumPage+" href='#' class='"+cssNumPage+"'>"+i+"</"+layerNumPage+">"
				}
			}
			$boxNumPage.html(strPage);
			//事件
			$boxNumPage.find(layerNumPage).click(function(){
				goToPage(parseInt($(this).html()));
				return false;
			});
			$btnFirstPage.click(function(){
				goToPage(1);
				return false;
			});
			$btnPrePage.click(function(){
				var index=parseInt(settings.pageIndex);
				index=index-1;
				goToPage(index);
				return false;
			});
			$btnNextPage.click(function(){
				var index=parseInt(settings.pageIndex);
				index=index+1;
				goToPage(index);
				return false;
			});
			$btnLastPage.click(function(){
				goToPage(totalPage);
				return false;
			});
		}
		goToPage(pageIndex);
		//return
		$this.data("settings",settings);
		return $this;
    };
})(jQuery);