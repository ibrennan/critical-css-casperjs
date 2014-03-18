Critical CSS - CasperJS
=====================

Author: @nannerB / http://ibrennan.co.uk

Inspired by this post from Paul Kinlan: http://paul.kinlan.me/detecting-critical-above-the-fold-css/

JS functionality based on this snippet: https://gist.github.com/PaulKinlan/6284142

Instructions for use:

1. Ensure you have CasperJS installed on your machine: http://casperjs.org
2. Copy critical-css.js to you project root directory.
3. Open Terminal, and CD to your site directory "CD ~/path/to/site/root"
4. Then run "casperjs critical-css.js"
5. Follow the prompts on screen
6. Open your output file, and copy it's contents
7. Paste the contents into your sites <head> section (before your .css link href's)
8. Enjoy your freshly optimised site.


You can do a before an after analysis with this tool: https://developers.google.com/speed/pagespeed/insights/


As an added bonus, if you use build scripts like Grunt or Gulp you should make this process part of that.
