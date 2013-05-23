<div id="container">
    <header>
        <div class="cont">
            <h1 id="logo">My Mobile Presentation</h1>
        </div>
    </header>
    <div id="main">
    	<section id="featured" class="clearfix">
        	<div class="cont">
                <figure>
                	<img src="<?php echo Img::get($item->icon, array('w' => 263, 'h' => 263, 'crop' => true, 'resize' => true)) ?>" border="0" />
                </figure>
                <div id="info">
                    <h1><?php echo $item->title ?></h1>
                    <h2><?php echo $item->category->title ?></h2>
                    <p>
                    	<?php echo $item->num_instalations ?> instalations<br>
                    	<?php echo $item->num_likes ?> likes
                   </p>
                    <a href="javacript:void(0)" class="btInstall">Install “<?php echo $item->title ?>” APP</a>
                    <ul class="likeShare">
                        <ul>
                            <li><a href="javascript:void(0)" class="like">Like this APP</a></li>
                            <li><a href="javascript:void(0)" class="share">Share this APP</a></li>
                        </ul>
                    </ul>
                </div>
                <a href="javacript:void(0)" id="btInstall2" class="btInstall">Install “<?php echo $item->title ?>” APP</a>
        	</div>
        </section>
        <section id="description" class="clearfix">
        	<div class="cont">
                <article>
                    <h1>Description</h1>
                    <?php echo $item->description ?>
                </article>
        	</div>
    	</section>
    </div>
    <footer>
        <div class="cont">
            <ul class="likeShare">
                <ul>
                    <li><a href="javascript:void(0)" class="like">Like this APP</a></li>
                    <li><a href="javascript:void(0)" class="share">Share this APP</a></li>
                </ul>
            </ul>
        </div>
    </footer>
</div>