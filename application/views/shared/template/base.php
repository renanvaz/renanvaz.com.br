<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <base href="<?php echo URL::base(); ?>">
    <title><?php echo Kohana::$config->load('site.title') ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
    <meta name="description" content="<?php echo Kohana::$config->load('site.description') ?>">
    <meta name="author" content="<?php echo Kohana::$config->load('site.author') ?>">

    <!-- Le styles -->
    <?php Template::compile_css() ?>

    <!-- Le fav and touch icons -->
    <link rel="shortcut icon" href="media/img/favicon.ico">
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="media/img/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="media/img/apple-touch-icon-114-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="media/img/apple-touch-icon-72-precomposed.png">
    <link rel="apple-touch-icon-precomposed" href="media/img/apple-touch-icon-57-precomposed.png">

    <script src="http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.6.2/modernizr.min.js"></script>
</head>
<body>
    <!--[if lt IE 10]>
        <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
    <![endif]-->

    <?php echo $header ?>
    <?php echo $content ?>
    <?php echo $footer ?>

    <?php Template::compile_js() ?>

    <script>
        var _gaq=[['_setAccount','<?php echo Kohana::$config->load('site.GA') ?>'],['_trackPageview']];
        (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
        g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g,s)}(document,'script'));
    </script>
</body>
</html>