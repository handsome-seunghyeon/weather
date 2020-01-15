$(document).ready(function(){
    
    
    var lat;
    var lon;

    $.ajax({
       url:"https://ipinfo.io/geo",
        dataType:"json",
        success:function(result){
            var loc = result.loc;
            loc = loc.split(",");
            lat = loc[0];
            lon = loc[1];
        }

    });
                // 위도,경도 검색
//            
//            if(navigator.geolocation){
//                navigator.geolocation.getCurrentPosition(function(position){
//                lat = position.coords.latitude;
//                lon = position.coords.longitude;
//                });
//            }
     
    function secset(){
        var vh = $(window).outerHeight();
        var vw = $(window).outerWidth();
        var hh = $("#hdbar").outerHeight();
        var mh = $("#mid").outerHeight();
        var bh = $("#bot").outerHeight();
        $("section").height(vh-hh);
        $("#top").height(vh-hh-mh-bh);
//        var midh = $("#mid").outerHeight();
        if(vh < vw){
//            $("#mid,#bot").height(110);
            $("#midbot").css("margin-top",vh-hh-220+"px");
        }else{
            $("#midbot").css("margin-top","0px");
//            $("#mid,#bot").removeAttr("style");
        }
    }
    
    secset();
    
    
    $(window).resize(function(){
        secset();
    });
    
    
    
    ///city글자수에 따라 글자크기 지정
    function clen(){
        var len = $("#city").text().length;
        if(len >=14){
            $("#city").addClass("stext");
        }else{
            $("#city").removeClass("stext");
        }
    }
    clen();
    /*
    200번대 번개 bolt
    300번대 약한비 cloud-rain
    400-500번대 강한비 cloud-showers-heavy
    600번대 눈 snowflake
    700번대 흐림/안개    smog
    800번대 맑음 sun
    801번대 구름조금 cloud-sun
    802번대 구름조금 cloud-sun
    803번대 구름조금 cloud
    804번대 구름조금 cloud
    */
    
    //http://api.openweathermap.org/data/2.5/forecast?q=London,us&mode=json&appid=f39332175eaf18dd245263580bb387a0
    //    http://api.openweathermap.org/data/2.5/forecast
    //    q=London // 변하는 값
    //    mode=json
    //    units=metric
    //    appid=201428e5141dbf69529603692f9614db

    
    var link="http://api.openweathermap.org/data/2.5/forecast";
    var myid="f39332175eaf18dd245263580bb387a0";
    function id2icon(id){
        var icon ="";
        if(id>=200 && id<300){
            icon = "fas fa-bolt";
        }else if(id>=300 && id<400){
            icon = "fas fa-cloud-rain";
        }else if(id>=400 && id<600){
            icon = "fas fa-cloud-showers-heavy";     
        }else if(id>=600 && id<700){
            icon = "fas fa-snowflake";
        }else if(id>=700 && id<800){
            icon = "fas fa-smog";
        }else if(id==800){
            icon = "fas fa-sun";
        }else if(id==801 || id==802){
            icon = "fas fa-cloud-sun";
        }else if(id==803 || id==804){
            icon = "fas fa-cloud";
        }
        
        return icon;
    }
    // 0        1           2       3       4           5    6       7
    //|--------|----------|---------|------|----------|----|----|------|
    //9        12        15         18      21      24(0)      3    6
    function settime(tz){
        var now = new Date();
        var result;
        now = now.getUTCHours() + tz;
        
        
        
        if(now >= 0 && now < 3){
            result = 5;
        }else if(now >= 3 && now < 6){
            result =6;
        }else if(now >= 6 && now < 9){
            result =7;
        }else if(now >= 9 && now < 12){
            result =0;
        }else if(now >= 12 && now < 15){
            result =1;
        }else if(now >= 15 && now < 18){
            result =2;
        }else if(now >= 18 && now < 21){
            result =3;
        }else if(now >= 21 && now < 24){
            result =4;
        }
        return result;
    }
    
    function suc(result){
        var timezone = result.city.timezone / 3600;
        var listindex = settime(timezone);
        $("#city").text(result.city.name);
        var icontxt = id2icon(result.list[listindex].weather[0].id);
        $("#icon").removeClass().addClass(icontxt);
        $("#info").text(result.list[listindex].weather[0].description);
        var temp = result.list[listindex].main.temp;
        temp = temp.toFixed(1);
        $(".temp").text(temp);
        var speed = result.list[listindex].wind.speed;
        speed = speed.toFixed(0);
        $("#speed").text(speed);
        $("#hum").text(result.list[listindex].main.humidity);
        var deg = result.list[listindex].wind.deg;
        $("#dir").css("transform","rotate("+deg+"deg)");
        var max = result.list[listindex].main.temp_max;
        var min = result.list[listindex].main.temp_min;
        max = max.toFixed(1);
        min = min.toFixed(1);
        $("#max").text(max);
        $("#min").text(min);
        clen();
        for(i=0;i<5; i++){
            var ftime = new Date(result.list[i*8+2].dt*1000);
            var fmonth = ftime.getMonth() + 1;
            var fdate = ftime.getDate();
            $(".fdate").eq(i).text(fmonth+"/"+fdate);
            var code = result.list[i*8].weather[0].id;
            var icon = id2icon(code);
            $(".fc").eq(i).children("svg").removeClass().addClass(icon);
            var ftemp = result.list[i*8].main.temp;
            ftemp = ftemp.toFixed(1);
            $(".fc").eq(i).children(".ftemp").text(ftemp);
        }
        var sunset = result.city.sunset * 1000;
        sunset = new Date(sunset);
        var now =  new Date();
        if(now < sunset){
            var nowweader = $("#icon").attr("class");
            if(nowweader == "fas fa-sun"){
                $("section").css("background-image","url(images/day_clear.jpg)");//맑음
            }else if(nowweader == "fas fa-cloud"){
                $("section").css("background-image","url(images/day_cloudy.jpg)");//구름
            }else if(nowweader == "fas fa-cloud-rain"){
                $("section").css("background-image","url(images/day_rain.jpg)");//비
            }else if(nowweader == "fas fa-cloud-showers-heavy"){
                $("section").css("background-image","url(images/day_rain.jpg)");//많은 비
            }else if(nowweader == "fas fa-snowflake"){
                $("section").css("background-image","url(images/snow.jpg)");//눈
            }else if(nowweader == "fas fa-bolt"){
                $("section").css("background-image","url(images/bolth.jpg)");//번개
            }else if(nowweader == "fas fa-cloud-sun"){
                $("section").css("background-image","url(images/day_cloudy.jpg)");//안개해
            }
        }else if(now > sunset){
            $("section").css("background-image","url(images/night_clear.jpg)");
        }
    }
//    result.list[0].weather[0].id
    
    function upd(subject){
        var city = $(subject).attr("data");
        if(city != "custom"){
            // 도시명 검색
            $.ajax({
                url: link,
                method: "GET",
                data: {
                    "q": city,
                    "mode": "json",
                    "units": "metric",
                    "appid": myid
                },
                dataType: "json",
                success: suc
            });
        }else{        
            $.ajax({
                url: link,
                method: "GET",
                data: {
                    "lat":lat,
                    "lon":lon,
                    "mode":"json",
                    "units":"metric",
                    "appid":myid
                },
                dataType: "json",
                
                success: suc
            });
            
        }
    }
    
    upd($(".citybtn:nth-of-type(2)"));
    
    $(".citybtn").click(function(){
        upd(this);
    });
    
});
