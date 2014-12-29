
var Nav, DragReveal, app;

$(function(){

    // Sometimes we force no-js mode for fallback version
  if ($('html').hasClass('no-js')) return;

    NoJsMode = function(){
        var obj = this;
        var dir = 'down';

        $('html').removeClass('js').addClass('no-js no-js-mode');

        $('#share-panel').on('click', function(e){
            e.preventDefault();
            $(this).closest('.share-panel').toggleClass('open');
        });

        $('.car').each(function(){
            $(this).on('click', function(){
                var y = $(this).offset().top;
                $('html, body').stop().animate({ 'scrollTop': y}, 600, 'swing');
            });
        });
    };

$( '.slideshow-third' ).cycle();

$(function() {
  var win;
  $(".ch-info .ch-info-back, .twitter-logo").each(function(i, item) {

    $(this).bind("click", function() {
      if (win)
      {
        win.close();
      }

      show_text = $(this).find("p").text();

      var param = $.param({
        url: "http://bit.ly/UhOAJU",
        via: "unocha",
        hashtags: "ReShapeAid",
        text: show_text,
        lang: 'ch'
      });

      win = window.open("https://twitter.com/intent/tweet?" + param, "twitter", "height=300,width=600,modal=yes,alwaysRaised=yes");
      win.focus();
    })


    //$(this).appendTo($link);
  });
});



    PromoteLinks = function(el, clickOrHover){
        var obj = this;
        obj.el = $(el);
    obj.button = obj.el.find('.promote-button');
        obj.sharePanel = $('#share-panel');
        obj.shareBtn = obj.sharePanel.find('.button');

        this.init = function(){
      if (clickOrHover == 'click') {
                obj.button.on('click', obj.onClick);
            } else {
                obj.button.on('mouseenter', obj.onClick);
            }
      obj.el.on('mouseleave', obj.close);
      $('.auto-select', obj.el).on('click', function(){ $(this).select(); });
      $(window).on('scroll', obj.onScroll).on('resize', obj.onResize);

      obj.onResize();
    };
    this.onResize = function(){
      var newTop = obj.el.height() * -1;
      obj.el.css('top', newTop);
    };
    this.onScroll = function(){
      if (obj.el.hasClass('open')) obj.close();
    };
    this.onClick = function(e){
      e.preventDefault();
      obj.setColor();
      obj.el.toggleClass('open').toggleClass('ontop');

      if (obj.el.hasClass('wallpapers')) obj.populateLinks();
    };
    this.close = function(){
      if (obj.el.hasClass('open')) obj.el.removeClass('open');
    };
    this.setColor = function(){
            var bg = obj.button.css('backgroundColor');
            var color = obj.button.css('color');
            obj.el.css('background', bg).css('color', color);
            //obj.sharePanel.add(obj.shareBtn).css('background', bg).css('color', color);
        };
    this.populateLinks = function(){
      $('li a', obj.el).each(function(){
        var size = $(this).attr('data-size');
        $(this).attr('href', 'bond-img/'+size+'/c'+app.currPage+'.jpg'); //'bond-img/bond-download.php?file=bond-img/'+size+'/c'+app.currPage+'.jpg');
      });
    };
        this.init();
    };




    DragReveal = function(el){
        var obj = this;
        obj.el = $(el);

        this.maskDiv = obj.el.find('.photo-mask');
        this.maskWidth = obj.maskDiv.width();
        this.dragger = $(".dragger", obj.el);
        this.draggerOrigin = obj.dragger.attr('data-x');

        this.init = function(){
            obj.dragger.draggable({
                axis: "x",
                containment: "parent",
                drag: obj.onDrag,
                stop: obj.onDrop
            });
        };
        this.onDrag = function(event, ui) {
            var newWidth = ui.position.left + 67;
            obj.maskDiv.width(newWidth);
        };
        this.onDrop = function(event, ui) {
            obj.maskDiv.animate({'width': obj.maskWidth}, 200 );
            obj.dragger.animate({'left': obj.draggerOrigin}, 500, "easeOutBack");
        };
        this.init();
    };

    CarNav = function(el){
        var obj = this;
        obj.el = $(el);

        this.prevCurr = 1;   // use this to calculate distance between cars when switching
    this.active = [];

        this.init = function(){
            obj.onResize(null);
            $(window).on('scroll', obj.snapPointListener);
            $('li', obj.el).on('click', obj.onNavClick);
        };
        this.onResize = function(wh){
            var ul = obj.el.find('ul');
      var offset = (wh - ul.height() ) / 2;
      ul.css('top', offset);
        };
        this.onNavClick = function(e, n, speed){
            var n = n || $(e.target).closest('li').index()+1;
            if (e)  e.preventDefault();

            if (Math.abs(obj.prevCurr - n)==1) obj.switchCar(n);
            obj.changePageTransition(n, speed);
        };
    this.snapPointListener = function(){
            var yPos = $(window).scrollTop();
      var n = Math.floor(yPos / app.PAGEHEIGHT);
            if (n == app.currPage) return;

            obj.switchCar(n);
        };

    this.switchCar = function(n){
            obj.prevCurr = app.currPage;
            app.currPage = n;
      obj.setActiveNavItem(n);
            obj.setActiveCar(n);
    };
    this.goPrevious = function(){
      if (app.currPage == 1) return;
      app.currPage--;
      obj.onNavClick(null, app.currPage);
    };
    this.goNext = function(){
      if (app.currPage == app.numOfCars) return;
      app.currPage++;
      obj.onNavClick(null, app.currPage);
    };

        this.setActiveCar = function(n){
            if (Math.abs(obj.prevCurr - n)>1) return;

            app.aCars.eq(n).addClass('adjacent').removeClass('active');
      if (n-2 >= 0) app.aCars.eq(n-2).addClass('adjacent').removeClass('active');
      if (n-1 >= 0) app.aCars.eq(n-1).addClass('active').removeClass('adjacent');
      // hide old adjacents, lower down the car stack - don't need to worry about ones above cos they are 0px x 0px
      app.aCars.filter(':gt('+(n)+')').removeClass(' active adjacent');
        };
        this.setActiveNavItem = function(n){
            $('li', obj.el).removeClass('current').eq(n-1).addClass('current');
        };
        this.changePageTransition = function(n, sp){
            var yPos = app.getScrollPosFromCurrent(n),
                dirDown = (n > app.currPage) ? true : false,
                distance = Math.abs(obj.prevCurr - n),
                speed = (distance/4) * 2000,
        carEase = (distance < 4) ? 'linear' : 'swing';

            speed = (speed < 400) ? 400 : speed;    // min speed
            if (sp) speed = sp;
            $('html, body').stop().animate({ 'scrollTop': yPos}, speed, carEase);
        };
        this.init();
    }

    app = {

        PAGEHEIGHT:     1000, // never change this, not unless you want to re-write ALL of your data-animations in your HTML
    NOJSMODE:       false,

        numOfCars:      0,
        currPage:       0,
        prevScroll:     -100,
        aCars:          new Array(),

        bodyWrap:       $('#body-wrap'),
        carsLayer:      $('#cars-layer'),
        carsNav:        [],
        promote:        null,

        init: function(){

      app.preloadImages();

            app.aCars = $('.car', app.carsLayer);
            app.numOfCars = app.aCars.length;

            // iPad?
            var isiPad = navigator.userAgent.match(/iPad/i) != null;
            if (isiPad) {
                $('#js-body').addClass('isiPad');
                new PromoteLinks($('.promote-panel.embed'), 'click');
            }

            // FALLBACK to no-js-mode if less than 960! - phones can't handle all the skrollr stuff
      if ($(window).width() < 960) {

        new NoJsMode();

      } else {

                var highcharts_box = $('#c2'),
                boxDone = false,
                boxRedrawn = false;

                // DESKTOP Skrollr version
        skrollr.init({
          forceHeight: false,
          render: function(){
                        /* Prepare the charts when active */
                        if ( highcharts_box.hasClass('adjacent')) {
                            if ( ! boxDone ) {
                                boxDone = true;
                              // load_highcharts();
          //   clear_highcharts();
                            }

          console.log("RELOAD");

          if (boxRedrawn)
          { clear_highcharts(); }
                        }

                        /* Redraw the charts when the slide is active */
                        if (highcharts_box.hasClass('active')) {
                            if ( ! boxRedrawn ) {
                                boxRedrawn = true;
                               load_highcharts();

                            }
                        }
                        else
                        {
                          boxRedrawn = false;
                        }



          }
        });

        // set body height
        var bodyHeight = (app.numOfCars * app.PAGEHEIGHT) + (app.PAGEHEIGHT*2); // front page + hidden page
        $('body').height(bodyHeight);

        // Instantiate CarNav, Draggables, Promote and share panels.
        app.carsNav = new CarNav('#cars-nav');
        $('.promote-panel').each(function(){ new PromoteLinks(this); });
        $('.photo-mask-wrap').each(function(){ new DragReveal(this); });

                $('#front-page').find('a, .family-circle').on('click', function(){
                    app.carsNav.onNavClick(null, 1, 1600);
                    return false;
                });

                $('#share-panel')
                    .on('hover', function(){ $(this).closest('.share-panel').toggleClass('open'); })
                    .on('click', function(){ return false; });

                $(document)
                    .on('keydown', app.onKeypress);
                $(window)
                    .on('scroll', app.onScroll)
                    .on('load', app.onLoad)
          .on('resize', app.onResize);
          app.onResize();   // do it now!
      }
        },
        onScroll: function(){
            var yPos = $(window).scrollTop();
            if (app.prevScroll < 0) {
                setTimeout(function(){ $(window).scrollTop(1); }, 600);
            }
            app.prevScroll = yPos;
            //$('#scrollY').html(yPos);
        },
        onLoad: function(){},
        onResize: function(){
            // set bodyWrap height
            app.bodyWrap.height($(window).height());

            // aspect ratio?
            var ww = $(window).width();
            var wh = $(window).height();
            var isLandscape = (ww > wh);

            // cars layer - force square using longest side
            var sq = (isLandscape) ? Math.ceil(ww * 1.5) : Math.ceil(wh * 1.5);
            var leftOffset = Math.ceil(((sq - ww ) / 2)*-1);
            var topOffset = Math.ceil(((sq - wh ) / 2)*-1);
            app.carsLayer.width(sq).height(sq).css({
                'left': leftOffset,
                'top': topOffset
            });

            // resize the nav
            app.carsNav.onResize(wh);
        },
    onKeypress: function(e){
            if ($('.embed.open').length) return;
            switch(e.keyCode){
                case 37:    app.carsNav.goPrevious(); break;
                case 39:    app.carsNav.goNext(); break;
                default:
            }
        },
        getScrollPosFromCurrent: function(n){
            return ((n-1) * app.PAGEHEIGHT) + app.PAGEHEIGHT;
        },
        getCurrentFromScrollPos: function(){
            return Math.floor($(window).scrollTop() / 1000);
        },
        preloadImages: function(){
            $('.illustration, .date', app.carsLayer).each(function(){
                var path = $(this).css('backgroundImage').substring(4).replace(/(\s+)?.$/, '');
                var img = new Image();
                img.src = path;
                //img.onload = function(){ console.log(path + ' loaded!'); };
            });
        },
        isLandscape: function(){
            var ww = $(window).width();
            var wh = $(window).height();
            return (ww > wh);
        }
    };
    app.init();
});


