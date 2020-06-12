$(function(){
	//点击切换现象卡
	$(".weather-day").click(function(){
		$(".weather-hour>span").css({
			"borderBottom": "0.02rem solid transparent"
		})
		$(".weather-day>span").css({
			"borderBottom": "0.02rem solid white"
		})
		$(".baogao-day").show().siblings().hide();
	})
	$(".weather-hour").click(function(){
		$(".weather-day>span").css({
			"borderBottom": "0.02rem solid transparent"
		})
		$(".weather-hour>span").css({
			"borderBottom": "0.02rem solid white"
		})
		$(".baogao-hour").show().siblings().hide();
	})
	
	//根据时间改变背景颜色
	function steBackgroundColor(){
		let datee = new Date().getHours(); 
		let weather = $(".weather-box");
		console.log(datee);
		let t = "";
		if(datee >=6 && datee <12){
			//早上
			t="morning";
		}else if(datee >=12 && datee <19){
			//下午
			t="afternoon";
		}else{
			t="night";
			//晚上
		}
		weather.addClass(t);
	}
	steBackgroundColor();
	

	//----------------------------------------------------------------------
	//定位
	let currentIndex = 0;
	//获取逐时,逐日标题下标
	$(".cn").on("click",function(){
		let index = $(this).index();
		// console.log(index);
		console.log($(this).data("type"));
	})
	//----------------------------------------------------------------------

	//搜索框查询城市
	$(".search-icon").click(function(){
		// //获取输入框的值
		let city = $(".search-ipt").val();
		// //把输入框的值赋值给城市天气函数
		// getWeatherCity($(".search-ipt").val());
		getWeatherCity(city);
		
	})

	//定位当前城市
	function locationIP(){
		$.ajax({
			url:"https://apis.map.qq.com/ws/location/v1/ip",
			type:"GET",
			data:{
				key:"UJGBZ-AA5CS-HGQON-6AQA5-VHCXE-O3B2K",
				output:"jsonp",
			},
			dataType:"jsonp",
			success:function(result){
				console.log("城市result==>",result);
				//获取城市
				getWeatherCity(result.result.ad_info.city);
				
				
			},
			error:function(err){
				console.log("err==>",err)
			}
		});
	}
	// 获取城市天气数据
	function getWeatherCity(city){
		$.ajax({
			url:'https://api.heweather.net/s6/weather/',
			type:'GET',
			data:{
				key:'cafce6a9fde94b5e92a9e93dc3e7f66a',
				location:city,
			},	
			dataType:'json',
			success:function(result){
				console.log("实况result==>",result);
				//动态接收部分天气数据
				let nowHeWeather6 = result.HeWeather6[0];
				//如果城市不存在
				if(result.HeWeather6[0].status == 'unknown location'){		
					alert("不存在该城市天气");
					$(".search-ipt").val("");
					return;
				}
				$(".location-text").html(city);
				//清空输入框的值
				$(".search-ipt").val("");
				
				//===============================================
				for(let i=0;i<5;i++){
					let str = "";
					if($(".cn").data("type") == "daily_forecast"){
						console.log("逐时预告");
						str = `<li class="baogao-item">
								<div class="day" id="date">06-08</div>
								<div class="day-cloud" id="cond_txt_d">阴</div>
								<div class="day-cloud-icon" id="cond_code_d"></div>
								<div class="day-temp">28°~36°</div>
							</li>`
					}
				}
				
				//==============================================
				// 温度
				$("#tmp").html(nowHeWeather6.now.tmp + "°");
				//温度范围
				$(".cloud-right").html(nowHeWeather6.daily_forecast[0].tmp_min +"~"+nowHeWeather6.daily_forecast[0].tmp_max);
				//风力,可见度,相对湿度
				$('.w').each(function(){
					//获取当前对象id
					let id = $(this).attr("id");
					$(this).html(nowHeWeather6.now[id]);
				})
				
				//获取5天天气数据
				//5天日期
				$(".day").each(function(i){
					//获取当前对象id
					let id = $(this).attr("id");
					//获取api对应下标的的数据
					let daily = result.HeWeather6[0].daily_forecast[i];
					//去数据的日期
					let date = daily[id].slice(5);
					//载入数据
					$(".day").eq(i).html(date);
				});
				//5天天气情况
				$(".day-cloud").each(function(i){
					//获取当前对象id
					let id = $(this).attr("id");
					//获取api对应下标的的数据
					let daily = result.HeWeather6[0].daily_forecast[i];
					//载入数据
					$(".day-cloud").eq(i).html(daily[id]);
				});
				//5天天气图标day-cloud-icon
				$(".day-cloud-icon").each(function(i){
					// console.log(i);
					let daily = result.HeWeather6[0].daily_forecast[i];
					// console.log(daily.cond_code_d);
					// console.log($(".day-cloud-icon").eq(i));
					$(".day-cloud-icon").eq(i).css({
						"background": "url(images/"+daily.cond_code_d+".png) no-repeat",
						"background-size": "cover"
					});
				});
				//5天最低到最高温度
				$(".day-temp").each(function(i){
					// console.log(i)
					//获取api对应下标的的数据
					let daily = result.HeWeather6[0].daily_forecast[i];
					//载入数据
					$(".day-temp").eq(i).html(daily.tmp_min +"°~"+daily.tmp_max +"°");
				});



				//获取5小时的天气数据
				//5小时每小时时间
				$(".hour").each(function(i){
					//获取当前对象id
					let id = $(this).attr("id");
					//获取api对应下标的的数据
					let daily = result.HeWeather6[0].hourly[i];
					//取数据的小时
					let time = daily[id].slice(11);
					// console.log(time);
					//载入数据
					$(".hour").eq(i).html(time);
				});
				//5小时天气情况
				$(".hour-cloud").each(function(i){
					//获取当前对象id
					let id = $(this).attr("id");
					//获取api对应下标的的数据
					let daily = result.HeWeather6[0].hourly[i];
					//载入数据
					$(".hour-cloud").eq(i).html(daily[id]);
				});
				// 5小时天气图标day-cloud-icon
				$(".hour-cloud-icon").each(function(i){
					// console.log(i);
					let daily = result.HeWeather6[0].hourly[i];
					// console.log(daily.cond_code);
					// console.log($(".hour-cloud-icon").eq(i));
					$(".hour-cloud-icon").eq(i).css({
						"background": "url(images/"+daily.cond_code+".png) no-repeat",
						"background-size": "cover"
					});
				});
				//5小时温度
				$(".hour-temp").each(function(i){
					// console.log(i)
					//获取当前对象id
					let id = $(this).attr("id");
					//获取api对应下标的的数据
					let daily = result.HeWeather6[0].hourly[i];
					//载入数据
					$(".hour-temp").eq(i).html(daily[id] + "°");
				});

				//获取分钟级降水
				geMinTrainfall(nowHeWeather6.basic.lon,nowHeWeather6.basic.lat);
				
			},
			error:function(err){
				console.log("err==>",err)
			}
		})
	}

	//分钟级降水
	function geMinTrainfall(lon,lat){
		// lon经度
		// lat纬度
		$.ajax({
			type:'GEt',
			url:'https://api.heweather.net/s6/weather/grid-minute',
			data:{
				location:lon +","+ lat,
				key:'cafce6a9fde94b5e92a9e93dc3e7f66a',
			},
			success:function(result){
				console.log("result==>",result);
				$("#txt").html(result.HeWeather6[0].grid_minute_forecast.txt);
			},
			error:function(err){
				console.log("err==>",err)
			}
		})
		
	}
	locationIP();
	
})