<!doctype html>
<!-- Conditional comment for mobile ie7 blogs.msdn.com/b/iemobile/ -->
<!--[if IEMobile 7 ]>    <html class="no-js iem7" lang="pt-br"> <![endif]-->
<!--[if (gt IEMobile 7)|!(IEMobile)]><!--> <html class="no-js" lang="pt-br"> <!--<![endif]-->

<head>
  <meta charset="utf-8">

  <base href="<?php echo URL::base() ?>" />

  <title>OFFLINE - My Mobile Presentation</title>
  <meta name="description" content=""/>

  <meta name="HandheldFriendly" content="True"/>
  <meta name="MobileOptimized" content="320"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>

  <link rel="shortcut icon" href="media/img/APP/shortcut.ico"/>

  <link rel="apple-touch-icon-precomposed" href="media/img/APP/apple-touch-icon.png"/>

  <meta name="apple-mobile-web-app-capable" content="yes"/>
  <meta name="apple-mobile-web-app-status-bar-style" content="black"/>

  <meta http-equiv="cleartype" content="on"/>

  <?php Template::compile_css() ?>

</head>

<body class="templateBase">

  <div id="messages">
    <div id="offlineError">
      <img src="media/img/APP/offlineError.png" border="0" />
      <h1>Oops! Você precisa se conectar a internet para visualizar este conteúdo.</h1>
    </div>
  </div> <!-- end of #app -->

</body>
</html>