$("#c5 a[href^='http://']").attr("target","_blank");
$("#c11 a[href^='http://']").attr("target","_blank");

var chart1;
var chart2;


function clear_highcharts()
{
  var seriesLength = chart1.series.length;
  for(var i = seriesLength - 1; i > -1; i--) {
     chart1.series[i].remove();
  }

  seriesLength = chart2.series.length;
  for(var i = seriesLength - 1; i > -1; i--) {
     chart2.series[i].remove();
  }

}

function redraw_highcharts()
{
  chart1.update();
  chart2.update();
}

function load_highcharts()
{

  $(document).ready(function () {
    var chart1_opts = {
        chart : {
          renderTo : 'chartone',
          type : 'spline',
          backgroundColor:'rgba(255, 255, 255, 1)',
          spacingBottom: 20,
          spacingTop: 20,
          spacingLeft: 20,
          spacingRight: 20
        },
        title: {
            text: '需要援助的人数（单位：百万）',
            align : 'left',
            style: {
                color: 'rgb(85,85,85)',
                font: '24px "Open Sans", sans-serif'
           }
        },

        colors : ['rgb(249,82,70)'],

        xAxis : {
          type : 'category',
          dateTimeLabelFormats : {
            year : '%b'
          }
        },
        yAxis : {
          title : {
            text : '百万人'
          },
          min : 0,
          tickInterval: 10,
          gridLineColor: 'rgb(221,221,221)',
          labels: {
                style: {
                    color: 'rgb(249,82,70)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                    }
            }
        },

        legend : {
          enabled : false
        },
        credits : {
          enabled : false
        },
        tooltip : {
          formatter : function () {
            return '<b>' + this.series.name + '</b><br/>' +
            this.x + ': ' + this.y + ' million';
          }
        },
        plotOptions : {
          area : {
            lineWidth : 5,
            marker : {
              enabled : true,
                  radius : 5,
              states : {
                hover : {
                  enabled : true,
                  radius : 5
                }
              }
            },
            shadow : false,
            states : {
              hover : {
                lineWidth : 5
              }
            }
          }
        },

        series : [{
            name : 'People in need',
            type : "area",
            fillColor : {
              linearGradient : [0, 0, 0, 300],
              stops : [
                [0, 'rgba(249,82,70,.6)'],
                [1, 'rgba(249,82,70,.2)']
              ]
            },

            data : [
         //     [2002, 39],
              [2003, null],
              [2004, null],
              [2005, 40],
              [2006, 32],
              [2007, 26],
              [2008, 28],
              [2009, 43],
              [2010, 53],
              [2011, 65],
              [2012, 62],
              [2013, 73]
            ]
          }
        ]
      };
    chart1 = new Highcharts.Chart(chart1_opts);
  });

  $(document).ready(function () {
    var chart2_opts = {
        chart : {
          renderTo : 'charttwo',
          type : 'spline',
          backgroundColor:'rgb(255, 255, 255)',
          spacingBottom: 20,
          spacingTop: 20,
          spacingLeft: 20,
          spacingRight: 20

        },
        title: {
            text: '所需资金（单位：十亿）',
            align : 'left',
            style: {
                color: 'rgb(85,85,85)',
                font: '24px "Open Sans", sans-serif'
           }
        },
        colors : ['rgb(51,103,191)'],

        xAxis : {
          type : 'category',
          dateTimeLabelFormats : {
            year : '%b'
          }
        },
        yAxis : {
          title : {
            text : '十亿美元'
          },
          min : 0,
          tickInterval: 2,
          gridLineColor: 'rgb(221,221,221)',
          labels: {
                style: {
                    color: 'rgb(51,103,191)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                    }
            }
        },
        legend : {
          enabled : false
        },
        credits : {
          enabled : false
        },
        tooltip : {
          formatter : function () {
            return '<b>' + this.series.name + '</b><br/>' +
            this.x + ': ' + this.y + ' billion';
          }
        },
        plotOptions : {
          area : {
            lineWidth : 5,
            marker : {
              enabled : true,
                  radius : 5,
              states : {
                hover : {
                  enabled : true,
                  radius : 5
                }
              }
            },
            shadow : false,
            states : {
              hover : {
                lineWidth : 5
              }
            }
          }
        },

        series : [{
            name : 'Funding requirements',
            type : "area",
            fillColor : {
              linearGradient : [0, 0, 0, 300],
              stops : [
                [0, 'rgba(51,103,191,.6)'],
                [1, 'rgba(51,103,191,.2)']
              ]
            },

            data : [
             // [2002, null],
              [2003, 5.3],
              [2004, 3.0],
              [2005, 5.0],
              [2006, 4.8],
              [2007, 4.4],
              [2008, 6.3],
              [2009, 9.5],
              [2010, 9.5],
              [2011, 7.9],
              [2012, 8.8],
              [2013, 12.9]
            ]
          }
        ]
      };

    chart2 = new Highcharts.Chart(chart2_opts);
  });
}


$(function() {

  $("#dial-knob").knob({
    readOnly: true
  });



  var manifest=[
    //{id: "#slides-01-07-and-18", src: "http://ocha.smugmug.com/photos/i-VdnsqGv/0/O/i-VdnsqGv.jpg", cycle_title: 2013, cycle_desc: "Conflict, Syria", cycle_credit: "OCHA/Gemma Connell"},
    {id: "#slides-01-07-and-18", src: "http://ocha.smugmug.com/photos/i-p3Hmmkv/0/O/i-p3Hmmkv.jpg", cycle_title: 2010, cycle_desc: "洪水，巴基斯坦", cycle_credit: "联合国难民署/ Eduardo Diaz"},
    {id: "#slides-01-07-and-18", src: "http://ocha.smugmug.com/photos/i-dnqScD3/0/O/i-dnqScD3.jpg", cycle_title: 2013, cycle_desc: "台风海燕，菲律宾", cycle_credit: "人道主义事务协调厅/ Joey Reyna"},
    {id: "#slides-01-07-and-18", src: "http://ocha.smugmug.com/photos/i-mSWcCTS/0/O/i-mSWcCTS.jpg", cycle_title: 2010, cycle_desc: "洪水，巴基斯坦", cycle_credit: "联合国照片/联合国儿童基金会/ZAK"},
//    {id: "#slides-01-07-and-18", src: "http://ocha.smugmug.com/photos/i-p3Hmmkv/0/O/i-p3Hmmkv.jpg", cycle_title: 2010, cycle_desc: "Flooding, Pakistan", cycle_credit: "UNHCR/Eduardo Diaz"},
//    {id: "#slides-01-07-and-18", src: "http://ocha.smugmug.com/photos/i-PfHBLgX/0/O/i-PfHBLgX.jpg", cycle_title: 2012, cycle_desc: "Hurricane Sandy, Haiti", cycle_credit: "UN MINUSTAH/Logan Abassi"},
//    {id: "#slides-01-07-and-18", src: "http://ocha.smugmug.com/photos/i-t4cfwqn/0/O/i-t4cfwqn.jpg", cycle_title: 2012, cycle_desc: "Refugee camp, Iraq", cycle_credit: "UNHCR/Jerome Seregni"},
    {id: "#slides-01-07-and-18", src: "http://ocha.smugmug.com/photos/i-QNJTVDD/0/O/i-QNJTVDD.jpg", cycle_title: 2010, cycle_desc: "难民营，埃塞俄比亚", cycle_credit: "联合国照片/ Eskinder Debebe"},
//    {id: "#slides-08-17", src: "http://ocha.smugmug.com/photos/i-CH5FSpB/0/O/i-CH5FSpB.jpg", cycle_title: 2011, cycle_desc: "Hurricane Sandy, Haiti", cycle_credit: "MINUSTAH/Logan Abassi"},
    {id: "#slides-08-17", src: "http://ocha.smugmug.com/photos/i-PCRzLCQ/0/O/i-PCRzLCQ.jpg", cycle_title: 2011, cycle_desc: "洪水，巴基斯坦", cycle_credit: "联合国儿童基金会/Asad Zaidi"},
//    {id: "#slides-08-17", src: "http://ocha.smugmug.com/photos/i-Cp7ZprP/0/O/i-Cp7ZprP.jpg", cycle_title: 2010, cycle_desc: "Hurricane Sandy, Haiti", cycle_credit: "MINUSTAH/Logan Abassi"},
    {id: "#slides-08-17", src: "http://ocha.smugmug.com/photos/i-PRvSmT2/0/O/i-PRvSmT2.jpg", cycle_title: 2011, cycle_desc: "洪水，巴基斯坦", cycle_credit: "联合国难民署/ Eduardo Diaz"},
    {id: "#slides-08-17", src: "http://ocha.smugmug.com/photos/i-7Dzrj7p/0/O/i-7Dzrj7p.jpg", cycle_title: 2012, cycle_desc: "境内流离失所者营地，苏丹", cycle_credit: "非洲联盟—联合国达尔富尔混合行动/ Albert González Farran"},
//    {id: "#slides-08-17", src: "http://ocha.smugmug.com/photos/i-tztwTtQ/0/O/i-tztwTtQ.jpg", cycle_title: 2013, cycle_desc: "Conflict, Syria", cycle_credit: "OCHA/Gemma Connell"},
    {id: "#slides-08-17", src: "http://ocha.smugmug.com/photos/i-g5W3Q4t/0/O/i-g5W3Q4t.jpg", cycle_title: 2010, cycle_desc: "洪水，马里", cycle_credit: "人道主义事务协调厅/ Diakaridia Dembélé"},
    {id: "#slides-08-17", src: "http://ocha.smugmug.com/photos/i-GT5Wktb/0/O/i-GT5Wktb.jpg", cycle_title: 2013, cycle_desc: "台风海燕，菲律宾", cycle_credit: "联合国难民署/ R.Rocamora-Tacloban"},
    {id: "#slides-08-17", src: "http://ocha.smugmug.com/photos/i-mf9P2qB/0/O/i-mf9P2qB.jpg", cycle_title: 2013, cycle_desc: "台风海燕，菲律宾", cycle_credit: "人道主义事务协调厅/ Gemma Cortes"},
//i-LK5KMP9
    {id: "#slides-08-17", src: "http://ocha.smugmug.com/photos/i-LK5KMP9/0/O/i-LK5KMP9.jpg", cycle_title: 2011, cycle_desc: "难民营，肯尼亚", cycle_credit: "国际移民组织/联合国难民署/ Brendan Bannon"}

  ];

    var current_id = "";
    var queue = new createjs.LoadQueue(false);
    queue.on("fileload", handle_file_complete, this);
    queue.on("complete", handle_queue_complete, this);
    queue.on("progress", handle_queue_progress, this);

    queue.loadManifest(manifest);

    function handle_file_complete(event)
    {
/*      if (current_id == "")
      {
        current_id = event.item.id;
  var $target = $(current_id).closest(".cycle-slideshow");
  $target.cycle("reinit");
      }
      else
      {
        if ( current_id != event.item.id )
  {
    var $target = $(current_id).closest(".cycle-slideshow");
    $target.cycle("reinit");
    curent_id = event.item.id;
  }
      }
*/
      var image = event.result;
      $(image).attr("data-cycle-title", event.item.cycle_title);
      $(image).attr("data-cycle-desc", event.item.cycle_desc);
      $(image).attr("data-cycle-credit", event.item.cycle_credit);
      $(event.item.id).prepend(image);

      if (current_id == "")
      {
        current_id = event.item.id;
        var $target = $(current_id).closest(".cycle-slideshow");
        $target.cycle("reinit");
      }
      else
      {
        if ( current_id != event.item.id )
        {
          var $target = $(current_id).closest(".cycle-slideshow");
          $target.cycle("reinit");
          current_id = event.item.id;

    $target = $(current_id).closest(".cycle-slideshow");
          $target.cycle("reinit");
        }
      }

//      $(event.item.id).closest(".cycle-slideshow").cycle("reinit");
    }

    function handle_queue_complete(event)
    {
      $(current_id).closest(".cycle-slideshow").cycle("reinit");
      $("#dial-knob").parent().fadeOut("slow");
    }

    function handle_queue_progress(event)
    {
      var progress = Math.floor(event.loaded * 100);
      $("#dial-knob").val(progress).trigger("change");
    }

  });
