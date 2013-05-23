<!doctype html>
<!-- Conditional comment for mobile ie7 blogs.msdn.com/b/iemobile/ -->
<!--[if IEMobile 7 ]>    <html class="no-js iem7" lang="pt-br"> <![endif]-->
<!--[if (gt IEMobile 7)|!(IEMobile)]><!--> <html class="no-js" lang="pt-br"> <!--<![endif]-->

<head>
  <meta charset="utf-8">

  <base href="<?php echo URL::base() ?>" />

  <title><?php echo $item->slug ?> - My Mobile Presentation</title>
  <meta name="description" content=""/>

  <meta name="HandheldFriendly" content="True"/>
  <meta name="MobileOptimized" content="320"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>

  <link rel="shortcut icon" href="media/img/APP/shortcut.ico"/>

  <link rel="apple-touch-icon-precomposed" href="<?php echo Img::get($item->icon, array('w' => 263, 'h' => 263, 'crop' => true, 'resize' => true)) ?>"/>

  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="black"/>

  <script>(function(){var a;if(navigator.platform==="iPad"){a=window.orientation==0||window.orientation==180?"media/img/APP/startup-tablet-portrait.png":"media/img/APP/startup-tablet-landscape.png"}else{a=window.devicePixelRatio===2?"media/img/APP/startup-retina.png":"media/img/APP/startup.png"}document.write('<link rel="apple-touch-startup-image" href="'+a+'"/>')})()</script>
  <script>(function(a,b,c){if(c in b&&b[c]){var d,e=a.location,f=/^(a|html)$/i;a.addEventListener("click",function(a){d=a.target;while(!f.test(d.nodeName))d=d.parentNode;"href"in d&&(d.href.indexOf("http")||~d.href.indexOf(e.host))&&(a.preventDefault(),e.href=d.href)},!1)}})(document,window.navigator,"standalone")</script>

  <meta http-equiv="cleartype" content="on"/>

  <?php Template::compile_css() ?>

  <script>
    var DEVELOPMENT = true;
    var APP_ID = '<?php echo $item->slug ?>';
  </script>
</head>

<body id="loading" class="templateBase">
  <?php echo View::factory('shared/app_info', array('item' => $item)); ?>

  <div id="messages">
    <div id="offlineError" style="display: none;">
      <img src="media/img/APP/offlineError.png" border="0" />
      <h1>Oops! Você precisa se conectar a internet para iniciar o aplicativo desta vez.</h1>
    </div>
    <div id="appIsDownError" style="display: none;">
      <img src="media/img/APP/appIsDownError.png" border="0" />
      <h1>Oops! Este aplicativo não está disponível no momento.</h1>
    </div>
  </div> <!-- end of #app -->

  <script>
    var isStandalone = (('standalone' in window.navigator) && window.navigator.standalone);

    if(!window.DEVELOPMENT){
      if(!isStandalone){
        document.getElementsByTagName('body')[0].id = ('standalone' in window.navigator) ? 'installMobile' : 'installWeb';
      }
    }else{
      //document.getElementsByTagName('body')[0].id = 'standalone';
    }
  </script>

  <?php Template::compile_js() ?>

  <script>
    $(document).ready(function(){
      PRE_APP.init();
    });
  </script>

  <script> // Change UA-XXXXX-X to be your site's ID
  var _gaq=[["_setAccount","UA-XXXXX-X"],["_trackPageview"]];
  (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];g.async=1;
  g.src=("https:"==location.protocol?"//ssl":"//www")+".google-analytics.com/ga.js";
  s.parentNode.insertBefore(g,s)}(document,"script"));
  </script>

</body>
</html>
